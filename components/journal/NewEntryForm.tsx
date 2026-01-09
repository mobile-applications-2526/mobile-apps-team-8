import { addJournalEntry } from "@/database";
import { Colors } from "@/styles/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Send, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface NewEntryFormProps {
  onEntryAdded: () => void;
  onCancel: () => void;
}

const moodOptions = [
  { mood: "happy", icon: "😊", color: "#FFD93D" },
  { mood: "calm", icon: "😌", color: "#A8E6CF" },
  { mood: "anxious", icon: "😰", color: "#FF6B6B" },
  { mood: "sad", icon: "😢", color: "#4ECDC4" },
  { mood: "excited", icon: "🤗", color: "#FFB347" },
  { mood: "stressed", icon: "😫", color: "#FF6B9D" },
  { mood: "peaceful", icon: "☮️", color: "#95E1D3" },
  { mood: "grateful", icon: "🙏", color: "#FECA57" },
];

export const NewEntryForm: React.FC<NewEntryFormProps> = ({
  onEntryAdded,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [selectedMood, setSelectedMood] = useState(moodOptions[0]);

  const mode = useColorScheme() || "light";
  const theme = Colors[mode];

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("Missing Information", "Please fill in title and content");
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem("loggedInUser");
      if (!storedUser) {
        Alert.alert("Not logged in", "You must be logged in to add entries.");
        return;
      }

      const { username } = JSON.parse(storedUser);

      addJournalEntry({
        title,
        content,
        mood: selectedMood.mood,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        date: Date.now(),
        username,
      });

      setTitle("");
      setContent("");
      setTags("");
      setSelectedMood(moodOptions[0]);

      onEntryAdded();
    } catch (error) {
      console.error("Error adding journal entry:", error);
      Alert.alert("Error", "Something went wrong while saving the entry.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header met close button */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.foreground }]}>
          New Entry
        </Text>
        <TouchableOpacity
          onPress={onCancel}
          style={[
            styles.closeButton,
            { backgroundColor: `${theme.destructive}20` },
          ]}
        >
          <X size={20} color={theme.destructive} />
        </TouchableOpacity>
      </View>

      {/* Title Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.foreground }]}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.foreground,
              borderColor: `${theme.border}50`,
            },
          ]}
          placeholder="What's on your mind?"
          placeholderTextColor={`${theme.foreground}50`}
        />
      </View>

      {/* Content Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.foreground }]}>Content</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: theme.card,
              color: theme.foreground,
              borderColor: `${theme.border}50`,
            },
          ]}
          placeholder="Write your thoughts and reflections..."
          placeholderTextColor={`${theme.foreground}50`}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Mood Selector */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.foreground }]}>
          How are you feeling?
        </Text>
        <View style={styles.moodContainer}>
          {moodOptions.map((m) => {
            const isSelected = selectedMood.mood === m.mood;
            return (
              <TouchableOpacity
                key={m.mood}
                style={[
                  styles.moodButton,
                  {
                    backgroundColor: isSelected ? `${m.color}30` : theme.card,
                    borderColor: isSelected ? m.color : `${theme.border}50`,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedMood(m)}
              >
                <Text style={styles.moodIcon}>{m.icon}</Text>
                <Text
                  style={[
                    styles.moodText,
                    {
                      color: theme.foreground,
                      fontWeight: isSelected ? "600" : "400",
                    },
                  ]}
                >
                  {m.mood}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Tags Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.foreground }]}>
          Tags{" "}
          <Text style={{ color: theme.accent, fontSize: 12 }}>(optional)</Text>
        </Text>
        <TextInput
          value={tags}
          onChangeText={setTags}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.foreground,
              borderColor: `${theme.border}50`,
            },
          ]}
          placeholder="e.g. work, family, gratitude"
          placeholderTextColor={`${theme.foreground}50`}
        />
        {tags.length > 0 && (
          <View style={styles.tagsPreview}>
            {tags.split(",").map((tag, i) => {
              const trimmedTag = tag.trim();
              if (!trimmedTag) return null;
              return (
                <View
                  key={i}
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: `${selectedMood.color}20`,
                      borderColor: `${selectedMood.color}50`,
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: theme.foreground }]}>
                    #{trimmedTag}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, { backgroundColor: theme.primary }]}
      >
        <Send size={18} color={theme.primaryForeground} />
        <Text style={[styles.submitText, { color: theme.primaryForeground }]}>
          Save Entry
        </Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  moodIcon: {
    fontSize: 20,
  },
  moodText: {
    fontSize: 13,
    textTransform: "capitalize",
  },
  tagsPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
