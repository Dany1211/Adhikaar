import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Alert,
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
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                <Text style={styles.sectionContent}>{content}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header Card */}
                <View style={styles.headerCard}>
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

                {/* Structured Sections */}
                {renderSection('Key Benefits', 'gift-outline', scheme.benefits)}

                {/* Placeholder logic for 'Who Can Apply' based on categories if rule description missing */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="account-group-outline" size={20} color={COLORS.primary} style={styles.sectionIcon} />
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

                {/* Documents - Static for now as per schema limitations */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color={COLORS.primary} style={styles.sectionIcon} />
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

            {/* Bottom Actions */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => Alert.alert('Coming Soon', 'Eligibility check feature is under development.')}
                >
                    <Text style={styles.secondaryButtonText}>Check Eligibility</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.primaryButton, styles.disabledButton]}
                    disabled={true}
                    onPress={() => { }}
                >
                    <Text style={styles.primaryButtonText}>Apply Online</Text>
                    <Text style={styles.disabledLabel}>(Coming Soon)</Text>
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
        padding: SPACING.m,
        paddingBottom: 100, // space for footer
    },
    headerCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        ...SHADOWS.light,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.s,
    },
    tag: {
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: 16, // Pill shape
        borderWidth: 1,
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
        fontSize: FONT_SIZE.xs,
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
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    shortDescription: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textLight,
        lineHeight: 24,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    sectionIcon: {
        marginRight: SPACING.s,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
    },
    sectionContent: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        lineHeight: 24,
        marginLeft: SPACING.xl + SPACING.xs, // Indent to align with text start, skipping icon
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: SPACING.xl + SPACING.xs,
        marginBottom: SPACING.s,
    },
    categoryChip: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: SPACING.s,
        marginBottom: SPACING.s,
    },
    categoryText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.text,
        fontWeight: '500',
    },
    bulletList: {
        marginLeft: SPACING.xl + SPACING.xs,
    },
    bulletItem: {
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        gap: SPACING.m,
    },
    button: {
        flex: 1,
        paddingVertical: SPACING.m,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    disabledButton: {
        backgroundColor: COLORS.secondary,
        opacity: 0.7,
    },
    secondaryButtonText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: FONT_SIZE.m,
    },
    primaryButtonText: {
        color: COLORS.surface,
        fontWeight: '700',
        fontSize: FONT_SIZE.m,
    },
    disabledLabel: {
        color: COLORS.surface,
        fontSize: 10,
        marginTop: 2,
    },
});

export default SchemeDetailsScreen;
