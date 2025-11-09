import { Colors, GlobalStyles } from "@/styles/global";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
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
import { getAllJournalEntriesForUser, initDB } from "@/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "@/components/header/Header";
import { BookOpen, RefreshCw } from "lucide-react-native";
import { SyncService } from "@/services/SyncService";
import Toast from "react-native-toast-message";
import { moodConfig } from "@/hooks/mood-mapping";

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
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

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

  const enrichEntryWithMoodData = (entry: any): JournalEntry => {
    const moodKey = entry.mood?.toLowerCase() || "happy";
    const config = moodConfig[moodKey] || moodConfig.happy;

    return {
      ...entry,
      mood: moodKey,
      moodIcon: config.icon,
      moodColor: config.color,
      date: entry.date instanceof Date ? entry.date : new Date(entry.date),
    };
  };

  const refreshEntries = useCallback(() => {
    if (!username) return;
    const data = getAllJournalEntriesForUser(username);
    const enrichedData = data.map(enrichEntryWithMoodData);
    setEntries(enrichedData);
  }, [username]);

  const handleSync = useCallback(
    async (user: string, silent: boolean = false) => {
      if (!user) {
        if (!silent) {
          Toast.show({
            type: "error",
            text1: "Sync Failed",
            text2: "No user logged in",
            position: "top",
          });
        }
        return;
      }

      setIsSyncing(true);

      try {
        const online = await SyncService.isOnline();

        if (!online) {
          if (!silent) {
            Toast.show({
              type: "info",
              text1: "Offline",
              text2: "Cannot sync while offline",
              position: "top",
              visibilityTime: 2000,
            });
          }
          setIsSyncing(false);
          return;
        }

        const results = await SyncService.syncJournals(user);

        const data = getAllJournalEntriesForUser(user);
        const enrichedData = data.map(enrichEntryWithMoodData);
        setEntries(enrichedData);

        const newSyncTime = await SyncService.getLastSyncTime();
        setLastSyncTime(newSyncTime);

        if (!silent) {
          if (results.uploaded > 0 || results.downloaded > 0) {
            Toast.show({
              type: "success",
              text1: "Sync Complete",
              text2: `↑ ${results.uploaded} uploaded, ↓ ${results.downloaded} downloaded`,
              position: "top",
              visibilityTime: 3000,
            });
          }
        }

        if (results.errors.length > 0) {
          console.warn("Sync errors:", results.errors);
          if (!silent) {
            Toast.show({
              type: "error",
              text1: "Sync completed with errors",
              text2: `${results.errors.length} error(s) occurred`,
              position: "top",
            });
          }
        }
      } catch (error) {
        console.error("Sync error:", error);
        if (!silent) {
          Toast.show({
            type: "error",
            text1: "Sync Failed",
            text2: String(error),
            position: "top",
          });
        }
      } finally {
        setIsSyncing(false);
      }
    },
    []
  );

  useEffect(() => {
    const loadEntries = async () => {
      console.log("🔧 Initializing database...");
      initDB();

      const storedUser = await AsyncStorage.getItem("loggedInUser");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      if (parsedUser?.username) {
        setUsername(parsedUser.username);

        const data = getAllJournalEntriesForUser(parsedUser.username);
        const enrichedData = data.map(enrichEntryWithMoodData);
        setEntries(enrichedData);

        const lastSync = await SyncService.getLastSyncTime();
        setLastSyncTime(lastSync);

        await handleSync(parsedUser.username, true);
      }
    };

    loadEntries();
  }, [handleSync]);

  //Let it sync every minute aswell
  useEffect(() => {
    if (!username) return;
    const syncInterval = setInterval(async () => {
      const online = await SyncService.isOnline();
      if (!online) {
        return;
      }
      handleSync(username, true);
    }, 60000);

    return () => {
      clearInterval(syncInterval);
    };
  }, [username, handleSync]);

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
      edges={["right", "left"]}
    >
      <Header
        title="Journal"
        subtitle="Your thoughts and reflections"
        icon={BookOpen}
        showBackButton={false}
        global={global}
        insets={insets}
      />
      <View>
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
      </View>

      {filteredEntries.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ color: theme.foreground, fontSize: 16 }}>
            No entries found
          </Text>
          {searchQuery || selectedMood ? (
            <Text
              style={{
                color: theme.accent,
                fontSize: 14,
                marginTop: 8,
              }}
            >
              Try adjusting your filters
            </Text>
          ) : null}
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
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 100,
          }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={true}
        />
      )}

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: theme.primary,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 6,
          elevation: 5,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 32, color: theme.primaryForeground }}>+</Text>
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
                if (username) {
                  handleSync(username, true);
                }
              }}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
