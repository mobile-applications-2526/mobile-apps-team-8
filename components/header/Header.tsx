import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Colors } from "@/styles/global";
import { useRouter } from "expo-router";
import { EdgeInsets } from "react-native-safe-area-context";
import { LucideIcon } from "lucide-react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  showBackButton?: boolean;
  onBackPress?: () => void;
  global: any;
  insets: EdgeInsets;
}

function Header({
  title,
  subtitle,
  icon: Icon,
  showBackButton = true,
  onBackPress,
  global,
  insets,
}: HeaderProps) {
  const mode = useColorScheme() || "light";
  const theme = Colors[mode];
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.card, // ✅ Gebruik direct theme.card
          paddingTop: insets.top + 12,
          borderBottomColor: theme.border,
        },
      ]}
    >
      {showBackButton && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.foreground} />
        </TouchableOpacity>
      )}

      <View style={styles.headerTextContainer}>
        <Text style={[styles.headerTitle, { color: theme.foreground }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.accent }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {Icon && (
        <View style={styles.iconContainer}>
          <Icon size={24} color={theme.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    width: "100%",
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  iconContainer: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
