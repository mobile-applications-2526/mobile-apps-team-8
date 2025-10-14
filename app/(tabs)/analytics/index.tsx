import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GlobalStyles, Colors } from '@/styles/global';
import { useColorScheme } from 'react-native';

import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { MoodJourney } from '@/components/analytics/MoodJourney';
import { StreakCards } from '@/components/analytics/StreakCards';
import { InsightList } from '@/components/analytics/InsightList';

export default function AnalyticsScreen() {
  const router = useRouter();
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];
  const global = GlobalStyles(mode);

  const moodJourney = [
    { week: 'Week 1', avg: 6.2, color: '#FFB3BA' },
    { week: 'Week 2', avg: 7.1, color: '#A8E6CF' },
    { week: 'Week 3', avg: 6.8, color: '#FFE66D' },
    { week: 'Week 4', avg: 8.1, color: '#B3D9FF' },
    { week: 'This week', avg: 7.9, color: '#FFDFBA' },
  ];

  type Insight = {
  title: string;
  description: string;
  icon: string;
  strength: 'medium' | 'high';
};

  const insights: Insight[] = [
    {
      title: 'Evening Reflections',
      description: 'You tend to feel most centered when journaling in the evening',
      icon: '🌙',
      strength: 'high', 
    },
    {
      title: 'Nature Connection',
      description: 'Outdoor activities consistently improve your mood by 2.3 points',
      icon: '🌿',
      strength: 'high',
    },
    {
      title: 'Social Energy',
      description: 'Conversations with friends correlate with higher happiness scores',
      icon: '👥',
      strength: 'medium',
    },
    {
      title: 'Mindful Mornings',
      description: 'Morning meditation shows positive impact on your daily outlook',
      icon: '🧘‍♀️',
      strength: 'medium',
    },
  ];

  type Streak = {
    label: string;
    value: string;
    color: string;
    icon: 'target' | 'award' | 'zap';
  };

  const streaks: Streak[] = [
    { label: 'Current streak', value: '12 days', color: '#A8B5A0', icon: 'target' },
    { label: 'Longest streak', value: '28 days', color: '#D4A59A', icon: 'award' },
    { label: 'Total entries', value: '156', color: '#A8B5A0', icon: 'zap' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <AnalyticsHeader router={router} global={global} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MoodJourney global={global} />
        <StreakCards streaks={streaks} global={global} />
        <InsightList insights={insights} global={global} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});
