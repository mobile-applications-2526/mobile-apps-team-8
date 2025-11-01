import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createLoginStyles } from '../styles/login.styles';
import UserService from '@/services/UserService';
import Toast from 'react-native-toast-message';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState("");


  const styles = createLoginStyles('light');

  const handleSignup = async () => {
    try {
      const user = {
        username,
        password,
        email
      };

      const response = await UserService.registerUser(user);

      if (response.ok) {
        Toast.show({
                  type: 'success',
                  text1: 'Registration successful',
                  text2: `Welcome aboard, ${username || 'user'} 👋`,
                  position: 'top',
                  visibilityTime: 2000,
                });

        const loginResponse = await UserService.loginUser({ email, password });
        if (loginResponse.ok) {
          const data = await loginResponse.json();

          await AsyncStorage.setItem(
            'loggedInUser',
            JSON.stringify({
              token: data.token,
              username: data.username,
              email: data.email,
            })
          );

          router.replace('/onboarding');
        }
      } else {
        const err = await response.json();
        Alert.alert('Error', err.message || 'Signup failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong during signup.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Choose your username"
              placeholderTextColor="rgba(60, 65, 66, 0.4)"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Create a password"
              placeholderTextColor="rgba(60, 65, 66, 0.4)"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Use your email address"
              placeholderTextColor="rgba(60, 65, 66, 0.4)"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>


          <TouchableOpacity 
            style={[styles.button]} 
            onPress={handleSignup}
            activeOpacity={0.8}
          >

          <Text style={styles.buttonText}>Sign Up</Text>

          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.signUpText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


