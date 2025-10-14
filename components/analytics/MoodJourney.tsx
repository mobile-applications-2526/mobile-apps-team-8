import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { MotiView } from 'moti';
import { Calendar } from 'lucide-react-native';
import { Colors } from '@/styles/global';

export function MoodJourney({ global }: { global: any }) {
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.6 }}
    >
      <View style={[global.card, styles.card]}>
        <View style={styles.headerRow}>
          <Calendar size={18} color={theme.primary} />
          <Text style={[styles.cardTitle, { color: theme.foreground }]}>
            Emotional Landscape
          </Text>
        </View>
        <View style={styles.placeholder}>
          <Text style={{ color: theme.foreground, fontSize: 12 }}>
            Mood graph placeholder
          </Text>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 20, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { marginLeft: 8, fontSize: 16, fontWeight: '600' },
  placeholder: {
    height: 150,
    borderRadius: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
