import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Send, Mic, MicOff, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { GlobalStyles, Colors } from '@/styles/global';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const router = useRouter();
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];
  const global = GlobalStyles(mode);
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to listen and support you. How are you feeling today?",
      isUser: false,
      timestamp: new Date(Date.now() - 5000),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "I understand how you're feeling.",
        "Thank you for sharing that with me.",
        "That sounds challenging.",
      ];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  const toggleRecording = () => setIsRecording((prev) => !prev);

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, { justifyContent: item.isUser ? 'flex-end' : 'flex-start' }]}>
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={[
          styles.messageBubble,
          { backgroundColor: item.isUser ? theme.primary : theme.card, alignSelf: item.isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        <Text style={{ color: item.isUser ? theme.primaryForeground : theme.cardForeground }}>{item.text}</Text>
        <Text style={[styles.timestamp, { color: theme.border }]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </MotiView>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={[global.card, styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: theme.foreground }]}>AI Companion</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={{ color: theme.accent, fontSize: 12 }}>Always here for you</Text>
          </View>
        </View>
      </View>

      {/* Messages + Input */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80} // adjust if needed
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
        />

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
          <TextInput
            style={[styles.textInput, { color: theme.foreground, borderColor: theme.border }]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Share your thoughts..."
            placeholderTextColor={theme.border}
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity onPress={toggleRecording} style={styles.iconButton}>
            {isRecording ? <MicOff size={24} color="red" /> : <Mic size={24} color={theme.primary} />}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSend} style={styles.iconButton}>
            <Send size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1 },
  backButton: { marginRight: 12 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'green', marginRight: 4 },
  messageContainer: { marginBottom: 12, flexDirection: 'row' },
  messageBubble: { padding: 12, borderRadius: 16, maxWidth: '80%' },
  timestamp: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  textInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 24, marginRight: 8 },
  iconButton: { padding: 8 },
});
