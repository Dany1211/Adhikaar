import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LanguageSelection'>;

const LanguageSelectionScreen = ({ navigation }: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Language</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="English"
                    onPress={() => navigation.navigate('Home')}
                    color={COLORS.primary}
                />
                <View style={styles.spacer} />
                <Button
                    title="हिंदी"
                    onPress={() => navigation.navigate('Home')}
                    color={COLORS.primary}
                />
                <View style={styles.spacer} />
                <Button
                    title="मराठी"
                    onPress={() => navigation.navigate('Home')}
                    color={COLORS.primary}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: SPACING.l,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xxl,
    },
    buttonContainer: {
        width: '100%',
    },
    spacer: {
        height: SPACING.m,
    },
});

export default LanguageSelectionScreen;
