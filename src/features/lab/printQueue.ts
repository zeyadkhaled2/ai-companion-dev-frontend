export const jobs = ['Report', 'Slides', 'Invoice'] as const;
type Job = (typeof jobs)[number];

export const initialQueue = {
  waiting: ['Report', 'Slides'] as Job[],
  printed: [] as Job[],
  next: 2,
  message: 'Block 1 is first in line. Tap it to print.',
};

export const jobCount = jobs.length;
export const nextJob = (state: typeof initialQueue) => jobs[state.next];

type Action = { type: 'add' } | { type: 'print'; job: Job } | { type: 'reset' };

export function playQueue(state: typeof initialQueue, action: Action): typeof initialQueue {
  if (action.type === 'reset') return initialQueue;
  if (action.type === 'add') {
    const job = nextJob(state);
    if (!job) return state;
    return {
      ...state,
      waiting: [...state.waiting, job],
      next: state.next + 1,
      message: `Block ${jobs.indexOf(job) + 1} joined the back of the line.`,
    };
  }
  const [front, ...remaining] = state.waiting;
  if (front !== action.job) {
    return {
      ...state,
      message: front
        ? `Block ${jobs.indexOf(front) + 1} is first in line. Tap it next.`
        : 'The queue is empty.',
    };
  }
  return {
    ...state,
    waiting: remaining,
    printed: [...state.printed, front],
    message: `Block ${jobs.indexOf(front) + 1} moved to the printed tray.`,
  };
}

export const queueTrace = [
  {
    code: "const jobs = ['Report', 'Slides'];",
    waiting: ['Report', 'Slides'],
    explanation: 'The report arrived first, so it is at the front.',
  },
  {
    code: "jobs.push('Invoice');",
    waiting: ['Report', 'Slides', 'Invoice'],
    explanation: 'Enqueue adds the invoice at the back. The report is still next.',
  },
  {
    code: 'const printed = jobs.shift();',
    waiting: ['Slides', 'Invoice'],
    explanation: 'Dequeue removes the report from the front. The slides are now next.',
  },
] as const;
