import { StyleSheet } from 'react-native';

type ThemeMode = 'light' | 'dark';

export const Colors: Record<ThemeMode, Record<string, string>> = {
  light: {
    background: '#F5F1E8',
    foreground: '#3C4142',
    card: 'rgba(255, 255, 255, 0.7)',
    cardForeground: '#3C4142',
    primary: '#A8B5A0',
    primaryForeground: '#F5F1E8',
    secondary: '#E8DDD4',
    secondaryForeground: '#3C4142',
    accent: '#D4A59A',
    border: 'rgba(168, 181, 160, 0.2)',
    input: 'rgba(255, 255, 255, 0.5)',
  },
  dark: {
    background: '#1A1B2E',
    foreground: '#E8DDD4',
    card: 'rgba(45, 55, 72, 0.7)',
    cardForeground: '#E8DDD4',
    primary: '#7B8F73',
    primaryForeground: '#E8DDD4',
    secondary: '#2D3748',
    secondaryForeground: '#E8DDD4',
    accent: '#B8926A',
    border: 'rgba(123, 143, 115, 0.2)',
    input: 'rgba(45, 55, 72, 0.5)',
  },
};

export const GlobalStyles = (mode: ThemeMode = 'light') =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[mode].background,
      padding: 20,
    },
    title: {
      fontSize: 36,
      fontWeight: '500',
      color: Colors[mode].foreground,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '400',
      color: Colors[mode].accent,
      marginTop: 8,
      textAlign: 'center',
    },
    button: {
      backgroundColor: Colors[mode].primary,
      paddingVertical: 14,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginTop: 20,
    },
    buttonText: {
      color: Colors[mode].primaryForeground,
      fontSize: 18,
      fontWeight: '500',
    },
    input: {
      backgroundColor: Colors[mode].input,
      borderColor: Colors[mode].border,
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      width: '90%',
      marginVertical: 10,
      fontSize: 16,
      color: Colors[mode].foreground,
    },
    card: {
      backgroundColor: Colors[mode].card,
      borderRadius: 12,
      padding: 16,
      width: '90%',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      marginVertical: 8,
    },
  });
