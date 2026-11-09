export const inputs = [0, 1, 2, 3, 4] as const;
export type FactorialInput = (typeof inputs)[number];

export const factorialCode = [
  'function factorial(n) {',
  '  if (n <= 1) return 1;',
  '  return n * factorial(n - 1);',
  '}',
];
export const sumCode = [
  'function sum(numbers) {',
  '  if (!numbers.length) return 0;',
  '  const [first, ...rest] = numbers;',
  '  return first + sum(rest);',
  '}',
];
export const foldersCode = [
  'function count(folder) {',
  '  let total = folder.files;',
  '  for (const child of folder.children) {',
  '    total += count(child);',
  '  }',
  '  return total;',
  '}',
];

export interface Folder {
  name: string;
  files: number;
  children: Folder[];
}
export const exampleFolder: Folder = {
  name: 'Projects',
  files: 1,
  children: [
    { name: 'Art', files: 2, children: [{ name: 'Sketches', files: 1, children: [] }] },
    { name: 'Music', files: 2, children: [] },
  ],
};
export const sumNumbers = [2, 4, 3];

type Frame = { call: string; status: string };
export type RecursionStep = {
  line: number;
  title: string;
  detail: string;
  stack: Frame[];
  returned?: { call: string; value: number };
};

function createTrace(call: string) {
  const stack: Frame[] = [];
  const steps: RecursionStep[] = [
    {
      line: 0,
      title: 'Ready to start',
      detail: `Step into ${call} to add its first frame.`,
      stack: [],
    },
  ];
  function record(
    line: number,
    title: string,
    detail: string,
    returned?: RecursionStep['returned'],
  ) {
    steps.push({ line, title, detail, stack: stack.map((frame) => ({ ...frame })), returned });
  }
  function enter(call: string, status: string) {
    const frame = { call, status };
    stack.push(frame);
    record(1, `Push ${call}`, 'A new call frame goes on top.');
    return frame;
  }
  function leave(line: number, value: number, callerStatus: (value: number) => string) {
    const frame = stack.pop()!;
    const caller = stack.at(-1);
    if (caller) caller.status = callerStatus(value);
    record(
      line,
      `Return ${value}`,
      caller
        ? `${frame.call} leaves the stack. ${caller.call} receives ${value}.`
        : `${frame.call} returns ${value}. The stack is now empty.`,
      { call: frame.call, value },
    );
    return value;
  }
  return { steps, record, enter, leave };
}

export function traceFactorial(input: FactorialInput) {
  const trace = createTrace(`factorial(${input})`);
  function factorial(n: number, caller?: number): number {
    const frame = trace.enter(`factorial(${n})`, `n = ${n}`);
    let value = 1;
    if (n <= 1) trace.record(2, 'Base case', `n is ${n}, so this call returns 1.`);
    else {
      frame.status = `Waiting for factorial(${n - 1})`;
      trace.record(
        3,
        `Call factorial(${n - 1})`,
        `Save ${n} for later. Find the smaller factorial first.`,
      );
      value = n * factorial(n - 1, n);
    }
    return trace.leave(
      n <= 1 ? 2 : 3,
      value,
      (result) => `Ready to multiply ${caller} × ${result}`,
    );
  }
  factorial(input);
  return trace.steps;
}

export function traceSum(numbers = sumNumbers) {
  const call = (values: number[]) => `sum([${values.join(', ')}])`;
  const trace = createTrace(call(numbers));
  function sum(values: number[], callerFirst?: number): number {
    const frame = trace.enter(call(values), 'Add the numbers in this list.');
    if (!values.length) {
      trace.record(2, 'Base case', 'An empty list has a sum of 0.');
      return trace.leave(2, 0, (result) => `Ready to add ${callerFirst} + ${result}`);
    }
    const [first, ...rest] = values;
    trace.record(3, 'Split the list', `Keep ${first}. The remaining list is [${rest.join(', ')}].`);
    frame.status = `Keep ${first} while waiting for ${call(rest)}`;
    trace.record(4, `Call ${call(rest)}`, 'The next call handles the shorter list.');
    const value = first + sum(rest, first);
    return trace.leave(4, value, (result) => `Ready to add ${callerFirst} + ${result}`);
  }
  sum(numbers);
  return trace.steps;
}

export function traceFolders(root = exampleFolder) {
  const call = (folder: Folder) => `count(${folder.name})`;
  const trace = createTrace(call(root));
  function count(folder: Folder, callerTotal?: number): number {
    const frame = trace.enter(call(folder), 'Start with the files directly inside this folder.');
    let total = folder.files;
    frame.status = `Total so far: ${total}`;
    trace.record(
      2,
      `Count files in ${folder.name}`,
      `There are ${total} files directly inside this folder.`,
    );
    for (const child of folder.children) {
      frame.status = `Total: ${total}. Waiting for ${child.name}.`;
      trace.record(
        4,
        `Open ${child.name}`,
        `Pause ${folder.name} while you count the files in ${child.name}.`,
      );
      total += count(child, total);
      frame.status = `Total so far: ${total}`;
    }
    if (!folder.children.length)
      trace.record(6, 'No subfolders', 'This folder is a leaf. Return its file count.');
    return trace.leave(
      6,
      total,
      (result) => `Add ${result} to the running total of ${callerTotal}`,
    );
  }
  count(root);
  return trace.steps;
}

export function visitFolders(root: Folder): { name: string; depth: number; path: string }[] {
  const visits: { name: string; depth: number; path: string }[] = [];
  function visit(folder: Folder, parents: string[]) {
    const path = [...parents, folder.name];
    visits.push({ name: folder.name, depth: parents.length, path: path.join(' / ') });
    for (const child of folder.children) visit(child, path);
  }
  visit(root, []);
  return visits;
}
