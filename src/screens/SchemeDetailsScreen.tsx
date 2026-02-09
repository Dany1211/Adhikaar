import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    StatusBar
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
        try {
            const data = await fetchSchemeDetails(schemeId);
            setScheme(data);
        } catch (error) {
            console.error('Error fetching scheme details:', error);
            Alert.alert('Error', 'Failed to load scheme details.');
        } finally {
            setLoading(false);
        }
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
                <Text style={styles.errorText}>Scheme not found</Text>
                <TouchableOpacity style={styles.backButtonSimple} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isCentral = scheme.state_type === 'central';

    const renderSectionCard = (title: string, icon: string, content: React.ReactNode) => {
        if (!content) return null;
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.cardTitle}>{title}</Text>
                </View>
                <View style={styles.cardContent}>
                    {content}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <View style={styles.headerBar}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{scheme.name}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header / Title Section */}
                    <View style={styles.titleSection}>
                        <View style={styles.tagsRow}>
                            <View style={[styles.tag, isCentral ? styles.tagCentral : styles.tagState]}>
                                <Text style={[styles.tagText, isCentral ? styles.tagTextCentral : styles.tagTextState]}>
                                    {isCentral ? t('centralGov') : t('stateGov')}
                                </Text>
                            </View>
                            {/* Category Tags */}
                            {scheme.categories.slice(0, 2).map((cat, index) => (
                                <View key={`header-cat-${index}`} style={styles.categoryTag}>
                                    <Text style={styles.categoryTagText} numberOfLines={1}>{cat}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.mainTitle}>{scheme.name}</Text>
                        <Text style={styles.shortDescription}>{scheme.short_description}</Text>
                    </View>

                    {/* Benefits Card */}
                    {renderSectionCard(
                        t('keyBenefits'),
                        'gift-outline',
                        <Text style={styles.bodyText}>{scheme.benefits}</Text>
                    )}

                    {/* Eligibility Card */}
                    {renderSectionCard(
                        t('whoCanApply'),
                        'account-group-outline',
                        <View style={styles.chipContainer}>
                            {scheme.categories.map((cat, index) => (
                                <View key={index} style={styles.chip}>
                                    <Text style={styles.chipText}>{cat}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Documents Card */}
                    {renderSectionCard(
                        t('documentsRequired'),
                        'file-document-multiple-outline',
                        <View style={styles.listContainer}>
                            {[
                                'Aadhar Card',
                                'Residence Proof',
                                'Bank Account Details',
                                'Income Certificate (if applicable)'
                            ].map((item, idx) => (
                                <View key={idx} style={styles.listItem}>
                                    <View style={styles.bulletPoint} />
                                    <Text style={styles.listText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Additional Guidelines Note */}
                    <View style={styles.noteCard}>
                        <MaterialCommunityIcons name="information-outline" size={20} color={COLORS.secondary} style={{ marginRight: 8 }} />
                        <Text style={styles.noteText}>{t('seeGuidelines')}</Text>
                    </View>

                    {/* Bottom Padding for FAB */}
                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Bottom Floating Action Bar */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => Alert.alert(t('comingSoon'), t('eligibilityFeature'))}
                    >
                        <Text style={styles.secondaryButtonText}>{t('checkEligibility')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.primaryButton]}
                        onPress={() => { }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>{t('applyNow')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
        padding: SPACING.xl,
    },
    errorText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    backButtonSimple: {
        padding: SPACING.m,
    },
    backButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    // Header Bar
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
        backgroundColor: COLORS.background,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: FONT_SIZE.m,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: SPACING.s,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    scrollContent: {
        padding: SPACING.l,
    },
    // Title Section
    titleSection: {
        marginBottom: SPACING.xl,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.xs,
        marginBottom: SPACING.m,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagCentral: {
        backgroundColor: '#E0F2FE', // Light Blue
    },
    tagState: {
        backgroundColor: '#FFE4E6', // Light Red
    },
    tagText: {
        fontSize: FONT_SIZE.xs,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    tagTextCentral: {
        color: COLORS.primary,
    },
    tagTextState: {
        color: COLORS.danger,
    },
    categoryTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    categoryTagText: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.s,
        lineHeight: 34,
        letterSpacing: -0.5,
    },
    shortDescription: {
        fontSize: FONT_SIZE.m,
        color: COLORS.secondary,
        lineHeight: 24,
    },
    // Cards
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: SPACING.l,
        marginBottom: SPACING.l,
        ...SHADOWS.light,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.6)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
    },
    cardTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
    },
    cardContent: {
        // Content container
    },
    bodyText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        lineHeight: 26,
    },
    // Chips
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.xs,
    },
    chip: {
        backgroundColor: COLORS.background,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    chipText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.text,
        fontWeight: '500',
    },
    // List
    listContainer: {
        gap: SPACING.s,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        marginRight: SPACING.s,
        marginTop: 2,
    },
    listText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        lineHeight: 24,
    },
    // Note
    noteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: SPACING.m,
        borderRadius: 16,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    noteText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textLight,
        fontStyle: 'italic',
        flex: 1,
    },
    // FAB
    fabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
        paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.m,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        gap: SPACING.m,
        ...SHADOWS.medium,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        backgroundColor: '#F1F5F9',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
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

