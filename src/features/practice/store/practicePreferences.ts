import { create } from 'zustand';
import { Category, Difficulty } from '../types/questionTypes';

export type PracticeTopic = Category | 'Predict output';

// Keep choices when the setup screen is recreated after returning Home.
interface PracticePreferences {
  category: PracticeTopic | null;
  difficulty: Difficulty | null;
  setCategory: (category: PracticeTopic) => void;
  setDifficulty: (difficulty: Difficulty) => void;
}
export const usePracticePreferences = create<PracticePreferences>((set) => ({
  category: null,
  difficulty: null,
  setCategory: (category) => set({ category }),
  setDifficulty: (difficulty) => set({ difficulty }),
}));
