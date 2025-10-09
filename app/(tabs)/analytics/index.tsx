import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ArrowLeft, TrendingUp, Calendar, Target, Award, Zap } from 'lucide-react-native';
import { GlobalStyles, Colors } from '@/styles/global';
import { useRouter } from 'expo-router';

interface AnalyticsScreenProps {}

const moodJourney = [
  { week: 'Week 1', avg: 6.2, color: '#FFB3BA' },
  { week: 'Week 2', avg: 7.1, color: '#A8E6CF' },
  { week: 'Week 3', avg: 6.8, color: '#FFE66D' },
  { week: 'Week 4', avg: 8.1, color: '#B3D9FF' },
  { week: 'This week', avg: 7.9, color: '#FFDFBA' },
];

const insights = [
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

const streaks = [
  { label: 'Current streak', value: '12 days', icon: Target, color: '#A8B5A0' },
  { label: 'Longest streak', value: '28 days', icon: Award, color: '#D4A59A' },
  { label: 'Total entries', value: '156', icon: Zap, color: '#A8B5A0' },
];

export default function AnalyticsScreen({}: AnalyticsScreenProps) {
  const insets = useSafeAreaInsets();
  const mode = 'light';
  const theme = Colors[mode];
  const global = GlobalStyles(mode);
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.6 }}
        style={[global.card, { flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 12, paddingHorizontal: 16, borderBottomWidth: 1 }]}
      >
        <Text onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ArrowLeft size={24} color={theme.foreground} />
        </Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.foreground, fontSize: 18, fontWeight: '600' }}>Insights</Text>
          <Text style={{ color: theme.accent, fontSize: 12 }}>Your emotional journey</Text>
        </View>
        <TrendingUp size={24} color={theme.primary} />
      </MotiView>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Mood Journey */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 0.6 }}>
          <View style={[global.card, styles.card]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Calendar size={18} color={theme.primary} />
              <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '600', color: theme.foreground }}>Emotional Landscape</Text>
            </View>
            <View style={{ height: 150, borderRadius: 12, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: theme.foreground, fontSize: 12 }}>Mood graph placeholder</Text>
            </View>
          </View>
        </MotiView>

        {/* Streaks */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          {streaks.map((streak, i) => {
            const Icon = streak.icon;
            return (
              <MotiView key={i} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 0.2 }}>
                <View style={[global.card, styles.card, { width: 100, alignItems: 'center' }]}>
                  <Icon size={20} color={streak.color} />
                  <Text style={{ color: theme.foreground, fontSize: 14, fontWeight: '600', marginTop: 4 }}>{streak.value}</Text>
                  <Text style={{ color: theme.accent, fontSize: 10 }}>{streak.label}</Text>
                </View>
              </MotiView>
            );
          })}
        </View>

        {/* Insights */}
        <View style={{ marginTop: 24 }}>
          {insights.map((insight, i) => (
            <MotiView key={i} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: i * 0.2 }}>
              <View style={[global.card, styles.card, { marginBottom: 12 }]}>
                <Text style={{ fontSize: 16, marginBottom: 4 }}>{insight.icon} {insight.title}</Text>
                <Text style={{ fontSize: 12, color: theme.accent }}>{insight.description}</Text>
                <View style={{ marginTop: 4, backgroundColor: insight.strength === 'high' ? theme.primary : theme.secondary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                  <Text style={{ fontSize: 10, color: theme.foreground }}>{insight.strength} confidence</Text>
                </View>
              </View>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
});
