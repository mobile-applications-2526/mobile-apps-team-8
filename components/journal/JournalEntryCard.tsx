import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Calendar, Heart } from 'lucide-react-native';
import { GlobalStyles, Colors } from '@/styles/global';
import { Router } from 'expo-router';
import { JournalEntry } from '@/app/(tabs)/journal/index'; 

interface JournalEntryCardProps {
  entry: JournalEntry;
  index: number;
  global: any;
  theme: Record<string, string>;
  router: Router;
}

export function JournalEntryCard({ entry, index, global, theme, router }: JournalEntryCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  };

  return (
    <MotiView
      key={entry.id}
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 100 }}
      style={{ marginBottom: 16 }}
    >
      <View style={[styles.timelineMarker, { backgroundColor: entry.moodColor }]} />

      <View style={styles.dateContainer}>
        <Calendar size={14} color={theme.accent} />
        <Text style={[styles.dateText, { color: theme.accent }]}>{formatDate(entry.date)}</Text>
      </View>

      <TouchableOpacity
        style={[global.card, styles.card]}
        
      >
        <View style={styles.cardHeader}>
          <View style={[styles.moodIconContainer, { backgroundColor: `${entry.moodColor}40` }]}>
            <Text>{entry.moodIcon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: theme.foreground }]}>{entry.title}</Text>
            <View style={styles.moodRow}>
              <Heart size={14} color={theme.primary} />
              <Text style={[styles.moodText, { color: theme.foreground }]}>{entry.mood}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.cardContent, { color: theme.cardForeground }]} numberOfLines={3}>
          {entry.content}
        </Text>

        <View style={styles.tagsRow}>
          {entry.tags.map((tag, i) => (
            <View key={i} style={[styles.tag, { backgroundColor: `${theme.primary}10` }]}>
              <Text style={{ fontSize: 10, color: theme.primary }}>#{tag}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  timelineMarker: { width: 12, height: 12, borderRadius: 6, position: 'absolute', left: 16, top: 2 },
  dateContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 36, marginBottom: 8 },
  dateText: { fontSize: 12, marginLeft: 4 },
  card: { padding: 16, borderRadius: 24, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  moodIconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  moodRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  moodText: { fontSize: 12, marginLeft: 4, textTransform: 'capitalize' },
  cardContent: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 4, marginBottom: 4 },
});
