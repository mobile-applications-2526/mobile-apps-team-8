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
}

export function ChatInput({
  newMessage,
  setNewMessage,
  handleSend,
  isRecording,
  toggleRecording,
}: ChatInputProps) {
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <TextInput
        style={[
          styles.input,
          { color: theme.foreground, borderColor: theme.border },
        ]}
        testID="chat-input"
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Share your thoughts..."
        placeholderTextColor={theme.border}
        onSubmitEditing={handleSend}
      />
      <TouchableOpacity onPress={toggleRecording} style={styles.iconButton}>
        {isRecording ? (
          <MicOff size={24} color="red" />
        ) : (
          <Mic size={24} color={theme.primary} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        testID="chat-send-button"
        onPress={handleSend}
        style={styles.iconButton}
      >
        <Send size={24} color={theme.primary} />
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
    paddingBottom: 8, // Add consistent padding
    width: "100%", // Ensure full width
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
