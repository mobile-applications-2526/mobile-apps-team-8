import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";

export function JournalSearch({ searchQuery, setSearchQuery, theme }: any) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: `${theme.border}40` },
      ]}
    >
      <Search size={18} color={theme.accent} style={styles.icon} />
      <TextInput
        placeholder="Search entries, tags, or feelings..."
        placeholderTextColor={`${theme.foreground}50`}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[styles.input, { color: theme.foreground }]}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={() => setSearchQuery("")}
          style={[styles.clearButton, { backgroundColor: `${theme.accent}15` }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={16} color={theme.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: 40,
    paddingVertical: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
