const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
const source = fs.readFileSync(path.join(__dirname, '../src/features/lab/printQueue.ts'), 'utf8');
vm.runInNewContext(
  ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
  { exports: exportsObject },
);
const { initialQueue, playQueue, queueTrace } = exportsObject;

test('print desk rejects skipping the front and prints queued jobs in arrival order', () => {
  let state = playQueue(initialQueue, { type: 'print', job: 'Slides' });
  assert.equal(state.waiting, initialQueue.waiting);
  assert.equal(state.printed.length, 0);
  assert.match(state.message, /Block 1 is first in line/);
  state = playQueue(state, { type: 'add' });
  assert.equal(state.waiting.join(','), 'Report,Slides,Invoice');
  for (const job of ['Report', 'Slides', 'Invoice'])
    state = playQueue(state, { type: 'print', job });
  assert.equal(state.waiting.length, 0);
  assert.equal(state.printed.join(','), 'Report,Slides,Invoice');
  assert.equal(playQueue(state, { type: 'reset' }), initialQueue);
});

test('the lesson trace matches the queue state after running each JavaScript statement', () => {
  const context = vm.createContext({});
  for (const step of queueTrace) {
    vm.runInContext(step.code, context, { timeout: 1000 });
    assert.equal(vm.runInContext('jobs.join(",")', context), step.waiting.join(','));
  }
});
