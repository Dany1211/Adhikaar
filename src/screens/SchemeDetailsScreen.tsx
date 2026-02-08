import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';
import { fetchSchemeDetails, Scheme } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

type Props = NativeStackScreenProps<RootStackParamList, 'SchemeDetails'>;

const SchemeDetailsScreen = ({ route, navigation }: Props) => {
    const { t } = useLanguage();
    const { schemeId } = route.params;
    const [scheme, setScheme] = useState<Scheme | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDetails();
    }, [schemeId]);

    const loadDetails = async () => {
        setLoading(true);
        const data = await fetchSchemeDetails(schemeId);
        setScheme(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!scheme) {
        return (
            <View style={styles.errorContainer}>
                <Text>Scheme not found</Text>
            </View>
        );
    }

    const isCentral = scheme.state_type === 'central';

    const renderSection = (title: string, icon: string, content: string | undefined) => {
        if (!content) return null;
        return (
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name={icon} size={22} color={COLORS.primary} />
                    </View>
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                <Text style={styles.sectionContent}>{content}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Header Controls */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
                    </TouchableOpacity>

                    {/* Title Block */}
                    <View style={styles.titleBlock}>
                        <View style={styles.tagContainer}>
                            <View style={[styles.tag, isCentral ? styles.tagCentral : styles.tagState]}>
                                <Text style={[styles.tagText, isCentral ? styles.tagTextCentral : styles.tagTextState]}>
                                    {isCentral ? t('centralGov') : t('stateGov')}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.title}>{scheme.name}</Text>
                        <Text style={styles.shortDescription}>{scheme.short_description}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Content Sections */}
                    {renderSection(t('keyBenefits'), 'gift-outline', scheme.benefits)}

                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="account-group-outline" size={22} color={COLORS.primary} />
                            </View>
                            <Text style={styles.sectionTitle}>{t('whoCanApply')}</Text>
                        </View>
                        <View style={styles.chipContainer}>
                            {scheme.categories.map((cat, index) => (
                                <View key={index} style={styles.categoryChip}>
                                    <Text style={styles.categoryText}>{cat}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="file-document-multiple-outline" size={22} color={COLORS.primary} />
                            </View>
                            <Text style={styles.sectionTitle}>{t('documentsRequired')}</Text>
                        </View>
                        <View style={styles.bulletList}>
                            <Text style={styles.bulletItem}>• Aadhar Card</Text>
                            <Text style={styles.bulletItem}>• Residence Proof</Text>
                            <Text style={styles.bulletItem}>• Bank Account Details</Text>
                            <Text style={styles.bulletItem}>• Income Certificate (if applicable)</Text>
                        </View>
                    </View>

                    <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>{t('seeGuidelines')}</Text>
                    </View>

                    {/* Space for FAB */}
                    <View style={{ height: 100 }} />

                </ScrollView>
            </SafeAreaView>

            {/* Bottom Floating Action Bar */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => Alert.alert(t('comingSoon'), t('eligibilityFeature'))}
                >
                    <Text style={styles.secondaryButtonText}>{t('checkEligibility')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => { }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>{t('applyNow')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.m,
    },
    backButton: {
        marginBottom: SPACING.l,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    titleBlock: {
        marginBottom: SPACING.xl, // Increased spacing
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.m,
    },
    tag: {
        paddingHorizontal: 12, // More padding
        paddingVertical: 6,
        borderRadius: 12, // softer
        backgroundColor: COLORS.surface,
    },
    tagCentral: {
        backgroundColor: '#E0F2FE', // Light Blue
    },
    tagState: {
        backgroundColor: '#FFE4E6', // Light Red
    },
    tagText: {
        fontSize: FONT_SIZE.s, // Slightly larger
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    tagTextCentral: {
        color: COLORS.primary,
    },
    tagTextState: {
        color: COLORS.danger,
    },
    title: {
        fontSize: 30, // Larger title
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.s,
        lineHeight: 38,
        letterSpacing: -0.5,
    },
    shortDescription: {
        fontSize: FONT_SIZE.m,
        color: COLORS.secondary,
        lineHeight: 26, // Better readability
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: SPACING.xl,
    },
    // Documentation Sections
    sectionContainer: {
        marginBottom: SPACING.xxl, // More separation between sections
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 87, 255, 0.08)', // Very light primary
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
    },
    sectionContent: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text, // Darker text for readability
        lineHeight: 28,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.s,
    },
    categoryChip: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.l,
        paddingVertical: 10,
        borderRadius: 24, // Pill shape
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    categoryText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        fontWeight: '600',
    },
    bulletList: {
        marginTop: SPACING.xs,
    },
    bulletItem: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        marginBottom: SPACING.s,
        lineHeight: 26,
    },
    noteContainer: {
        backgroundColor: '#F8FAFC',
        padding: SPACING.m,
        borderRadius: 12,
        marginBottom: SPACING.xl,
    },
    noteText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textLight,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    // FAB
    fabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: SPACING.l,
        paddingBottom: SPACING.xl, // Safe area boost
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        flexDirection: 'row',
        gap: SPACING.m,
        // Strong shadow for floating feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        backgroundColor: '#F1F5F9', // Light gray
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    secondaryButtonText: {
        color: COLORS.text,
        fontWeight: '700',
        fontSize: FONT_SIZE.m,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: FONT_SIZE.m,
    },
});

export default SchemeDetailsScreen;
