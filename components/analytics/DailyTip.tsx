import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { MotiView } from "moti";
import { Colors } from "@/styles/global";

const tips = [
  "Take 5 minutes to breathe and reflect before journaling.",
  "Write about something you’re grateful for today.",
  "Consistency beats quantity: small daily entries add up.",
  "Track your mood daily to spot patterns faster.",
  "Review past entries once a week to see your progress.",
  "Journaling before bed improves sleep and reflection.",
  "Don’t worry about perfection — write what comes to mind.",
  "Feeling stressed? Write about it to release tension.",
  "Try focusing on your wins today, big or small.",
  "Reflect on a challenge and what you learned from it.",
];

export function DailyTip({ global }: { global: any }) {
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];

  const today = new Date();
  const tipIndex = today.getDate() % tips.length;
  const tipOfTheDay = tips[tipIndex];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 200 }}
      style={[global.card, styles.card]}
    >
      <Text style={[styles.header, { color: theme.foreground }]}>
        💡 Tip of the Day
      </Text>
      <Text style={[styles.tipText, { color: theme.cardForeground }]}>
        {tipOfTheDay}
      </Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 20,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
