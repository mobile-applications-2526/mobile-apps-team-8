import { addJournalEntry } from "@/database";
import { SyncService } from "@/services/SyncService";
import { Colors, GlobalStyles } from "@/styles/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const emotions = [
  { id: "happy", label: "Happy", color: "#FFE66D", icon: "😊" },
  { id: "calm", label: "Calm", color: "#A8E6CF", icon: "😌" },
  { id: "anxious", label: "Anxious", color: "#FFB3BA", icon: "😰" },
  { id: "sad", label: "Sad", color: "#B3D9FF", icon: "😢" },
  { id: "excited", label: "Excited", color: "#FFDFBA", icon: "🤗" },
  { id: "stressed", label: "Stressed", color: "#FFCCCB", icon: "😫" },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const mode = useColorScheme() || "light";
  const styles = GlobalStyles(mode);
  const theme = Colors[mode];
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      if (selected) {
        const storedUser = await AsyncStorage.getItem("loggedInUser");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const username = parsedUser?.username || "guest";
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const dateStr = now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        console.log("📝 Adding mood check-in...");
        addJournalEntry({
          title: `Mood Check-in - ${dateStr} at ${timeStr}`,
          content: `Checked in feeling ${selected}.`,
          mood: selected,
          tags: ["check-in"],
          date: Date.now(),
          username,
        });

        // Sync if online
        const online = await SyncService.isOnline();
        if (online) {
          console.log("🔄 Syncing after check-in...");
          try {
            await SyncService.syncJournals(username);
            console.log("✅ Sync complete");
          } catch (error) {
            console.error("⚠️ Sync failed:", error);
          }
        } else {
          console.log("📴 Offline, skipping sync");
        }
      }
    } catch (error) {
      console.error("❌ Error in check-in:", error);
    } finally {
      setIsLoading(false);
      router.replace("/(tabs)");
    }
  };

  return (
    <ScrollView
      testID="onboarding-screen"
      contentContainerStyle={{
        padding: 24,
        flexGrow: 1,
        justifyContent: "center",
        height: "100%",
        backgroundColor: theme.background,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={{ alignItems: "center" }}
      >
        <Text style={[styles.title, { fontSize: 42, marginBottom: 8 }]}>
          Reflect
        </Text>
        <Text style={[styles.subtitle, { textAlign: "center", maxWidth: 280 }]}>
          Your personal space for mindful reflection and growth 🌿
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(200).duration(600)}
        style={{ marginTop: 40 }}
      >
        <Text
          style={[
            styles.subtitle,
            { textAlign: "center", marginBottom: 16, color: theme.foreground },
          ]}
        >
          How are you feeling right now?
        </Text>

        <FlatList
          testID="onboarding-emotions-list"
          data={emotions}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              testID={`onboarding-emotion-${item.id}`}
              style={[
                localStyles.emotionButton,
                {
                  backgroundColor:
                    selected === item.id
                      ? item.color + "AA"
                      : item.color + "40",
                },
              ]}
              onPress={() => setSelected(item.id)}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel={`Select emotion ${item.id}`}
            >
              <Text style={{ fontSize: 28 }}>{item.icon}</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: mode === "dark" ? theme.foreground : "#333",
                  marginTop: 4,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).duration(800)}
        style={{ marginTop: 40, alignItems: "center" }}
      >
        <TouchableOpacity
          testID="onboarding-continue-button"
          style={[
            localStyles.continueButton,
            {
              backgroundColor: theme.primary,
              opacity: isLoading ? 0.6 : 1,
            },
          ]}
          onPress={handleContinue}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Continue onboarding"
        >
          {isLoading ? (
            <ActivityIndicator
              testID="onboarding-continue-loading"
              style={localStyles.continueText}
              color={theme.primaryForeground}
            />
          ) : (
            <Text
              style={[
                localStyles.continueText,
                { color: theme.primaryForeground },
              ]}
            >
              Continue
            </Text>
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.subtitle,
            {
              marginTop: 16,
              textAlign: "center",
              fontSize: 14,
              color: theme.foreground,
              opacity: 0.7,
            },
          ]}
        >
          Track your mood throughout the day
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  emotionButton: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  continueButton: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  continueText: {
    fontSize: 18,
    fontWeight: "500",
    paddingHorizontal: 24,
  },
});
