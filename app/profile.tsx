import { Colors, GlobalStyles } from "@/styles/global";
import { createProfileStyles } from "@/styles/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const mode = useColorScheme() || "light";
  const global = GlobalStyles(mode);
  const styles = createProfileStyles(mode);
  const router = useRouter();
  const theme = Colors[mode];

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("loggedInUser");
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      setUsername(parsed?.username || "User");
    };
    loadUser();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: mode === "light" ? "#F5F1E8" : "#1A1B2E",
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginRight: 12 }}
      >
        <ArrowLeft size={24} color={theme.foreground} />
      </TouchableOpacity>
      <View style={global.container}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {username?.[0].toUpperCase() || "U"}
          </Text>
        </View>

        <Text style={styles.username} testID="profile-username">
          {username}
        </Text>

        <Pressable style={[styles.button, styles.buttonColor()]}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.buttonColor(true)]}
          onPress={async () => {
            await AsyncStorage.removeItem("loggedInUser");
            router.replace("/login");
          }}
        >
          <Text style={styles.buttonText} testID="profile-logout-button">
            Log Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
