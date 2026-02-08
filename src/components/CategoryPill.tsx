import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
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
    if (l.includes('senior') || l.includes('elder')) return 'human-cane';
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
                size={24} // Larger icon
                color={isActive ? COLORS.white : COLORS.primary}
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
        paddingHorizontal: SPACING.l, // More padding
        paddingVertical: 14, // Taller touch target
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        marginRight: SPACING.m,
        // Removed border for cleaner look
        // Optional shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    activeContainer: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    icon: {
        marginRight: SPACING.s,
    },
    text: {
        fontSize: FONT_SIZE.m, // Larger text
        color: COLORS.text,
        fontWeight: '600',
    },
    activeText: {
        color: COLORS.white,
        fontWeight: '700',
    },
});

export default CategoryPill;
