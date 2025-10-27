import { addJournalEntry } from '@/database';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface NewEntryFormProps {
  onEntryAdded: () => void; 
}

const moodOptions = [
  { mood: 'happy', icon: '😊', color: '#FFD700' },
  { mood: 'calm', icon: '😌', color: '#87CEFA' },
  { mood: 'anxious', icon: '😰', color: '#FF6347' },
  { mood: 'sad', icon: '😢', color: '#1E90FF' },
  { mood: 'excited', icon: '🤗', color: '#FF69B4' },
  { mood: 'stressed', icon: '😫', color: '#FF4500' },
  { mood: 'peaceful', icon: '☮️', color: '#98FB98' },
  { mood: 'grateful', icon: '🙏', color: '#FFDAB9' },
];

export const NewEntryForm: React.FC<NewEntryFormProps> = ({ onEntryAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [selectedMood, setSelectedMood] = useState(moodOptions[0]);

  const handleSubmit = () => {
    if (!title || !content) {
      alert('Please fill in title and content');
      return;
    }

    addJournalEntry({
      title,
      content,
      mood: selectedMood.mood,
      moodColor: selectedMood.color,
      moodIcon: selectedMood.icon,
      tags: tags.split(',').map(t => t.trim()),
      date: Date.now(),
    });

    setTitle('');
    setContent('');
    setTags('');
    setSelectedMood(moodOptions[0]);

    onEntryAdded();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Entry title"
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        style={[styles.input, { height: 100 }]}
        placeholder="Write your journal entry..."
        multiline
      />

      <Text style={styles.label}>Tags (comma separated)</Text>
      <TextInput
        value={tags}
        onChangeText={setTags}
        style={styles.input}
        placeholder="e.g. work, family"
      />

      <Text style={styles.label}>Mood</Text>
      <View style={styles.moodContainer}>
        {moodOptions.map((m) => (
          <TouchableOpacity
            key={m.mood}
            style={[
              styles.moodButton,
              selectedMood.mood === m.mood && { borderColor: 'black', borderWidth: 2 },
            ]}
            onPress={() => setSelectedMood(m)}
          >
            <Text style={{ fontSize: 24 }}>{m.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Add Entry" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginVertical: 8, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  moodButton: {
    margin: 4,
    padding: 8,
    borderRadius: 8,
  },
});
