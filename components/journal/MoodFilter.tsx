import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

export function MoodFilter({ uniqueMoods, selectedMood, setSelectedMood, moodIcons, theme }: any) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      showsHorizontalScrollIndicator={false}
    >
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: !selectedMood ? theme.primary : theme.card, paddingHorizontal: 16 }
        ]}
        onPress={() => setSelectedMood(null)}
      >
        <Text style={{ color: !selectedMood ? theme.primaryForeground : theme.foreground, fontWeight: '600' }}>All</Text>
      </TouchableOpacity>

      {uniqueMoods.map((mood: string) => (
        <TouchableOpacity
          key={mood}
          style={[
            styles.button,
            selectedMood === mood && { backgroundColor: theme.primary }
          ]}
          onPress={() => setSelectedMood(selectedMood === mood ? null : mood)}
        >
          <Text style={styles.emoji}>{moodIcons[mood]}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    minWidth: 40,
    marginRight: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  emoji: {
    fontSize: 20,
    textAlign: 'center',
  },
});
