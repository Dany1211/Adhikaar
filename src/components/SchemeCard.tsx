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
            activeOpacity={0.7}
        >
            {/* Icon Container */}
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={isCentral ? "bank-outline" : "city-variant-outline"}
                    size={28}
                    color={COLORS.primary}
                />
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.govTag}>
                        {isCentral ? t('centralGov') : t('stateGov')}
                    </Text>
                </View>

                <Text style={styles.title} numberOfLines={2}>
                    {scheme.name}
                </Text>

                <Text style={styles.description} numberOfLines={1}>
                    {scheme.short_description}
                </Text>
            </View>

            {/* Action Icon */}
            <View style={styles.actionContainer}>
                <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.secondary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        marginBottom: SPACING.m,
        padding: SPACING.m,
        ...SHADOWS.light,
        marginHorizontal: SPACING.l,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    govTag: {
        fontSize: FONT_SIZE.xs,
        fontWeight: '700',
        color: COLORS.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 2,
        lineHeight: 20,
    },
    description: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textLight,
    },
    actionContainer: {
        marginLeft: SPACING.s,
    },
});

export default SchemeCard;
