import { Colors, GlobalStyles } from "@/styles/global";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  View,
  Text,
  StyleSheet,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Bot, WifiOff } from "lucide-react-native";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/header/Header";
import { ChatService } from "@/services/ChatService";
import { SyncService } from "@/services/SyncService";
import { MotiView } from "moti";

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

  const [isOnline, setIsOnline] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const rawMessages = await ChatService.getMessages();

        const messages = rawMessages.messages.map((m: any) => ({
          id: m.id,
          text: m.message.replace(/^"|"$/g, ""),
          isUser: !m.ai,
          timestamp: new Date(m.timestamp),
        }));

        if (messages.length === 0) {
          const welcomeMessage: Message = {
            id: "welcome",
            text: "Hi there! I'm here to listen and support you. How are you feeling today? Feel free to share anything that's on your mind.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        const welcomeMessage: Message = {
          id: "welcome",
          text: "Hi there! I'm here to listen and support you. How are you feeling today? Feel free to share anything that's on your mind.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      const online = await SyncService.isOnline();
      setIsOnline(online);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim() || !isOnline) return;
    setLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      const response = await ChatService.sendMessage(newMessage);
      const aiMessage: Message = {
        id: response.id,
        text: response.message,
        isUser: !response.ai,
        timestamp: new Date(response.timestamp),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => setIsRecording((prev) => !prev);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
        borderWidth: 0,
      }}
      edges={["right", "left"]}
    >
      <Header
        title="AI Companion"
        subtitle="Always here for you"
        icon={Bot}
        showBackButton={true}
        global={global}
        insets={insets}
      />
      <StatusBar
        style={mode === "dark" ? "light" : "dark"}
        backgroundColor="transparent"
        translucent={true}
      />

      {!isOnline && (
        <View style={[styles.offlineBanner, { backgroundColor: theme.accent }]}>
          <WifiOff size={16} color="#fff" />
          <Text style={styles.offlineText}>
            You are offline. Chat is unavailable.
          </Text>
        </View>
      )}

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
          isOnline={isOnline}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  offlineText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
    flexShrink: 1,
  },
});
