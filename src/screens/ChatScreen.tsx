import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendMessageRequest } from '../services/chatApi';
import { ChatMessage } from '../types/chatTypes';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../constants/theme';
import AppHeader from '../components/AppHeader';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0 || isSending) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: trimmed };
    setMessages((prev) => [userMessage, ...prev]);
    setInputText('');
    setIsSending(true);

    try {
      const result = await sendMessageRequest({ conversationId, message: trimmed });
      setConversationId(result.conversationId);
      const aiMessage: ChatMessage = { id: Date.now().toString() + '-ai', role: 'assistant', content: result.reply };
      setMessages((prev) => [aiMessage, ...prev]);
    } catch (err: any) {
      console.log('Chat error message:', err.message);
      console.log('Chat error response status:', err.response?.status);
      console.log('Chat error response data:', err.response?.data);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: 'Sorry, I had trouble responding. Please try again.',
      };
      setMessages((prev) => [errorMessage, ...prev]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <AppHeader />
        <Text style={styles.title}>Mentor Chat</Text>
      </View>

      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={item.role === 'user' ? styles.userText : styles.aiText}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Ask me anything about interview prep, coding concepts, or debugging!</Text>
          </View>
        }
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask your mentor..."
            placeholderTextColor={theme.placeholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isSending}>
            {isSending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.sendText}>Send</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    headerBar: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
    title: { fontSize: 22, fontWeight: '700', color: theme.text },
    messageList: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
    bubble: { maxWidth: '80%', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 10 },
    userBubble: { backgroundColor: theme.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    aiBubble: { backgroundColor: theme.card, alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    userText: { color: '#fff', fontSize: 15 },
    aiText: { color: theme.text, fontSize: 15 },
    emptyState: { padding: 24, alignItems: 'center' },
    emptyText: { color: theme.textSecondary, textAlign: 'center', fontSize: 14 },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: 90,
      gap: 8,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
    },
    input: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: theme.text,
      maxHeight: 100,
    },
    sendButton: {
      backgroundColor: theme.primary,
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 10,
      justifyContent: 'center',
    },
    sendText: { color: '#fff', fontWeight: '600' },
  });
}