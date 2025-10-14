import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '@/styles/global';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function MessageBubble({ text, isUser, timestamp }: MessageBubbleProps) {
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  return (
    <View style={[styles.container, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        style={[
          styles.bubble,
          { backgroundColor: isUser ? theme.primary : theme.card, alignSelf: isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        <Text style={{ color: isUser ? theme.primaryForeground : theme.cardForeground }}>{text}</Text>
        <Text style={[styles.timestamp, { color: theme.border }]}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12, flexDirection: 'row' },
  bubble: { padding: 12, borderRadius: 16, maxWidth: '80%' },
  timestamp: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
});
