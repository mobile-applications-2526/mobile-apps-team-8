import UserService from "@/services/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Toast from "react-native-toast-message";
import { createLoginStyles } from "../styles/login.styles";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const mode = useColorScheme() || "light";
  const styles = createLoginStyles(mode);

  const handleSignup = async () => {
    try {
      const user = {
        username,
        password,
        email,
      };

      const response = await UserService.registerUser(user);

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Registration successful",
          text2: `Welcome aboard, ${username || "user"} 👋`,
          position: "top",
          visibilityTime: 2000,
        });

        const loginResponse = await UserService.loginUser({ email, password });
        if (loginResponse.ok) {
          const data = await loginResponse.json();

          await AsyncStorage.setItem(
            "loggedInUser",
            JSON.stringify({
              token: data.token,
              username: data.username,
              email: data.email,
            })
          );

          setTimeout(() => router.replace("/onboarding"), 2000);
        }
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Signup failed";

        Toast.show({
          type: "error",
          text1: "Registration failed",
          text2: errorMessage,
          position: "top",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      Toast.show({
        type: "error",
        text1: "Signup error",
        text2:
          error?.message ??
          (typeof error === "string" ? error : JSON.stringify(error)),
        position: "top",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      testID="signup-screen"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              testID="signup-email-input"
              placeholder="Use your email address"
              placeholderTextColor={
                mode === "dark"
                  ? "rgba(232, 221, 212, 0.4)"
                  : "rgba(60, 65, 66, 0.4)"
              }
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              testID="signup-username-input"
              placeholder="Choose your username"
              placeholderTextColor={
                mode === "dark"
                  ? "rgba(232, 221, 212, 0.4)"
                  : "rgba(60, 65, 66, 0.4)"
              }
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              testID="signup-password-input"
              placeholder="Create a password"
              placeholderTextColor={
                mode === "dark"
                  ? "rgba(232, 221, 212, 0.4)"
                  : "rgba(60, 65, 66, 0.4)"
              }
              style={styles.input}
              autoCapitalize="none"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              underlineColorAndroid="transparent"
            />
          </View>

          <TouchableOpacity
            testID="signup-submit-button"
            style={[styles.button]}
            onPress={handleSignup}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signUpText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
