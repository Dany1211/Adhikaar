import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS, SHADOWS, SPACING } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';

type FloatingChatButtonProps = {
    visible: boolean;
    onPress: () => void;
};

const FloatingChatButton = ({ visible, onPress }: FloatingChatButtonProps) => {
    if (!visible) return null;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* "message-text" as requested by user */}
            <MaterialCommunityIcons name="message-text" size={32} color={COLORS.vibrant.primary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: SPACING.xl,
        right: SPACING.l,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.vibrant.background, // Chat page main background (light)
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
        shadowColor: COLORS.vibrant.primary, // Colored shadow for visibility
        shadowOpacity: 0.3,
        elevation: 10,
        zIndex: 9999, // Ensure it's on top
        borderWidth: 1,
        borderColor: COLORS.vibrant.primary + '20', // Subtle border for contrast
    },
});

export default FloatingChatButton;
