import { Colors } from "@/styles/global";
import { Mic, MicOff, Send } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (text: string) => void;
  handleSend: () => void;
  isRecording: boolean;
  toggleRecording: () => void;
  isOnline?: boolean;
}

export function ChatInput({
  newMessage,
  setNewMessage,
  handleSend,
  isRecording,
  toggleRecording,
  isOnline = true,
}: ChatInputProps) {
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];

  return (
    <View
      testID="chat-input-container"
      style={[styles.container, { backgroundColor: theme.card }]}
    >
      <TextInput
        testID="chat-input"
        style={[
          styles.input,
          {
            color: theme.foreground,
            borderColor: theme.border,
            opacity: isOnline ? 1 : 0.5,
          },
        ]}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder={isOnline ? "Share your thoughts..." : "You are offline"}
        placeholderTextColor={theme.border}
        onSubmitEditing={handleSend}
        editable={isOnline}
      />

      <TouchableOpacity
        testID="chat-mic-button"
        onPress={toggleRecording}
        style={styles.iconButton}
        disabled={!isOnline}
      >
        {isRecording ? (
          <MicOff size={24} color="red" />
        ) : (
          <Mic size={24} color={isOnline ? theme.primary : theme.border} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        testID="chat-send-button"
        onPress={handleSend}
        style={styles.iconButton}
        disabled={!isOnline}
      >
        <Send size={24} color={isOnline ? theme.primary : theme.border} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5ff",
    backgroundColor: "white",
    paddingBottom: 8,
    width: "100%",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 24,
    marginRight: 8,
    minHeight: 40,
  },
  iconButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
