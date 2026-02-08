import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';
import { Scheme } from '../services/api';

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
    const isCentral = scheme.state_type === 'central';

    return (
        <TouchableOpacity
            style={[styles.card, style]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.headerRow}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={2}>
                        {scheme.name}
                    </Text>
                </View>
                <View style={[styles.tag, isCentral ? styles.tagCentral : styles.tagState]}>
                    <Text style={[styles.tagText, isCentral ? styles.tagTextCentral : styles.tagTextState]}>
                        {isCentral ? 'Central' : 'State'}
                    </Text>
                </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
                {scheme.short_description}
            </Text>

            <View style={styles.footer}>
                <Text style={styles.benefitLabel}>Tap to view details</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.primary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        marginVertical: SPACING.xs,
        marginHorizontal: SPACING.m,
        padding: SPACING.m,
        ...SHADOWS.light,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.xs,
    },
    titleContainer: {
        flex: 1,
        marginRight: SPACING.s,
    },
    title: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        color: COLORS.text,
        lineHeight: 22,
    },
    tag: {
        paddingHorizontal: SPACING.xs,
        paddingVertical: 2,
        borderRadius: 4,
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
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    tagTextCentral: {
        color: '#1967d2',
    },
    tagTextState: {
        color: '#c5221f',
    },
    description: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textLight,
        lineHeight: 20,
        marginBottom: SPACING.s,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.xxs,
    },
    benefitLabel: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.primary,
        fontWeight: '500',
    },
});

export default SchemeCard;
