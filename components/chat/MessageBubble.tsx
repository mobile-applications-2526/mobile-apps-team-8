import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { MotiView } from "moti";
import { Colors } from "@/styles/global";

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function MessageBubble({ text, isUser, timestamp }: MessageBubbleProps) {
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];

  const bubbleBg = isUser ? theme.primary : theme.card;
  const textColor = isUser ? "#fff" : theme.cardForeground;
  const timeColor = isUser ? "rgba(255,255,255,0.7)" : theme.border;

  return (
    <View
      style={[
        styles.container,
        { justifyContent: isUser ? "flex-end" : "flex-start" },
      ]}
    >
      <MotiView
        from={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 180 }}
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleBg,
            alignSelf: isUser ? "flex-end" : "flex-start",
            borderBottomRightRadius: isUser ? 4 : 16,
            borderBottomLeftRadius: isUser ? 16 : 4,
          },
        ]}
      >
        <Text style={[styles.messageText, { color: textColor }]}>{text}</Text>
        <Text style={[styles.timestamp, { color: timeColor }]}>
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    maxWidth: "78%",
    flexShrink: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    flexShrink: 1,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 2,
    alignSelf: "flex-end",
  },
});

