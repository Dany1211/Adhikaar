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
            <MaterialCommunityIcons name="robot" size={32} color={COLORS.white} />
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
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
        elevation: 10,
        zIndex: 9999, // Ensure it's on top
    },
});

export default FloatingChatButton;
