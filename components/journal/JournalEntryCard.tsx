import { JournalEntry } from "@/app/(tabs)/journal/index";
import { MotiView } from "@/moti";
import { Router } from "expo-router";
import { Calendar, Clock } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface JournalEntryCardProps {
  entry: JournalEntry;
  index: number;
  global: any;
  theme: Record<string, string>;
  router: Router;
}

export function JournalEntryCard({
  entry,
  index,
  global,
  theme,
  router,
}: JournalEntryCardProps) {
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return (
    <MotiView
      key={entry.id}
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        delay: index * 100,
        type: "timing",
        duration: 400,
      }}
      style={{ marginBottom: 20, width: "100%" }}
    >
      {/* Timeline marker */}
      <View
        style={[styles.timelineMarker, { backgroundColor: entry.moodColor }]}
      />

      {/* Date and Time - Compacter en eleganter */}
      <View style={styles.dateTimeRow}>
        <View
          style={[
            styles.dateTimeBadge,
            { backgroundColor: `${theme.accent}15` },
          ]}
        >
          <Calendar size={12} color={theme.accent} />
          <Text style={[styles.dateTimeText, { color: theme.accent }]}>
            {formatDate(entry.date)}
          </Text>
        </View>
        <View
          style={[
            styles.dateTimeBadge,
            { backgroundColor: `${theme.accent}15` },
          ]}
        >
          <Clock size={12} color={theme.accent} />
          <Text style={[styles.dateTimeText, { color: theme.accent }]}>
            {formatTime(entry.date)}
          </Text>
        </View>
      </View>

      {/* Main Card */}
      <TouchableOpacity style={[global.card, styles.card]} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.moodIconContainer,
              { backgroundColor: `${entry.moodColor}20` },
            ]}
          >
            <Text style={styles.moodIcon}>{entry.moodIcon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: theme.foreground }]}>
              {entry.title}
            </Text>
            <Text style={[styles.moodLabel, { color: theme.accent }]}>
              {entry.mood}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.cardContent, { color: theme.cardForeground }]}
          numberOfLines={3}
        >
          {entry.content}
        </Text>

        {entry.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {entry.tags.map((tag, i) => (
              <View
                key={i}
                style={[
                  styles.tag,
                  {
                    backgroundColor: `${entry.moodColor}15`,
                    borderColor: `${entry.moodColor}40`,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: theme.foreground,
                    fontWeight: "500",
                  }}
                >
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  timelineMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    left: 0,
    top: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 22,
    marginBottom: 10,
    gap: 8,
  },
  dateTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  dateTimeText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  moodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  moodIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
    opacity: 0.8,
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
    opacity: 0.9,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
});
