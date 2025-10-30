import { ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { Colors } from './global';

type Theme = 'light' | 'dark';

export const createProfileStyles = (themeMode: Theme) => {
  const theme = Colors[themeMode];

  const styles = StyleSheet.create({
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    } as ViewStyle,

    avatarText: {
      color: theme.primaryForeground,
      fontSize: 36,
      fontWeight: '600',
    } as TextStyle,

    username: {
      fontSize: 24,
      fontWeight: '600',
      marginBottom: 24,
      color: theme.foreground,
    } as TextStyle,

    button: {
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    } as ViewStyle,

    buttonText: {
      color: theme.primaryForeground,
      fontWeight: '600',
      fontSize: 16,
      textAlign: 'center',
    } as TextStyle,
  });

  return {
    ...styles,
    buttonColor: (danger = false) => ({
      backgroundColor: danger ? theme.accent : theme.primary,
    } as ViewStyle),
  };
};
