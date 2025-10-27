import { Colors, GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


import { JournalEntryCard } from '@/components/journal/JournalEntryCard';
import { JournalHeader } from '@/components/journal/JournalHeader';
import { JournalSearch } from '@/components/journal/JournalSearch';
import { MoodFilter } from '@/components/journal/MoodFilter';
import { NewEntryForm } from '@/components/journal/NewEntryForm';
import { getAllJournalEntries, initDB } from '@/database';

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



export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);


  useEffect(() => {
    initDB();
    const loadEntries = () => {
      const data = getAllJournalEntries();
      setEntries(data);
    };
    loadEntries();
  }, []);

  const refreshEntries = () => {
    const data = getAllJournalEntries();
    setEntries(data);
  };

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];
  const global = GlobalStyles(mode);


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

  const uniqueMoods = Array.from(new Set(entries.map((entry) => entry.mood)));

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <JournalHeader router={router} global={global} insets={insets} />

      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <Button
          title={showForm ? 'Close Form' : 'Add New Entry'}
          onPress={() => setShowForm(!showForm)}
        />
      </View>

      {showForm && (
        <NewEntryForm
          onEntryAdded={() => {
            refreshEntries();
            setShowForm(false);
          }}
        />
      )}

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
              // refreshEntries={refreshEntries} // optional: for delete functionality
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
}
