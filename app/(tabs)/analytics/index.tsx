import { DailyTip } from "@/components/analytics/DailyTip";
import { MoodJourney } from "@/components/analytics/MoodJourney";
import { StreakCards } from "@/components/analytics/StreakCards";
import Header from "@/components/header/Header";
import { getAllJournalEntriesForUser } from "@/database";
import { Colors, GlobalStyles } from "@/styles/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { BarChart3 } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function AnalyticsScreen() {
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];
  const global = GlobalStyles(mode);
  const insets = useSafeAreaInsets();

  const [entries, setEntries] = useState<any[]>([]);
  const [streaks, setStreaks] = useState<any[]>([]);
  const [moodJourney, setMoodJourney] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadAnalytics = async () => {
        const storedUser = await AsyncStorage.getItem("loggedInUser");
        if (!storedUser) return;
        const { username } = JSON.parse(storedUser);

        const rawEntries = await getAllJournalEntriesForUser(username);

        const parsedEntries = rawEntries
          .map((e) => ({
            ...e,
            date: e.date instanceof Date ? e.date : new Date(e.date),
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        setEntries(parsedEntries);

        const today = new Date();
        const dates = parsedEntries.map((e) => e.date.toDateString());
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        for (let i = dates.length - 1; i >= 0; i--) {
          const entryDate = new Date(dates[i]);
          const diffDays = Math.floor(
            (today.getTime() - entryDate.getTime()) / 86400000
          );
          if (diffDays === currentStreak) {
            tempStreak++;
            currentStreak++;
          } else {
            if (tempStreak > longestStreak) longestStreak = tempStreak;
            tempStreak = 1;
            currentStreak = 1;
          }
        }
        if (tempStreak > longestStreak) longestStreak = tempStreak;

        setStreaks([
          {
            label: "Current streak",
            value: `${currentStreak} day(s)`,
            color: "#A8B5A0",
            icon: "target",
          },
          {
            label: "Longest streak",
            value: `${longestStreak} day(s)`,
            color: "#D4A59A",
            icon: "award",
          },
          {
            label: "Total entries",
            value: `${parsedEntries.length}`,
            color: "#A8B5A0",
            icon: "zap",
          },
        ]);

        const weekMap: Record<string, number[]> = {};
        parsedEntries.forEach((e) => {
          const weekKey = `${e.date.getFullYear()}-W${getWeekNumber(e.date)}`;
          if (!weekMap[weekKey]) weekMap[weekKey] = [];
          const moodValue =
            typeof e.mood === "string" ? moodToNumber(e.mood) : Number(e.mood);
          weekMap[weekKey].push(moodValue);
        });

        const journey = Object.entries(weekMap)
          .slice(-5)
          .map(([week, moods]) => ({
            week,
            avg:
              Math.round(
                (moods.reduce((a, b) => a + b, 0) / moods.length) * 10
              ) / 10,
            color: "#A8E6CF",
          }));
        setMoodJourney(journey);

        const insightList = generateInsights(parsedEntries);
        setInsights(insightList);
      };

      loadAnalytics();
    }, [])
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["right", "left"]}
    >
      <Header
        title="Analytics"
        subtitle="Track your progress and insights"
        icon={BarChart3}
        showBackButton={true}
        global={global}
        insets={insets}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MoodJourney global={global} />
        <StreakCards streaks={streaks} global={global} />
        <DailyTip global={global} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getWeekNumber(date: Date) {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return weekNo;
}

function moodToNumber(mood: string) {
  const map: Record<string, number> = {
    happy: 8,
    calm: 7,
    excited: 9,
    anxious: 3,
    sad: 2,
    stressed: 1,
  };
  return map[mood] || 5;
}

function generateInsights(entries: any[]) {
  return entries.slice(-4).map((e) => ({
    title: e.title || "Entry",
    description: e.content.slice(0, 50) || "No content",
    icon: "📝",
    strength: "medium",
  }));
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});
