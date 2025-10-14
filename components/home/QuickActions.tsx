import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { MessageCircle, Plus } from 'lucide-react-native';
import { Colors } from '@/styles/global';

export function HomeQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 100 }}
      style={styles.quickActions}
    >
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/(tabs)/chat')}
      >
        <MessageCircle color={theme.primaryForeground} size={24} />
        <Text style={[styles.actionText, { color: theme.primaryForeground }]}>
          Chat with AI
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: theme.accent }]}
        onPress={() => router.push('/(tabs)/journal')}
      >
        <Plus color={theme.primaryForeground} size={24} />
        <Text style={[styles.actionText, { color: theme.primaryForeground }]}>
          New Entry
        </Text>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    marginTop: 6,
  },
});
