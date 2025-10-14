import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MotiView } from 'moti';
import { BookOpen } from 'lucide-react-native';
import { Colors } from '@/styles/global';
import { useRouter } from 'expo-router';


export function HomeRecentReflection({ global, router }: { global: any, router: ReturnType<typeof useRouter> }) {
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 300 }}
      style={[global.card, styles.card]}
    >
      <View style={styles.cardHeader}>
        <BookOpen color={theme.accent} size={18} />
        <Text style={[styles.cardTitle, { color: theme.foreground }]}>Recent Reflection</Text>
        <Text style={[styles.timeLabel, { color: theme.border }]}>2h ago</Text>
      </View>

      <Text style={[styles.cardText, { color: theme.cardForeground }]}>
        "Today I felt more centered after my morning walk. The quiet moments in nature really help
        me process my thoughts..."
      </Text>

      <TouchableOpacity
        style={[styles.ghostButton, { backgroundColor: theme.secondary }]}
        onPress={() => router.push('/(tabs)/journal')}
      >
        <Text style={[styles.ghostText, { color: theme.secondaryForeground }]}>
          Read full entry
        </Text>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', alignSelf: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { marginLeft: 8, fontSize: 16, fontWeight: '600' },
  timeLabel: { marginLeft: 'auto', fontSize: 12 },
  cardText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  ghostButton: { paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  ghostText: { fontWeight: '500' },
});
