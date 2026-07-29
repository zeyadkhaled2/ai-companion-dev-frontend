import { apiClient } from './apiClient';
import { Category, Difficulty } from '../types/questionTypes';

export async function generateQuestionRequest(category: Category, difficulty: Difficulty) {
  const response = await apiClient.post('/questions/generate', { category, difficulty });
  return response.data;
}