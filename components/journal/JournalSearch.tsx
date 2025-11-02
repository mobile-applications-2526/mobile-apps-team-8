import React from 'react';
import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

export function JournalSearch({ searchQuery, setSearchQuery, theme }: any) {
  return (
    <View style={{ margin: 16, borderRadius: 24, borderWidth: 1, paddingHorizontal: 40, paddingVertical: 8, backgroundColor: theme.card }}>
      <Search size={16} color={theme.border} style={{ position: 'absolute', left: 12, top: 12 }} />
      <TextInput
        placeholder="Search entries, tags, or feelings..."
        placeholderTextColor="#000000ff"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ height: 36, borderRadius: 24, paddingLeft: 28, color: theme.foreground }}
      />
    </View>
  );
}
