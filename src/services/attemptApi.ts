import { SubmitAnswerInput, Attempt } from "../types/attemptTypes";
import { apiClient } from "./apiClient";
export async function submitAnswerRequest (data: SubmitAnswerInput) : Promise<Attempt>{
  const response = await apiClient.post('/attempts', data);
  return response.data;
}
export async function getAttemptsRequest() {
  const response = await apiClient.get('/attempts');
  return response.data;
}