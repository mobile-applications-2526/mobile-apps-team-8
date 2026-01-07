import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { MotiView } from "moti";
import { Colors } from "@/styles/global";
import { Target, Award, Zap } from "lucide-react-native";

const icons = { target: Target, award: Award, zap: Zap };

export function StreakCards({
  streaks,
  global,
}: {
  streaks: {
    label: string;
    value: string;
    color: string;
    icon: keyof typeof icons;
  }[];
  global: any;
}) {
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];

  return (
    <View style={styles.container}>
      {streaks.map((streak, i) => {
        const Icon = icons[streak.icon];
        return (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <View
              style={[
                global.card,
                styles.card,
                { backgroundColor: theme.card },
              ]}
            >
              <Icon size={20} color={streak.color} />
              <Text style={[styles.value, { color: theme.foreground }]}>
                {streak.value}
              </Text>
              <Text style={[styles.label, { color: theme.accent }]}>
                {streak.label}
              </Text>
            </View>
          </MotiView>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  card: {
    width: 100,
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
  },
  value: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  label: { fontSize: 10 },
});
