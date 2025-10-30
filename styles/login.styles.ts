import {StyleSheet} from 'react-native';

type ThemeMode = 'light' | 'dark';

const Colors: Record<ThemeMode, Record<string, string>> = {
    light: {
        background: '#F5F1E8',
        foreground: '#3C4142',
        card: 'rgba(255, 255, 255, 0.7)',
        primary: '#A8B5A0',
        primaryForeground: '#F5F1E8',
        border: 'rgba(168, 181, 160, 0.2)',
    },
    dark: {
        background: '#1A1B2E',
        foreground: '#E8DDD4',
        card: 'rgba(45, 55, 72, 0.7)',
        primary: '#7B8F73',
        primaryForeground: '#E8DDD4',
        border: 'rgba(123, 143, 115, 0.2)',
    },
};

export const createLoginStyles = (mode: ThemeMode = 'light') =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors[mode].background,
        },
        content: {
            flex: 1,
            justifyContent: 'center',
            padding: 24,
            maxWidth: 440,
            width: '100%',
            alignSelf: 'center',
        },
        header: {
            marginBottom: 40,
            alignItems: 'center',
        },
        title: {
            fontSize: 32,
            fontWeight: '600',
            color: Colors[mode].foreground,
            marginBottom: 8,
            letterSpacing: -0.5,
        },
        subtitle: {
            fontSize: 16,
            color: Colors[mode].foreground,
            opacity: 0.6,
        },
        form: {
            width: '100%',
        },
        inputContainer: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '500',
            color: Colors[mode].foreground,
            marginBottom: 8,
            marginLeft: 4,
        },
        input: {
            backgroundColor: Colors[mode].card,
            borderWidth: 1,
            borderColor: Colors[mode].border,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: Colors[mode].foreground,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 0,
        },
        forgotPassword: {
            alignSelf: 'flex-end',
            marginBottom: 24,
            marginTop: -8,
        },
        forgotPasswordText: {
            fontSize: 14,
            color: Colors[mode].primary,
            fontWeight: '500',
        },
        button: {
            backgroundColor: Colors[mode].primary,
            padding: 18,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: Colors[mode].primary,
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        buttonDisabled: {
            opacity: 0.7,
        },
        buttonText: {
            color: Colors[mode].primaryForeground,
            fontSize: 17,
            fontWeight: '600',
            letterSpacing: 0.3,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 32,
        },
        footerText: {
            fontSize: 15,
            color: Colors[mode].foreground,
            opacity: 0.7,
        },
        signUpText: {
            fontSize: 15,
            color: Colors[mode].primary,
            fontWeight: '600',
        },
    });