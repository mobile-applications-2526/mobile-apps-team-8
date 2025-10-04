import { GlobalStyles } from '@/styles/global';
import React from 'react';
import { Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={GlobalStyles.container}>
      
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View style={GlobalStyles.avatar}>
          <Text style={GlobalStyles.avatarInitials}>JD</Text>
        </View>
        <Text style={GlobalStyles.title}>John Doe</Text>
        <Text style={GlobalStyles.subtitle}>@johndoe</Text>
      </View>

      
      <View style={{ marginBottom: 24, paddingHorizontal: 16 }}>
        <Text style={{ textAlign: 'center', fontSize: 16, color: '#4A4A4A' }}>
          Just a simple profile page. I love experimenting with React Native and building cool apps!
        </Text>
      </View>

      
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={GlobalStyles.title}>102</Text>
          <Text style={GlobalStyles.subtitle}>Followers</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={GlobalStyles.title}>48</Text>
          <Text style={GlobalStyles.subtitle}>Following</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={GlobalStyles.title}>24</Text>
          <Text style={GlobalStyles.subtitle}>Posts</Text>
        </View>
      </View>
    </View>
  );
}
