import type { Difficulty } from '../../practice/types/questionTypes';

export interface OutputChallenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  code: string;
  options: string[];
  answer: number;
  steps: { lines: number[]; explanation: string; output?: string }[];
}
// Curated, deterministic snippets. Never execute challenge code inside the app.
// CI executes these fixtures in an isolated Node VM to verify their answers.
export const OUTPUT_CHALLENGES: OutputChallenge[] = [
  {
    id: 'copy-value',
    title: 'A copy or a connection?',
    difficulty: 'Easy',
    code: 'let count = 2;\nlet copy = count;\ncount += 3;\nconsole.log(copy, count);',
    options: ['5 5', '2 5', '2 2'],
    answer: 1,
    steps: [
      { lines: [1], explanation: 'count starts at 2.' },
      {
        lines: [2],
        explanation:
          'Numbers are primitive values. copy receives the value 2, not a link to count.',
      },
      { lines: [3], explanation: 'Only count changes: 2 + 3 is 5.' },
      { lines: [4], explanation: 'copy is still 2; count is now 5.', output: '2 5' },
    ],
  },
  {
    id: 'map-return',
    title: 'Does map change the original?',
    difficulty: 'Easy',
    code: 'const values = [1, 2, 3];\nconst doubled = values.map(n => n * 2);\nconsole.log(values[1], doubled[1]);',
    options: ['4 4', '1 2', '2 4'],
    answer: 2,
    steps: [
      { lines: [1], explanation: 'values contains 1, 2, and 3.' },
      {
        lines: [2],
        explanation: 'map creates a new array: [2, 4, 6]. This callback does not change values.',
      },
      { lines: [3], explanation: 'Index 1 is the second element in each array.', output: '2 4' },
    ],
  },
  {
    id: 'string-plus',
    title: 'Left to right',
    difficulty: 'Easy',
    code: 'console.log(2 + 3 + "4");\nconsole.log("2" + 3 + 4);',
    options: ['54\n234', '9\n9', '234\n54'],
    answer: 0,
    steps: [
      {
        lines: [1],
        explanation: '2 + 3 is numeric addition: 5. Adding the string "4" then produces "54".',
        output: '54',
      },
      { lines: [2], explanation: '"2" + 3 produces "23", then + 4 produces "234".', output: '234' },
    ],
  },
  {
    id: 'shared-object',
    title: 'Two names, one object',
    difficulty: 'Medium',
    code: 'const original = { score: 1 };\nconst alias = original;\nalias.score = 7;\nconsole.log(original.score);',
    options: ['1', 'undefined', '7'],
    answer: 2,
    steps: [
      { lines: [1, 2], explanation: 'Both variables refer to the same object.' },
      { lines: [3], explanation: 'Changing a property through alias mutates that shared object.' },
      { lines: [4], explanation: 'original sees the changed property.', output: '7' },
    ],
  },
  {
    id: 'closure-counter',
    title: 'A function that remembers',
    difficulty: 'Medium',
    code: 'function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nconsole.log(next(), next());',
    options: ['1 1', '1 2', '0 1'],
    answer: 1,
    steps: [
      {
        lines: [1, 2, 3, 5],
        explanation:
          'makeCounter creates one count variable and returns a function that keeps access to it.',
      },
      {
        lines: [3, 6],
        explanation: 'The first next() increments count before returning, so it returns 1.',
      },
      {
        lines: [3, 6],
        explanation: 'The second call uses the same captured count and returns 2.',
        output: '1 2',
      },
    ],
  },
  {
    id: 'shallow-copy',
    title: 'How deep is a spread?',
    difficulty: 'Medium',
    code: 'const a = { user: { name: "Ada" } };\nconst b = { ...a };\nb.user.name = "Lin";\nconsole.log(a.user.name, a === b);',
    options: ['Ada false', 'Lin true', 'Lin false'],
    answer: 2,
    steps: [
      {
        lines: [1, 2],
        explanation:
          'Spread creates a new outer object, but copies the reference to the nested user object.',
      },
      {
        lines: [3],
        explanation: 'Both outer objects still point to the same user. Its name becomes Lin.',
      },
      {
        lines: [4],
        explanation: 'The nested name changed, but the outer objects have different identities.',
        output: 'Lin false',
      },
    ],
  },
  {
    id: 'promise-order',
    title: 'What runs first?',
    difficulty: 'Hard',
    code: 'console.log("A");\nPromise.resolve().then(() => console.log("B"));\nconsole.log("C");',
    options: ['A\nB\nC', 'B\nA\nC', 'A\nC\nB'],
    answer: 2,
    steps: [
      { lines: [1], explanation: 'The first synchronous statement logs A.', output: 'A' },
      {
        lines: [2],
        explanation: 'The fulfilled promise schedules its then callback as a microtask.',
      },
      { lines: [3], explanation: 'Synchronous execution continues and logs C.', output: 'C' },
      {
        lines: [2],
        explanation: 'After the synchronous code finishes, the microtask logs B.',
        output: 'B',
      },
    ],
  },
  {
    id: 'await-boundary',
    title: 'The await boundary',
    difficulty: 'Hard',
    code: 'async function run() {\n  console.log("start");\n  await Promise.resolve();\n  console.log("end");\n}\nrun();\nconsole.log("outside");',
    options: ['start\noutside\nend', 'outside\nstart\nend', 'start\nend\noutside'],
    answer: 0,
    steps: [
      {
        lines: [6, 2],
        explanation: 'Calling run starts executing immediately and logs start.',
        output: 'start',
      },
      {
        lines: [3],
        explanation: 'await suspends this function, even though the promise is already fulfilled.',
      },
      { lines: [7], explanation: 'The caller continues and logs outside.', output: 'outside' },
      {
        lines: [4],
        explanation: 'The function resumes in a microtask and logs end.',
        output: 'end',
      },
    ],
  },
  {
    id: 'promise-chain',
    title: 'A missing return',
    difficulty: 'Hard',
    code: 'Promise.resolve(2)\n  .then(value => { value * 3; })\n  .then(value => console.log(value));',
    options: ['6', '2', 'undefined'],
    answer: 2,
    steps: [
      { lines: [1], explanation: 'The promise starts fulfilled with the value 2.' },
      {
        lines: [2],
        explanation:
          'The callback calculates 6, but its block has no return statement. It returns undefined.',
      },
      {
        lines: [3],
        explanation: 'The next then receives that returned value, not the unused expression.',
        output: 'undefined',
      },
    ],
  },
];

export function challengesFor(difficulty: Difficulty) {
  return OUTPUT_CHALLENGES.filter((challenge) => challenge.difficulty === difficulty);
}
