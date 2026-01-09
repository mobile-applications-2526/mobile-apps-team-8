import { Colors, GlobalStyles } from "@/styles/global";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";

import { HomeAIInsights } from "@/components/home/AIInsights";
import { HomeHeader } from "@/components/home/Header";
import { HomeQuickActions } from "@/components/home/QuickActions";
import { HomeRecentReflection } from "@/components/home/RecentReflection";
import { HomeWeeklyMood } from "@/components/home/WeeklyMood";
import { getAllJournalEntriesForUser } from "@/database";
import { SyncService } from "@/services/SyncService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { JournalEntry } from "./journal";

export default function HomeScreen() {
  const router = useRouter();
  const mode = useColorScheme() || "light";
  const global = GlobalStyles(mode);
  const theme = Colors[mode];

  const [username, setUsername] = useState<string | null>(null);
  const [latestEntry, setLatestEntry] = useState<JournalEntry | null>(null);
  const [weeklyMoodData, setWeeklyMoodData] = useState<
    { day: string; mood: number; color: string }[]
  >([]);
  const [recentInsights, setRecentInsights] = useState<string[]>([]);

  const loadHomeData = async () => {
    const storedUser = await AsyncStorage.getItem("loggedInUser");
    if (!storedUser) return;
    const { username } = JSON.parse(storedUser);
    setUsername(username);

    const rawEntries: JournalEntry[] = await getAllJournalEntriesForUser(
      username
    );

    const entries = rawEntries.map((e) => ({
      ...e,
      date: e.date instanceof Date ? e.date : new Date(e.date),
    }));

    if (!entries.length) return;

    const sortedEntries = entries.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    setLatestEntry(sortedEntries[0]);

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const last7Days = Array.from({ length: 7 })
      .map((_, i) => {
        const day = new Date();
        day.setDate(today.getDate() - i);
        return day;
      })
      .reverse();

    const moodData = last7Days.map((day) => {
      const dayEntries = entries.filter(
        (entry) =>
          entry.date.getFullYear() === day.getFullYear() &&
          entry.date.getMonth() === day.getMonth() &&
          entry.date.getDate() === day.getDate()
      );
      const avgMood = dayEntries.length
        ? dayEntries.reduce((sum, e) => sum + parseFloat(e.mood || "5"), 0) /
          dayEntries.length
        : 5;
      return {
        day: weekDays[day.getDay()],
        mood: Math.round(avgMood),
        color: theme.primary,
      };
    });

    setWeeklyMoodData(moodData);

    const insights = sortedEntries
      .slice(0, 3)
      .map((e) => `You reflected on "${e.title}" on ${e.date.toDateString()}`);
    setRecentInsights(insights);
  };

  // Initial load on mount - sync first, then load data
  useEffect(() => {
    const initialize = async () => {
      const storedUser = await AsyncStorage.getItem("loggedInUser");
      if (!storedUser) return;
      const { username } = JSON.parse(storedUser);

      console.log("🏠 Loading home screen data...");

      // First sync with backend if online
      const online = await SyncService.isOnline();
      if (online) {
        console.log("🔄 Syncing journals for home screen...");
        try {
          await SyncService.syncJournals(username);
          console.log("✅ Home screen sync complete");
        } catch (error) {
          console.error("⚠️ Home screen sync failed:", error);
        }
      }

      // Then load data
      await loadHomeData();
    };

    initialize();
  }, []);

  // Reload on focus
  useFocusEffect(
    React.useCallback(() => {
      const syncAndLoad = async () => {
        const storedUser = await AsyncStorage.getItem("loggedInUser");
        if (!storedUser) return;
        const { username } = JSON.parse(storedUser);

        // Load local data immediately
        await loadHomeData();

        // Then sync in background
        const online = await SyncService.isOnline();
        if (online) {
          try {
            await SyncService.syncJournals(username);
            await loadHomeData();
          } catch (error) {
            console.error("⚠️ Focus sync failed:", error);
          }
        }
      };

      syncAndLoad();
    }, [theme.primary])
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: theme.background },
      ]}
    >
      <HomeHeader />
      <HomeQuickActions router={router} />
      {weeklyMoodData.length > 0 && (
        <HomeWeeklyMood global={global} moodData={weeklyMoodData} />
      )}
      {latestEntry && (
        <HomeRecentReflection
          global={global}
          router={router}
          entry={latestEntry}
        />
      )}
      {recentInsights.length > 0 && (
        <HomeAIInsights global={global} recentInsights={recentInsights} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 80,
  },
});
