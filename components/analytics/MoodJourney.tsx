import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { MotiView } from "moti";
import { Calendar } from "lucide-react-native";
import { Colors } from "@/styles/global";
import { getAllJournalEntriesForUser } from "@/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const moodMap: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  excited: "🤗",
  anxious: "😰",
  sad: "😢",
  stressed: "😫",
};

export function MoodJourney({ global }: { global: any }) {
  const [entries, setEntries] = useState<any[]>([]);
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];

  useEffect(() => {
    const loadEntries = async () => {
      const username = (await AsyncStorage.getItem("loggedInUser")) || "guest";
      const data = getAllJournalEntriesForUser(username);
      setEntries(data);
    };
    loadEntries();
  }, []);

  const startOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); 
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff));
  };

  const today = new Date();
  const weekStart = startOfWeek(today);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);

    const dayEntries = entries.filter(
      (e) => new Date(e.date).toDateString() === date.toDateString()
    );

    const entry = dayEntries.sort((a, b) => b.date - a.date)[0];

    return {
      day: weekdayLabels[i],
      mood: entry ? moodMap[entry.mood as string] || entry.mood : "",
    };
  });

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.6 }}
    >
      <View style={[global.card, styles.card]}>
        <View style={styles.headerRow}>
          <Calendar size={18} color={theme.primary} />
          <Text style={[styles.cardTitle, { color: theme.foreground }]}>
            Mood This Week
          </Text>
        </View>
        <View style={styles.weekRow}>
          {weekDays.map((day) => (
            <View key={day.day} style={styles.dayContainer}>
              <Text style={{ color: theme.foreground, fontSize: 12 }}>
                {day.day}
              </Text>
              <Text style={{ fontSize: 24, marginTop: 4 }}>{day.mood}</Text>
            </View>
          ))}
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 20, backgroundColor: "#fff" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { marginLeft: 8, fontSize: 16, fontWeight: "600" },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  dayContainer: { alignItems: "center", width: 40 },
});


