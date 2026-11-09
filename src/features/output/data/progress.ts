import * as SecureStore from 'expo-secure-store';
import { Difficulty } from '../../practice/types/questionTypes';
import { challengesFor, OUTPUT_CHALLENGES } from './challenges';
export type OutputResults = Record<string, number>;
const keyFor = (userId: string) => `output-practice-v1-${userId}`;
export async function loadOutputResults(userId: string): Promise<OutputResults> {
  const raw = await SecureStore.getItemAsync(keyFor(userId));
  const parsed: unknown = raw ? JSON.parse(raw) : {};
  const valid: OutputResults = {};
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    for (const challenge of OUTPUT_CHALLENGES) {
      const value = (parsed as OutputResults)[challenge.id];
      if (Number.isInteger(value) && value >= 0 && value < challenge.options.length)
        valid[challenge.id] = value;
    }
  }
  return valid;
}
export function saveOutputResults(userId: string, results: OutputResults) {
  return SecureStore.setItemAsync(keyFor(userId), JSON.stringify(results));
}
export function orderChallenges(difficulty: Difficulty, results: OutputResults) {
  return challengesFor(difficulty).sort(
    (a, b) => Number(results[a.id] === a.answer) - Number(results[b.id] === b.answer),
  );
}

export async function loadOutputProgress(userId: string) {
  const results = await loadOutputResults(userId);
  const correct = OUTPUT_CHALLENGES.filter(
    (challenge) => results[challenge.id] === challenge.answer,
  );
  return {
    attempted: Object.keys(results).length,
    solved: correct.length,
    total: OUTPUT_CHALLENGES.length,
  };
}
