import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

export function MoodFilter({ uniqueMoods, selectedMood, setSelectedMood, moodIcons, theme }: any) {
  return (
    <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }} showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: !selectedMood ? theme.primary : theme.card }}
        onPress={() => setSelectedMood(null)}
      >
        <Text style={{ color: !selectedMood ? theme.primaryForeground : theme.foreground }}>All</Text>
      </TouchableOpacity>
      {uniqueMoods.map((mood: string) => (
        <TouchableOpacity
          key={mood}
          style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: selectedMood === mood ? theme.primary : theme.card }}
          onPress={() => setSelectedMood(selectedMood === mood ? null : mood)}
        >
          <Text>{moodIcons[mood]}</Text>
          <Text style={{ marginLeft: 4, color: theme.foreground }}>{mood}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
