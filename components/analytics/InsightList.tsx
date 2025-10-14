import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MotiView } from 'moti';
import { Colors } from '@/styles/global';

export function InsightList({
  insights,
  global,
}: {
  insights: { title: string; description: string; icon: string; strength: 'high' | 'medium' }[];
  global: any;
}) {
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  return (
    <View style={{ marginTop: 24 }}>
      {insights.map((insight, i) => (
        <MotiView
          key={i}
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: i * 0.2 }}
        >
          <View style={[global.card, styles.card]}>
            <Text style={styles.title}>
              {insight.icon} {insight.title}
            </Text>
            <Text style={[styles.description, { color: theme.accent }]}>
              {insight.description}
            </Text>
            <View
              style={[
                styles.strengthBadge,
                {
                  backgroundColor:
                    insight.strength === 'high'
                      ? theme.primary
                      : theme.secondary,
                },
              ]}
            >
              <Text style={[styles.strengthText, { color: theme.foreground }]}>
                {insight.strength} confidence
              </Text>
            </View>
          </View>
        </MotiView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  title: { fontSize: 16, marginBottom: 4 },
  description: { fontSize: 12 },
  strengthBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  strengthText: { fontSize: 10 },
});
