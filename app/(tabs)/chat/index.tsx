import React, { useState } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles, Colors } from '@/styles/global';

import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';

export interface Message {
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

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
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
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const toggleRecording = () => setIsRecording(prev => !prev);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ChatHeader router={router} global={global} insets={insets} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <MessageList messages={messages} />

        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSend={handleSend}
          isRecording={isRecording}
          toggleRecording={toggleRecording}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
