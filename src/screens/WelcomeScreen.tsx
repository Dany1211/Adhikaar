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

            {/* Top content */}
            <View style={styles.content}>
                <Text style={styles.title}>{t('welcomeTitle')}</Text>
                <Text style={styles.subtitle}>{t('welcomeSubtitle')}</Text>

                <Text style={styles.description}>
                    {t('welcomeDescription')}
                </Text>
            </View>

            {/* CTA */}
            <Pressable
                style={styles.button}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>{t('getStarted')}</Text>
            </Pressable>

            {/* Footer */}
            <Text style={styles.footerText}>
                {t('footerText')}
            </Text>
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
    languageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.xl, // Added margin top for status bar spacing
    },
    languageButton: {
        paddingVertical: SPACING.s,
        paddingHorizontal: SPACING.m,
        marginHorizontal: SPACING.xs,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
    },
    languageButtonActive: {
        backgroundColor: COLORS.primary,
    },
    languageText: {
        color: COLORS.primary,
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
    },
    languageTextActive: {
        color: COLORS.white,
    },

    content: {
        marginTop: SPACING.m,
    },

    title: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },

    subtitle: {
        fontSize: FONT_SIZE.l,
        color: COLORS.primary,
        marginBottom: SPACING.l,
    },

    description: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textLight,
        lineHeight: 22,
        maxWidth: 320,
    },

    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.m,
        borderRadius: 10,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: FONT_SIZE.l,
        fontWeight: '600',
    },

    footerText: {
        textAlign: 'center',
        fontSize: FONT_SIZE.s,
        color: COLORS.textLight,
        marginBottom: SPACING.m,
    },
});

export default WelcomeScreen;
