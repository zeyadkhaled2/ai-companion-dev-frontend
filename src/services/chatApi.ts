import { apiClient } from './apiClient';
import { SendMessageInput, SendMessageResponse, ConversationResponse } from '../types/chatTypes';

export async function getLatestConversationRequest(): Promise<ConversationResponse> {
  const response = await apiClient.get('/chat/conversation');
  return response.data;
}

export async function sendMessageRequest(data: SendMessageInput): Promise<SendMessageResponse> {
  const response = await apiClient.post('/chat/message', data);
  return response.data;
}
