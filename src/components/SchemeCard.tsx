import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';
import { Scheme } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface SchemeCardProps {
    scheme: Scheme;
    onPress: () => void;
    style?: ViewStyle;
}

const SchemeCard: React.FC<SchemeCardProps> = ({
    scheme,
    onPress,
    style
}) => {
    const { t } = useLanguage();
    const isCentral = scheme.state_type === 'central';

    return (
        <TouchableOpacity
            style={[styles.card, style]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.header}>
                <View style={[styles.tag, isCentral ? styles.tagCentral : styles.tagState]}>
                    <Text style={[styles.tagText, isCentral ? styles.tagTextCentral : styles.tagTextState]}>
                        {isCentral ? t('centralGov') : t('stateGov')}
                    </Text>
                </View>
                {/* Optional: Add save/bookmark icon here */}
            </View>

            <Text style={styles.title} numberOfLines={2}>
                {scheme.name}
            </Text>

            <Text style={styles.description} numberOfLines={3}>
                {scheme.short_description}
            </Text>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <Text style={styles.learnMore}>{t('learnMore')}</Text>
                <MaterialCommunityIcons name="arrow-right" size={24} color={COLORS.primary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 24, // Much rounder
        marginBottom: SPACING.l, // More space between cards
        ...SHADOWS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SPACING.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.m,
    },
    tag: {
        paddingHorizontal: SPACING.s,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: COLORS.background,
    },
    tagCentral: {
        backgroundColor: COLORS.primaryLight,
    },
    tagState: {
        backgroundColor: '#FFF0F0', // Very light red
    },
    tagText: {
        fontSize: FONT_SIZE.xs,
        fontWeight: 'bold',
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
        fontSize: FONT_SIZE.xl, // Larger title
        fontWeight: '800', // Bolder
        color: COLORS.text,
        marginBottom: SPACING.s,
        lineHeight: 30,
    },
    description: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textLight,
        lineHeight: 24,
        marginBottom: SPACING.l,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: SPACING.m,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    learnMore: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        color: COLORS.primary,
    },
});

export default SchemeCard;
