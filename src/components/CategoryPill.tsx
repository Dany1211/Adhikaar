import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface CategoryPillProps {
    label: string;
    isActive?: boolean;
    onPress: () => void;
    style?: ViewStyle;
}

const getIconName = (label: string): string => {
    const l = label.toLowerCase();
    if (l.includes('farm')) return 'tractor';
    if (l.includes('student')) return 'school';
    if (l.includes('women') || l.includes('female')) return 'human-female';
    if (l.includes('senior') || l.includes('elder')) return 'human-cane'; // or 'cane' if available, otherwise 'human-male-height-variant'
    if (l.includes('work') || l.includes('labour')) return 'hard-hat';
    if (l.includes('business') || l.includes('entrepreneur')) return 'briefcase';
    if (l.includes('health')) return 'hospital-box';
    if (l.includes('housing')) return 'home';
    return 'shape'; // default
};

const CategoryPill: React.FC<CategoryPillProps> = ({
    label,
    isActive = false,
    onPress,
    style
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                isActive && styles.activeContainer,
                style
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <MaterialCommunityIcons
                name={getIconName(label)}
                size={18}
                color={isActive ? COLORS.primary : COLORS.secondary}
                style={styles.icon}
            />
            <Text style={[styles.text, isActive && styles.activeText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.s, // reduced padding for chip look
        paddingVertical: SPACING.xs,
        borderRadius: 8, // slightly squarer, Material chip style
        backgroundColor: COLORS.background, // lighter, integrated background
        marginRight: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeContainer: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primaryLight,
    },
    icon: {
        marginRight: SPACING.xs,
    },
    text: {
        fontSize: FONT_SIZE.s,
        color: COLORS.text,
        fontWeight: '500',
    },
    activeText: {
        color: COLORS.primary, // Using primary color text on light background
        fontWeight: '600',
    },
});

export default CategoryPill;
