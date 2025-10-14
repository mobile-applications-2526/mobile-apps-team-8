import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MotiView } from 'moti';
import { Sparkles } from 'lucide-react-native';
import { Colors } from '@/styles/global';

export function HomeAIInsights({
  recentInsights,
  global,
}: {
  recentInsights: string[];
  global: any;
}) {
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 400 }}
      style={[global.card, styles.card]}
    >
      <View style={styles.cardHeader}>
        <Sparkles color={theme.primary} size={18} />
        <Text style={[styles.cardTitle, { color: theme.foreground }]}>
          Insights for You
        </Text>
      </View>

      {recentInsights.map((insight, i) => (
        <MotiView
          key={i}
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 600 + i * 100 }}
          style={[styles.insightRow, { backgroundColor: theme.input }]}
        >
          <View style={[styles.dot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.insightText, { color: theme.cardForeground }]}>
            {insight}
          </Text>
        </MotiView>
      ))}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', alignSelf: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { marginLeft: 8, fontSize: 16, fontWeight: '600' },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 8, marginTop: 5 },
  insightText: { flex: 1, fontSize: 13 },
});
