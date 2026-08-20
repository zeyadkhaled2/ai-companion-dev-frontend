import { SubmitAnswerInput, Attempt } from "../types/attemptType";
import { apiClient } from "./apiClient";
export async function submitAnswerRequest (data: SubmitAnswerInput) : Promise<Attempt>{
  const response = await apiClient.post('/attempts', data);
  return response.data;
}