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

type Props = NativeStackScreenProps<RootStackParamList, 'SchemeDetails'>;

const SchemeDetailsScreen = ({ route, navigation }: Props) => {
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
            <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name={icon} size={24} color={COLORS.primary} />
                    </View>
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                <Text style={styles.sectionContent}>{content}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Navbar/Back */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.text} />
                </TouchableOpacity>

                {/* Header Card */}
                <View style={styles.titleBlock}>
                    <View style={styles.tagContainer}>
                        <View style={[styles.tag, isCentral ? styles.tagCentral : styles.tagState]}>
                            <Text style={[styles.tagText, isCentral ? styles.tagTextCentral : styles.tagTextState]}>
                                {isCentral ? 'Central Government' : 'State Government'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.title}>{scheme.name}</Text>
                    <Text style={styles.shortDescription}>{scheme.short_description}</Text>
                </View>

                {/* Content Cards */}
                {renderSection('Key Benefits', 'gift-outline', scheme.benefits)}

                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="account-group-outline" size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.sectionTitle}>Who Can Apply</Text>
                    </View>
                    <View style={styles.chipContainer}>
                        {scheme.categories.map((cat, index) => (
                            <View key={index} style={styles.categoryChip}>
                                <Text style={styles.categoryText}>{cat}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionContent}>
                        See official guidelines for detailed eligibility criteria.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="file-document-multiple-outline" size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.sectionTitle}>Documents Required</Text>
                    </View>
                    <View style={styles.bulletList}>
                        <Text style={styles.bulletItem}>• Aadhar Card</Text>
                        <Text style={styles.bulletItem}>• Residence Proof</Text>
                        <Text style={styles.bulletItem}>• Bank Account Details</Text>
                        <Text style={styles.bulletItem}>• Income Certificate (if applicable)</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Floating Action Bar */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => Alert.alert('Coming Soon', 'Eligibility check feature is under development.')}
                >
                    <Text style={styles.secondaryButtonText}>Check Eligibility</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => { }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Apply Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        padding: SPACING.l,
        paddingBottom: 120, // space for footer
    },
    backButton: {
        marginBottom: SPACING.m,
        padding: SPACING.xs,
    },
    titleBlock: {
        marginBottom: SPACING.xl,
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.s,
    },
    tag: {
        paddingHorizontal: SPACING.s,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tagCentral: {
        backgroundColor: '#e8f0fe',
        borderColor: '#d2e3fc',
    },
    tagState: {
        backgroundColor: '#fce8e6',
        borderColor: '#fad2cf',
    },
    tagText: {
        fontSize: FONT_SIZE.s,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    tagTextCentral: {
        color: '#1967d2',
    },
    tagTextState: {
        color: '#c5221f',
    },
    title: {
        fontSize: FONT_SIZE.xxxl, // Maximum size
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.m,
        lineHeight: 44,
    },
    shortDescription: {
        fontSize: FONT_SIZE.l,
        color: COLORS.textLight,
        lineHeight: 28,
    },
    sectionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: SPACING.l,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.card,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
    },
    iconContainer: {
        backgroundColor: '#e8f0fe',
        padding: 10,
        borderRadius: 12,
        marginRight: SPACING.m,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        color: COLORS.text,
    },
    sectionContent: {
        fontSize: FONT_SIZE.l,
        color: COLORS.text,
        lineHeight: 28,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: SPACING.m,
    },
    categoryChip: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.m,
        paddingVertical: 8,
        borderRadius: 12,
        marginRight: SPACING.s,
        marginBottom: SPACING.s,
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
        fontSize: FONT_SIZE.l,
        color: COLORS.text,
        marginBottom: SPACING.s,
        lineHeight: 28,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        paddingBottom: SPACING.xl,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        gap: SPACING.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    button: {
        flex: 1,
        paddingVertical: SPACING.m,
        borderRadius: 16, // Rounder buttons
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 2,
        borderColor: COLORS.primary,
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
        color: COLORS.primary,
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
