import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/styles/global';
import { useRouter } from 'expo-router';

export function ChatHeader({ router, global, insets }: { router: ReturnType<typeof useRouter>, global: any, insets: any }) {
  const mode = useColorScheme() || 'light';
  const theme = Colors[mode];

  return (
    <View style={[global.card, styles.header, { paddingTop: insets.top + 12, borderBottomColor: theme.border }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color={theme.foreground} />
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={[styles.headerTitle, { color: theme.foreground }]}>AI Companion</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={{ color: theme.accent, fontSize: 12 }}>Always here for you</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1 },
  backButton: { marginRight: 12 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'green', marginRight: 4 },
});
