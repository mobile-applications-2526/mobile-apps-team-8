import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Plus, MessageCircle, BookOpen, TrendingUp, Sparkles } from 'lucide-react-native';
import { GlobalStyles, Colors } from '@/styles/global';

export default function HomeScreen() {
  const router = useRouter();
  const mode = useColorScheme() || 'light';
  const global = GlobalStyles(mode);
  const theme = Colors[mode];

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
      ? 'Good afternoon'
      : 'Good evening';

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
      contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 600 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: theme.foreground }]}>{greeting}, Alex</Text>
            <Text style={[styles.subtitle, { color: theme.accent }]}>
              How are you feeling today?
            </Text>
          </View>

          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: ['0deg', '10deg', '-10deg', '0deg'] }}
            transition={{ duration: 2000, loop: true }}
            style={[styles.sparkleContainer, { backgroundColor: theme.primary }]}
          >
            <Sparkles color={theme.primaryForeground} size={22} />
          </MotiView>
        </View>
      </MotiView>

      {/* Quick Actions */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100 }}
        style={styles.quickActions}
      >
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/(tabs)/chat')}
        >
          <MessageCircle color={theme.primaryForeground} size={24} />
          <Text style={[styles.actionText, { color: theme.primaryForeground }]}>
            Chat with AI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.accent }]}
          onPress={() => router.push('/(tabs)/journal')}
        >
          <Plus color={theme.primaryForeground} size={24} />
          <Text style={[styles.actionText, { color: theme.primaryForeground }]}>New Entry</Text>
        </TouchableOpacity>
      </MotiView>

      {/* Weekly Mood */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200 }}
        style={[global.card, styles.card]}
      >
        <View style={styles.cardHeader}>
          <TrendingUp color={theme.primary} size={18} />
          <Text style={[styles.cardTitle, { color: theme.foreground }]}>Your Week</Text>
        </View>

        <View style={styles.moodRow}>
          {moodData.map((item, index) => (
            <MotiView
              key={index}
              from={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 500 + index * 100 }}
              style={[styles.moodDot, { backgroundColor: item.color, borderColor: theme.border }]}
            />
          ))}
        </View>

        <View style={styles.moodLabels}>
          {moodData.map((item, index) => (
            <Text key={index} style={[styles.moodDay, { color: theme.foreground }]}>
              {item.day}
            </Text>
          ))}
        </View>
      </MotiView>

      {/* Recent Reflection */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300 }}
        style={[global.card, styles.card]}
      >
        <View style={styles.cardHeader}>
          <BookOpen color={theme.accent} size={18} />
          <Text style={[styles.cardTitle, { color: theme.foreground }]}>Recent Reflection</Text>
          <Text style={[styles.timeLabel, { color: theme.border }]}>2h ago</Text>
        </View>

        <Text style={[styles.cardText, { color: theme.cardForeground }]}>
          "Today I felt more centered after my morning walk. The quiet moments in nature really help
          me process my thoughts..."
        </Text>

        <TouchableOpacity
          style={[styles.ghostButton, { backgroundColor: theme.secondary }]}
          // onPress={() => router.push('/(tabs)/chat')}
        >
          <Text style={[styles.ghostText, { color: theme.secondaryForeground }]}>
            Read full entry
          </Text>
        </TouchableOpacity>
      </MotiView>

      {/* AI Insights */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 400 }}
        style={[global.card, styles.card]}
      >
        <View style={styles.cardHeader}>
          <Sparkles color={theme.primary} size={18} />
          <Text style={[styles.cardTitle, { color: theme.foreground }]}>Insights for You</Text>
        </View>

        {recentInsights.map((insight, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 600 + i * 100 }}
            style={[styles.insightRow, { backgroundColor: theme.input }]}
          >
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.insightText, { color: theme.cardForeground }]}>{insight}</Text>
          </MotiView>
        ))}
      </MotiView>
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
  header: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  sparkleContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    marginTop: 6,
  },
  card: {
    width: '100%',
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  timeLabel: {
    marginLeft: 'auto',
    fontSize: 12,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  ghostButton: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  ghostText: {
    fontWeight: '500',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  moodDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  moodLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodDay: {
    fontSize: 12,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    marginTop: 5,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
  },
});
