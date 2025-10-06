import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { GlobalStyles } from '@/styles/global';

export default function HomeScreen() {
  const router = useRouter();
    const mode = useColorScheme() || 'light';   
  const styles = GlobalStyles(mode);   

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Welcome</Text>      
    </View>
  );
}
