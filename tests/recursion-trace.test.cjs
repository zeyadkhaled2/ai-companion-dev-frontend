const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = readFileSync(join(__dirname, '../src/features/lab/recursionTrace.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});
const exportsObject = {};
vm.runInNewContext(outputText, { exports: exportsObject });
const {
  factorialCode,
  inputs,
  traceFactorial,
  sumCode,
  traceSum,
  sumNumbers,
  foldersCode,
  traceFolders,
  exampleFolder,
  visitFolders,
} = exportsObject;

test('recursion trace results match the displayed JavaScript for every input', () => {
  for (const input of inputs) {
    const trace = traceFactorial(input);
    const result = vm.runInNewContext(
      `${factorialCode.join('\n')}\nfactorial(${input});`,
      {},
      { timeout: 1000 },
    );
    assert.equal(trace.at(-1).returned.value, result);
    assert.equal(trace.at(-1).stack.length, 0);
    assert.equal(Math.max(...trace.map((step) => step.stack.length)), Math.max(1, input));
  }
});

test('each returned value goes to the caller and earlier frames remain unchanged', () => {
  const trace = traceFactorial(3);
  const deepest = trace.find((step) => step.stack.length === 3);
  const returns = trace.filter((step) => step.returned);
  assert.equal(
    deepest.stack.map((frame) => frame.call).join(','),
    'factorial(3),factorial(2),factorial(1)',
  );
  assert.equal(deepest.stack[1].status, 'Waiting for factorial(1)');
  assert.equal(returns.map((step) => step.returned.value).join(','), '1,2,6');
  assert.match(returns[0].stack.at(-1).status, /Ready to multiply 2/);
  assert.match(returns[1].stack.at(-1).status, /Ready to multiply 3/);
});

test('list and folder examples return the same values as their displayed code', () => {
  for (const [code, expression, trace] of [
    [sumCode, `sum(${JSON.stringify(sumNumbers)})`, traceSum()],
    [foldersCode, `count(${JSON.stringify(exampleFolder)})`, traceFolders()],
  ]) {
    const result = vm.runInNewContext(`${code.join('\n')}\n${expression}`, {}, { timeout: 1000 });
    assert.equal(trace.at(-1).returned.value, result);
    assert.equal(trace.at(-1).stack.length, 0);
  }
  assert.equal(
    traceSum()
      .filter((step) => step.returned)
      .map((step) => step.returned.value)
      .join(','),
    '0,3,7,9',
  );
});

test('the traversal game visits folders in the order that the counting example enters them', () => {
  const pushes = traceFolders()
    .filter((step) => step.line === 1)
    .map((step) => step.stack.at(-1).call);
  const visits = visitFolders(exampleFolder);
  assert.equal(visits.map((folder) => folder.name).join(','), 'Projects,Art,Sketches,Music');
  assert.equal(visits.map((folder) => folder.depth).join(','), '0,1,2,1');
  assert.equal(visits.map((folder) => `count(${folder.name})`).join(','), pushes.join(','));
});
