import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ArrowLeft, Search, BookOpen, Calendar, Heart } from 'lucide-react-native';
import { GlobalStyles, Colors } from '@/styles/global';
import { useRouter } from 'expo-router';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  moodColor: string;
  moodIcon: string;
  date: Date;
  tags: string[];
}

const journalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Morning reflections',
    content:
      'Today I felt more centered after my morning walk. The quiet moments in nature really help me process my thoughts and set intentions for the day ahead...',
    mood: 'calm',
    moodColor: '#A8E6CF',
    moodIcon: '😌',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ['morning', 'nature', 'mindfulness'],
  },
  {
    id: '2',
    title: 'Grateful moments',
    content:
      'Reflecting on the small joys today - a good conversation with a friend, the warmth of my coffee, and the way sunlight streamed through my window...',
    mood: 'grateful',
    moodColor: '#FFE66D',
    moodIcon: '🙏',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tags: ['gratitude', 'friendship', 'joy'],
  },
  {
    id: '3',
    title: 'Working through anxiety',
    content:
      'Had some challenging moments today with work stress. Used breathing exercises and tried to practice self-compassion. Progress, not perfection...',
    mood: 'anxious',
    moodColor: '#FFB3BA',
    moodIcon: '😰',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ['anxiety', 'work', 'coping', 'self-care'],
  },
  {
    id: '4',
    title: 'Evening peace',
    content:
      'Tonight I feel at peace. Spent time reading and listening to soft music. These quiet evening rituals are becoming precious to me...',
    mood: 'peaceful',
    moodColor: '#B3D9FF',
    moodIcon: '☮️',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: ['evening', 'peace', 'rituals', 'music'],
  },
];

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];
  const global = GlobalStyles(mode);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodIcons: { [key: string]: string } = {
    happy: '😊',
    calm: '😌',
    anxious: '😰',
    sad: '😢',
    excited: '🤗',
    stressed: '😫',
    peaceful: '☮️',
    grateful: '🙏',
  };

  const uniqueMoods = Array.from(new Set(journalEntries.map((entry) => entry.mood)));

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
  };

  const renderEntry = ({ item, index }: { item: JournalEntry; index: number }) => (
    <MotiView
      key={item.id}
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 100 }}
      style={{ marginBottom: 16 }}
    >
      {/* Timeline marker */}
      <View style={[styles.timelineMarker, { backgroundColor: item.moodColor }]} />

      {/* Date */}
      <View style={styles.dateContainer}>
        <Calendar size={14} color={theme.accent} />
        <Text style={[styles.dateText, { color: theme.accent }]}>{formatDate(item.date)}</Text>
      </View>

      {/* Card */}
      <TouchableOpacity
        style={[global.card, styles.card]}
        onPress={() => router.push('/')}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.moodIconContainer, { backgroundColor: `${item.moodColor}40` }]}>
            <Text>{item.moodIcon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: theme.foreground }]}>{item.title}</Text>
            <View style={styles.moodRow}>
              <Heart size={14} color={theme.primary} />
              <Text style={[styles.moodText, { color: theme.foreground }]}>{item.mood}</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.cardContent, { color: theme.cardForeground }]} numberOfLines={3}>
          {item.content}
        </Text>
        <View style={styles.tagsRow}>
          {item.tags.map((tag, i) => (
            <View key={i} style={[styles.tag, { backgroundColor: `${theme.primary}10` }]}>
              <Text style={{ fontSize: 10, color: theme.primary }}>#{tag}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={[global.card, styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: theme.foreground }]}>Journal</Text>
          <Text style={{ color: theme.accent, fontSize: 12 }}>Your thoughts and reflections</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/')}
          style={styles.newEntryButton}
        >
          <BookOpen size={24} color={theme.primaryForeground} />
        </TouchableOpacity>
      </View>

      {/* Search & Mood Filter */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Search size={16} color={theme.border} style={{ position: 'absolute', left: 12, top: 12 }} />
        <TextInput
          placeholder="Search entries, tags, or feelings..."
          placeholderTextColor={theme.border}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: theme.foreground, borderColor: theme.border }]}
        />
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[styles.moodButton, { backgroundColor: !selectedMood ? theme.primary : theme.card }]}
          onPress={() => setSelectedMood(null)}
        >
          <Text style={{ color: !selectedMood ? theme.primaryForeground : theme.foreground }}>All</Text>
        </TouchableOpacity>
        {uniqueMoods.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodButton,
              { backgroundColor: selectedMood === mood ? theme.primary : theme.card },
            ]}
            onPress={() => setSelectedMood(selectedMood === mood ? null : mood)}
          >
            <Text>{moodIcons[mood]}</Text>
            <Text style={{ marginLeft: 4, color: theme.foreground }}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Journal Entries */}
      {filteredEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ color: theme.foreground, fontSize: 16 }}>No entries found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1 },
  backButton: { marginRight: 12 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  newEntryButton: { padding: 8 },
  searchContainer: { margin: 16, borderRadius: 24, borderWidth: 1, paddingHorizontal: 40, paddingVertical: 8 },
  searchInput: { height: 36, borderRadius: 24, paddingLeft: 28 },
  moodButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, flexDirection: 'row', alignItems: 'center' },
  timelineMarker: { width: 12, height: 12, borderRadius: 6, position: 'absolute', left: 16, top: 16 },
  dateContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 40, marginBottom: 8 },
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
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
});
