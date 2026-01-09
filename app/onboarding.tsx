import { addJournalEntry } from "@/database";
import { GlobalStyles } from "@/styles/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = async () => {
    if (selected) {
      const username = (await AsyncStorage.getItem("loggedInUser")) || "guest";

      addJournalEntry({
        title: "Startup Mood",
        content: "",
        mood: selected,
        tags: ["startup"],
        date: Date.now(),
        username,
      });
    }
    router.replace("/(tabs)");
  };

  return (
    <ScrollView
      testID="onboarding-screen"
      contentContainerStyle={{
        padding: 24,
        flexGrow: 1,
        justifyContent: "center",
        height: "100%",
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
          style={[styles.subtitle, { textAlign: "center", marginBottom: 16 }]}
        >
          How are you feeling today?
        </Text>

        <FlatList
          data={emotions}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          scrollEnabled={false} // let ScrollView handle scrolling
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
            >
              <Text style={{ fontSize: 28 }}>{item.icon}</Text>
              <Text style={{ fontSize: 14, color: "#333", marginTop: 4 }}>
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
          style={localStyles.continueButton}
          disabled={!selected}
          onPress={handleContinue}
        >
          <Text style={localStyles.continueText}>Continue your journey ✨</Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.subtitle,
            { marginTop: 16, textAlign: "center", fontSize: 14 },
          ]}
        >
          A safe space for your thoughts and feelings
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
    backgroundColor: "#A8B5A0",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    paddingHorizontal: 24,
  },
});
