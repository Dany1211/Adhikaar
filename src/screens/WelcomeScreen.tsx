import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../constants/translations';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: Props) => {
    const { t, language, setLanguage } = useLanguage();

    const languages: { code: LanguageCode; label: string }[] = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिंदी' },
        { code: 'mr', label: 'मराठी' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.languageContainer}>
                    {languages.map((lang) => (
                        <Pressable
                            key={lang.code}
                            style={[
                                styles.languageButton,
                                language === lang.code && styles.languageButtonActive,
                            ]}
                            onPress={() => setLanguage(lang.code)}
                        >
                            <Text
                                style={[
                                    styles.languageText,
                                    language === lang.code && styles.languageTextActive,
                                ]}
                            >
                                {lang.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Top content */}
            <View style={styles.content}>
                <Text style={styles.title}>Government Schemes{'\n'}Made Easy</Text>
                <Text style={styles.subtitle}>Find benefits tailored for you in seconds.</Text>

                <View style={styles.divider} />

                <Text style={styles.description}>
                    One-stop access to subsidies, scholarships, and pensions. No more paperwork confusion.
                </Text>
            </View>

            {/* CTA */}
            <View style={styles.footer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText}>{t('getStarted')}</Text>
                </Pressable>

                <Text style={styles.footerText}>
                    100% Free & Secure • Government Data
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.l,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: SPACING.xxl,
        alignItems: 'center',
    },
    languageContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: 30,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    languageButton: {
        paddingVertical: 10,
        paddingHorizontal: SPACING.l,
        borderRadius: 26,
    },
    languageButtonActive: {
        backgroundColor: COLORS.primaryLight,
    },
    languageText: {
        color: COLORS.text,
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
    },
    languageTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZE.xxxl, // Hero size
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: SPACING.m,
        lineHeight: 44,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: FONT_SIZE.xl,
        color: COLORS.textLight,
        marginBottom: SPACING.l,
        lineHeight: 32,
    },
    divider: {
        width: 60,
        height: 6,
        backgroundColor: COLORS.primary,
        borderRadius: 3,
        marginBottom: SPACING.l,
    },
    description: {
        fontSize: FONT_SIZE.l,
        color: COLORS.secondary,
        lineHeight: 28,
        maxWidth: 320,
    },
    footer: {
        marginBottom: SPACING.l,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 20, // Taller button
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
        marginBottom: SPACING.m,
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: '#fff',
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
    },
    footerText: {
        textAlign: 'center',
        fontSize: FONT_SIZE.s,
        color: COLORS.textLight,
        fontWeight: '500',
    },
});

export default WelcomeScreen;
