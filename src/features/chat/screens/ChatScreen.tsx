import { aiErrorMessage } from '../../../shared/api/apiError';
import AiErrorNotice from '../../../shared/components/AiErrorNotice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../app/navigation/types';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLatestConversationRequest, sendMessageRequest } from '../api/chatApi';
import { ChatMessage } from '../types/chatTypes';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Theme } from '../../../shared/theme/theme';
import TypingIndicator from '../../../shared/components/TypingIndicator';
import LoadError from '../../../shared/components/LoadError';

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [restoreVersion, setRestoreVersion] = useState(0);
  const mounted = useRef(true);
  const sending = useRef(false);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const theme = useTheme();
  const styles = createStyles(theme);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setIsRestoring(true);
    setRestoreError(false);
    getLatestConversationRequest()
      .then(({ conversation }) => {
        if (!active) return;
        setConversationId(conversation?.id ?? null);
        setMessages(conversation ? [...conversation.messages].reverse() : []);
      })
      .catch(() => {
        if (active) setRestoreError(true);
      })
      .finally(() => {
        if (active) setIsRestoring(false);
      });
    return () => {
      active = false;
    };
  }, [restoreVersion]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0 || sending.current || isRestoring || restoreError) return;
    sending.current = true;
    setSendError(null);

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: trimmed };
    setMessages((prev) => [userMessage, ...prev]);
    setInputText('');
    setIsSending(true);

    try {
      const result = await sendMessageRequest({ conversationId, message: trimmed });
      if (!mounted.current) return;
      setConversationId(result.conversationId);
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: result.reply,
      };
      setMessages((prev) => [aiMessage, ...prev]);
    } catch (error) {
      if (!mounted.current) return;
      setMessages((prev) => prev.filter((message) => message.id !== userMessage.id));
      setInputText(trimmed);
      setSendError(
        `${aiErrorMessage(error, 'Could not confirm your message. Try again.')} Your draft is restored.`,
      );
    } finally {
      sending.current = false;
      if (mounted.current) setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>Mentor Chat</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          ListHeaderComponent={isSending ? <TypingIndicator /> : undefined}
          renderItem={({ item }) => (
            <View
              style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}
            >
              <Text style={item.role === 'user' ? styles.userText : styles.aiText}>
                {item.content}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            isRestoring ? (
              <ActivityIndicator color={theme.primary} />
            ) : restoreError ? undefined : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Ask me anything about interview prep, coding concepts, or debugging!
                </Text>
              </View>
            )
          }
        />

        {restoreError && (
          <LoadError
            message="Could not restore your conversation. Retry before sending."
            onRetry={() => setRestoreVersion((value) => value + 1)}
          />
        )}
        {sendError && (
          <AiErrorNotice
            message={sendError}
            onPractice={() => {
              Keyboard.dismiss();
              navigation.navigate('OutputChallenge', { difficulty: 'Easy', returnTo: 'mentor' });
            }}
          />
        )}

        <View style={[styles.inputRow, { paddingBottom: keyboardVisible ? 12 : 110 }]}>
          <TextInput
            style={styles.input}
            placeholder="Ask your mentor..."
            placeholderTextColor={theme.placeholder}
            value={inputText}
            onChangeText={setInputText}
            editable={!isSending && !isRestoring && !restoreError}
            multiline
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={[
              styles.sendButton,
              (isSending || isRestoring || restoreError || !inputText.trim()) && { opacity: 0.5 },
            ]}
            onPress={handleSend}
            disabled={isSending || isRestoring || restoreError || !inputText.trim()}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    flex: { flex: 1 },
    headerBar: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
    title: { fontSize: 22, fontWeight: '700', color: theme.text },
    messageList: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
    bubble: {
      maxWidth: '80%',
      borderRadius: 16,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginBottom: 10,
    },
    userBubble: {
      backgroundColor: theme.primary,
      alignSelf: 'flex-end',
      borderBottomRightRadius: 4,
    },
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
