import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MotiView } from 'moti';
import { TrendingUp } from 'lucide-react-native';
import { Colors } from '@/styles/global';

export function HomeWeeklyMood({
  moodData,
  global,
}: {
  moodData: { day: string; mood: number; color: string }[];
  global: any;
}) {
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 200 }}
      style={[global.card, styles.card]}
    >
      <View style={styles.cardHeader}>
        <TrendingUp color={theme.primary} size={18} />
        <Text style={[styles.cardTitle, { color: theme.foreground }]}>Your Week</Text>
      </View>

      <View style={styles.moodRow}>
        {moodData.map((item, index) => (
          <MotiView
            key={index}
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 500 + index * 100 }}
            style={[styles.moodDot, { backgroundColor: item.color, borderColor: theme.border }]}
          />
        ))}
      </View>

      <View style={styles.moodLabels}>
        {moodData.map((item, index) => (
          <Text key={index} style={[styles.moodDay, { color: theme.foreground }]}>
            {item.day}
          </Text>
        ))}
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', alignSelf: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { marginLeft: 8, fontSize: 16, fontWeight: '600' },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  moodDot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2 },
  moodLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  moodDay: { fontSize: 12 },
});
