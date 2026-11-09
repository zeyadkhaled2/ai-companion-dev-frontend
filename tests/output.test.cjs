const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
const exportsObject = {};
vm.runInNewContext(
  ts.transpileModule(
    fs.readFileSync(path.join(__dirname, '../src/features/output/data/challenges.ts'), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText,
  { exports: exportsObject },
);
const { OUTPUT_CHALLENGES, challengesFor } = exportsObject;

test('challenge bank has unique IDs and three puzzles per level', () => {
  assert.equal(new Set(OUTPUT_CHALLENGES.map((item) => item.id)).size, OUTPUT_CHALLENGES.length);
  for (const level of ['Easy', 'Medium', 'Hard']) assert.equal(challengesFor(level).length, 3);
});
for (const challenge of OUTPUT_CHALLENGES) {
  test(`verified output and trace: ${challenge.id}`, () => {
    const output = [];
    // Only trusted repository fixtures run here, never user input or app runtime code.
    vm.runInNewContext(
      challenge.code,
      { console: { log: (...args) => output.push(args.map(String).join(' ')) } },
      { timeout: 1000, microtaskMode: 'afterEvaluate' },
    );
    assert.equal(output.join('\n'), challenge.options[challenge.answer]);
    assert.equal(
      challenge.steps
        .flatMap((step) => (step.output === undefined ? [] : [step.output]))
        .join('\n'),
      output.join('\n'),
    );
    assert.equal(new Set(challenge.options).size, challenge.options.length);
    for (const step of challenge.steps) {
      assert.ok(step.explanation.length > 0);
      for (const line of step.lines)
        assert.ok(line >= 1 && line <= challenge.code.split('\n').length);
    }
  });
}

function progressModule(storage) {
  const result = {};
  const source = fs.readFileSync(
    path.join(__dirname, '../src/features/output/data/progress.ts'),
    'utf8',
  );
  vm.runInNewContext(
    ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    {
      exports: result,
      require(id) {
        if (id === './challenges') return exportsObject;
        if (id === 'expo-secure-store')
          return {
            getItemAsync: async (key) => storage.get(key) ?? null,
            setItemAsync: async (key, value) => {
              storage.set(key, value);
            },
          };
        throw Error(id);
      },
    },
  );
  return result;
}
test('saved output progress survives module reload and stays isolated per account', async () => {
  const storage = new Map();
  const first = progressModule(storage);
  await first.saveOutputResults('account-a', { 'copy-value': 1, 'map-return': 0 });
  const reopened = progressModule(storage);
  const saved = await reopened.loadOutputResults('account-a');
  assert.equal(saved['copy-value'], 1);
  assert.equal(saved['map-return'], 0);
  assert.equal(Object.keys(await reopened.loadOutputResults('account-b')).length, 0);
  assert.deepEqual(
    { ...(await reopened.loadOutputProgress('account-a')) },
    {
      attempted: 2,
      solved: 1,
      total: 9,
    },
  );
  assert.deepEqual(
    { ...(await reopened.loadOutputProgress('account-b')) },
    {
      attempted: 0,
      solved: 0,
      total: 9,
    },
  );
  const ordered = reopened.orderChallenges('Easy', saved);
  assert.equal(ordered.at(-1).id, 'copy-value');
  assert.ok(ordered.findIndex((item) => item.id === 'map-return') < 2);
});
test('stored output results discard unknown challenge IDs and invalid answer indexes', async () => {
  const storage = new Map([
    [
      'output-practice-v1-account-a',
      JSON.stringify({ 'copy-value': -1, 'map-return': 9, 'string-plus': 0, unknown: 1 }),
    ],
  ]);
  const saved = await progressModule(storage).loadOutputResults('account-a');
  assert.deepEqual(Object.keys(saved), ['string-plus']);
  storage.set('output-practice-v1-account-a', '{broken');
  await assert.rejects(progressModule(storage).loadOutputResults('account-a'));
});
