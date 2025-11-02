import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, BookOpen } from 'lucide-react-native';

export function JournalHeader({ router, global, insets }: any) {
  const theme = global;
  return (
    <View style={[global.card, { flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 12, paddingHorizontal: 16, borderBottomWidth: 1, width: '100%' }]}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
        <ArrowLeft size={24} color={theme.foreground} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.foreground }}>Journal</Text>
        <Text style={{ color: theme.accent, fontSize: 12 }}>Your thoughts and reflections</Text>
      </View>
      <TouchableOpacity style={{ padding: 8 }}>
        <BookOpen size={24} color={theme.primaryForeground} />
      </TouchableOpacity>
    </View>
  );
}
