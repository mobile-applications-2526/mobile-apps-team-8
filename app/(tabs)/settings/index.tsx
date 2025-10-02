import { GlobalStyles } from '@/styles/global';
import React, { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={GlobalStyles.container}>
      
      <View style={{ marginBottom: 32, width: '100%' }}>
        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>Preferences</Text>

        <View style={GlobalStyles.row}>
          <Text>Enable Notifications</Text>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>

        <View style={GlobalStyles.row}>
          <Text>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      
      <View style={{ width: '100%' }}>
        <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>About</Text>

        <TouchableOpacity style={GlobalStyles.row}>
          <Text>App Version</Text>
          <Text style={{ fontWeight: '600' }}>1.0.0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={GlobalStyles.row}>
          <Text>Terms of Service</Text>
          <Text style={{ fontWeight: '600' }}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
