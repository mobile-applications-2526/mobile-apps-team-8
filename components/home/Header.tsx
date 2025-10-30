import React, { useEffect, useState } from 'react';
import { View, Text, useColorScheme, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { Sparkles } from 'lucide-react-native';
import { Colors } from '@/styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';


export function HomeHeader() {
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  const [username, setUsername] = useState<string | null>(null);


  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loggedInUser');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUsername(parsed.username || null);
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
      }
    };

    loadUser();
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
      ? 'Good afternoon'
      : 'Good evening';

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 600 }}
      style={styles.header}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: theme.foreground }]}>
            {greeting}
            {username ? `, ${username}` : ''}
          </Text>
          <Text style={[styles.subtitle, { color: theme.accent }]}>
            How are you feeling today?
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/profile')}
          style={[styles.profileContainer, { backgroundColor: theme.primary }]}
        >
          <Text style={{ color: theme.primaryForeground, fontWeight: '600', fontSize: 18 }}>
            {username?.[0].toUpperCase() || 'U'}
          </Text>
        </Pressable>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 26, fontWeight: '600' },
  subtitle: { fontSize: 14, marginTop: 4 },
  sparkleContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
