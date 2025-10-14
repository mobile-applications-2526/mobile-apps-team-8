import React, { useState } from 'react';
import { SafeAreaView, Text, ScrollView, FlatList, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GlobalStyles, Colors } from '@/styles/global';

import { JournalHeader } from '@/components/journal/JournalHeader';
import { JournalSearch } from '@/components/journal/JournalSearch';
import { MoodFilter } from '@/components/journal/MoodFilter';
import { JournalEntryCard } from '@/components/journal/JournalEntryCard';

export interface JournalEntry {
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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];
  const global = GlobalStyles(mode);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <JournalHeader router={router} global={global} insets={insets} />

      <JournalSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
      />

      <MoodFilter
        uniqueMoods={uniqueMoods}
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
        moodIcons={moodIcons}
        theme={theme}
      />

      {filteredEntries.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <Text style={{ color: theme.foreground, fontSize: 16 }}>No entries found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <JournalEntryCard
              entry={item}
              index={index}
              theme={theme}
              global={global}
              router={router}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
}
