import { GlobalStyles } from '@/styles/global';
import React from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Nigga</Text>
      <Text style={GlobalStyles.subtitle}>The App</Text>
    </View>
  );
}
