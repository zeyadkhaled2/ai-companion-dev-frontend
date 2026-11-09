import { SubmitAnswerInput, Attempt, AttemptWithQuestion } from '../types/attemptTypes';
import { apiClient } from '../../../shared/api/apiClient';
import { Stats } from '../../progress/types/statsTypes';

export async function submitAnswerRequest(data: SubmitAnswerInput): Promise<Attempt> {
  const response = await apiClient.post('/attempts', data);
  return response.data.attempt;
}
export async function getAttemptsRequest(): Promise<{ attempts: AttemptWithQuestion[] }> {
  const response = await apiClient.get('/attempts');
  return response.data;
}
export async function getStatsRequest(): Promise<Stats> {
  const response = await apiClient.get('/attempts/stats');
  return response.data.stats;
}
