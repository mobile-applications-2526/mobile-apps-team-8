import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

export function MoodFilter({
  uniqueMoods,
  selectedMood,
  setSelectedMood,
  moodIcons,
  theme,
}: any) {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.scrollContent}
      showsHorizontalScrollIndicator={false}
    >
      <TouchableOpacity
        style={[
          styles.filterButton,
          {
            backgroundColor: !selectedMood ? theme.primary : theme.card,
            borderColor: !selectedMood ? theme.primary : `${theme.border}40`,
          },
        ]}
        onPress={() => setSelectedMood(null)}
      >
        <Text
          style={[
            styles.allText,
            {
              color: !selectedMood ? theme.primaryForeground : theme.foreground,
              fontWeight: !selectedMood ? "700" : "500",
            },
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {uniqueMoods.map((mood: string) => {
        const isSelected = selectedMood === mood;
        return (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodButton,
              {
                backgroundColor: isSelected ? theme.primary : theme.card,
                borderColor: isSelected ? theme.primary : `${theme.border}40`,
                borderWidth: 1,
              },
            ]}
            onPress={() => setSelectedMood(isSelected ? null : mood)}
          >
            <Text style={styles.emoji}>{moodIcons[mood]}</Text>
            {isSelected && (
              <View
                style={[
                  styles.selectedIndicator,
                  { backgroundColor: theme.primaryForeground },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  allText: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
  moodButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  emoji: {
    fontSize: 22,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
