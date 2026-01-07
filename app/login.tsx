import UserService from "@/services/UserService";
import { createLoginStyles } from "@/styles/login.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mode = useColorScheme() || "light";
  const styles = createLoginStyles(mode);

  useEffect(() => {
    AsyncStorage.getItem("loggedInUser").then((user) => {
      if (user) router.replace("/onboarding");
    });
  }, []);

  const handleLogin = async () => {
    try {
      const user = { email, password };
      const response = await UserService.loginUser(user);

      if (response.ok) {
        const data = await response.json();

        await AsyncStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            token: data.token,
            username: data.username,
            email: data.email,
          })
        );

        Toast.show({
          type: "success",
          text1: "Login successful",
          text2: `Welcome back, ${data.username || "user"} 👋`,
          position: "top",
          visibilityTime: 2000,
        });

        setTimeout(() => router.replace("/onboarding"), 2000);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Invalid credentials";

        if (response.status === 429) {
          Toast.show({
            type: "error",
            text1: "Too many attempts",
            text2: errorMessage,
            position: "top",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Login failed",
            text2: errorMessage,
            position: "top",
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong while logging in.",
        position: "top",
      });
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
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
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={
                mode === "dark"
                  ? "rgba(232, 221, 212, 0.4)"
                  : "rgba(60, 65, 66, 0.4)"
              }
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button]}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
