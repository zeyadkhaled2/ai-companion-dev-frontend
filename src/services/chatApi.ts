import { apiClient } from './apiClient';
import { SendMessageInput, SendMessageResponse } from '../types/chatTypes';

export async function sendMessageRequest(data: SendMessageInput): Promise<SendMessageResponse> {
  const response = await apiClient.post('/chat/message', data);
  return response.data;
}