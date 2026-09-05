export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type SendMessageInput = {
  conversationId: string | null;
  message: string;
};

export type SendMessageResponse = {
  conversationId: string;
  reply: string;
};