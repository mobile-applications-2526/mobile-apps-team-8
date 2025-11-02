import { Colors, GlobalStyles } from "@/styles/global";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import { JournalSearch } from "@/components/journal/JournalSearch";
import { MoodFilter } from "@/components/journal/MoodFilter";
import { NewEntryForm } from "@/components/journal/NewEntryForm";
import {
  getAllJournalEntries,
  getAllJournalEntriesForUser,
  initDB,
} from "@/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/header/Header";
import { BookOpen, MessageCircle } from "lucide-react-native";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  moodColor: string;
  moodIcon: string;
  date: Date;
  tags: string[];
  username: string;
}

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      initDB();
      const storedUser = await AsyncStorage.getItem("loggedInUser");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser?.username) {
        setUsername(parsedUser.username);
        const data = getAllJournalEntriesForUser(parsedUser.username);
        setEntries(data);
      }
    };

    loadEntries();
  }, []);

  const refreshEntries = () => {
    if (!username) return;
    const data = getAllJournalEntriesForUser(username);
    setEntries(data);
  };

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];
  const global = GlobalStyles(mode);

  const moodIcons: { [key: string]: string } = {
    happy: "😊",
    calm: "😌",
    anxious: "😰",
    sad: "😢",
    excited: "🤗",
    stressed: "😫",
    peaceful: "☮️",
    grateful: "🙏",
  };

  const uniqueMoods = Array.from(new Set(entries.map((entry) => entry.mood)));

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesMood = !selectedMood || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["right", "left"]} // Only apply safe area to top edge
    >
      <Header
        title="Journal"
        subtitle="Your thoughts and reflections"
        icon={BookOpen}
        showBackButton={true}
        global={global}
        insets={insets}
      />
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

      <View style={{ flex: 25 }}>
        {filteredEntries.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Text style={{ color: theme.foreground, fontSize: 16 }}>
              No entries found
            </Text>
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
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 1 }}
          />
        )}
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: "#D4AEA3",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 6,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 32, color: "white" }}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: theme.background,
              marginHorizontal: 16,
              borderRadius: 24,
              padding: 16,
              maxHeight: "80%",
            }}
          >
            <NewEntryForm
              onEntryAdded={() => {
                refreshEntries();
                setModalVisible(false);
              }}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
