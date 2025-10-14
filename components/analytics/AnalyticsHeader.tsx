import React from 'react';
import { View, Text, useColorScheme, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { ArrowLeft, TrendingUp } from 'lucide-react-native';
import { Colors } from '@/styles/global';
import { useRouter } from 'expo-router';

export function AnalyticsHeader({
  router,
  global,
}: {
  router: ReturnType<typeof useRouter>;
  global: any;
}) {
  const insets = useSafeAreaInsets();
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.6 }}
      style={[
        global.card,
        styles.headerCard,
        { paddingTop: insets.top + 12, borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
        <ArrowLeft size={24} color={theme.foreground} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.foreground }]}>Insights</Text>
        <Text style={[styles.subtitle, { color: theme.accent }]}>Your emotional journey</Text>
      </View>
      <TrendingUp size={24} color={theme.primary} />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: { fontSize: 18, fontWeight: '600' },
  subtitle: { fontSize: 12 },
});
