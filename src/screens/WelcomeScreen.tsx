import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../constants/translations';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: Props) => {
    const { t, language, setLanguage } = useLanguage();

    const languages: { code: LanguageCode; label: string; subLabel: string }[] = [
        { code: 'en', label: 'English', subLabel: 'Default' },
        { code: 'hi', label: 'हिंदी', subLabel: 'Hindi' },
        { code: 'mr', label: 'मराठी', subLabel: 'Marathi' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.contentContainer}>
                {/* Header / Logo Section */}
                <View style={styles.headerSection}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/applogo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Adhikaar</Text>
                    <Text style={styles.subtitle}>{t('subtitle') || 'Empowering Citizens'}</Text>
                </View>

                {/* Language Selection */}
                <View style={styles.languageSection}>
                    <Text style={styles.sectionTitle}>Select Language / भाषा चुनें</Text>
                    <View style={styles.languageGrid}>
                        {languages.map((lang) => (
                            <Pressable
                                key={lang.code}
                                style={[
                                    styles.langCard,
                                    language === lang.code && styles.langCardActive
                                ]}
                                onPress={() => setLanguage(lang.code)}
                            >
                                <Text style={[
                                    styles.langLabel,
                                    language === lang.code && styles.langLabelActive
                                ]}>
                                    {lang.label}
                                </Text>
                                <Text style={[
                                    styles.langSubLabel,
                                    language === lang.code && styles.langLabelActive
                                ]}>
                                    {lang.subLabel}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </View>

            {/* Footer CTA */}
            <View style={styles.footer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText}>{t('getStarted')}</Text>
                    <MaterialCommunityIcons name="arrow-right" size={24} color={COLORS.white} />
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        flex: 1,
        padding: SPACING.l,
        justifyContent: 'center',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 24,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.l,
        ...SHADOWS.light,
    },
    logo: {
        width: 60,
        height: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: SPACING.xs,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: FONT_SIZE.l,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    languageSection: {
        width: '100%',
    },
    sectionTitle: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textLight,
        fontWeight: '600',
        marginBottom: SPACING.m,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    languageGrid: {
        gap: SPACING.m,
    },
    langCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        padding: SPACING.l,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
        ...SHADOWS.light,
    },
    langCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#F0F9FF', // Very light blue
    },
    langLabel: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
    },
    langSubLabel: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    langLabelActive: {
        color: COLORS.primary,
    },
    checkIcon: {
        position: 'absolute',
        right: SPACING.l,
    },
    footer: {
        padding: SPACING.l,
        paddingBottom: SPACING.xl,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.s,
        ...SHADOWS.medium,
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
    },
});

export default WelcomeScreen;
