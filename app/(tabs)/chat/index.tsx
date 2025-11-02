import { Colors, GlobalStyles } from "@/styles/global";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Bot } from "lucide-react-native";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/header/Header";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];
  const global = GlobalStyles(mode);
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to listen and support you. How are you feeling today?",
      isUser: false,
      timestamp: new Date(Date.now() - 5000),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
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

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
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

  return (
    <SafeAreaView
      style={{
        flex: 1, // Changed from flex: 10
        backgroundColor: theme.background,
        borderWidth: 0,
      }}
      edges={["right", "left"]} // Only apply safe area to top edge
    >
      <Header
        title="AI Companion"
        subtitle="Always here for you"
        icon={Bot}
        showBackButton={false}
        global={global}
        insets={insets}
      />
      <StatusBar
        style={mode === "dark" ? "light" : "dark"}
        backgroundColor="transparent"
        translucent={true}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <MessageList messages={messages} />
        </View>

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
