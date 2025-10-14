import React from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { GlobalStyles, Colors } from '@/styles/global';

import { HomeHeader } from '@/components/home/Header';
import { HomeQuickActions } from '@/components/home/QuickActions';
import { HomeWeeklyMood } from '@/components/home/WeeklyMood';
import { HomeRecentReflection } from '@/components/home/RecentReflection';
import { HomeAIInsights } from '@/components/home/AIInsights';

export default function HomeScreen() {
  const router = useRouter();
  const mode = useColorScheme() || 'light';
  const global = GlobalStyles(mode);
  const theme = Colors[mode];

  const moodData = [
    { day: 'Mon', mood: 7, color: theme.primary },
    { day: 'Tue', mood: 5, color: theme.accent },
    { day: 'Wed', mood: 8, color: theme.secondary },
    { day: 'Thu', mood: 6, color: theme.primary },
    { day: 'Fri', mood: 9, color: theme.accent },
    { day: 'Sat', mood: 7, color: theme.primary },
    { day: 'Sun', mood: 8, color: theme.secondary },
  ];

  const recentInsights = [
    "You've been more reflective in the evenings",
    'Your mood tends to improve after journaling',
    'Mindful moments help you feel more centered',
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: theme.background },
      ]}
    >
      <HomeHeader />
      <HomeQuickActions router={router} />
      <HomeWeeklyMood global={global} moodData={moodData} />
      <HomeRecentReflection global={global} router={router} />
      <HomeAIInsights global={global} recentInsights={recentInsights} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 80,
  },
});
