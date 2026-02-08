import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MyApplications'>;

const applications: { id: string; name: string; status: string }[] = [];

const MyApplicationsScreen = ({ navigation }: Props) => {
    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Image
                source={require('../assets/illustrations/my_applications.png')}
                style={styles.emptyStateImage}
                resizeMode="contain"
            />
            <Text style={styles.emptyStateTitle}>No applications yet</Text>
            <Text style={styles.emptyStateSubtitle}>
                You haven't applied for any schemes. Browse schemes to get started.
            </Text>
        </View>
    );

    const renderItem = ({ item }: { item: { id: string; name: string; status: string } }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={[styles.statusText, item.status === 'Approved' ? styles.statusApproved : styles.statusPending]}>
                Status: {item.status}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Applications</Text>
            <FlatList
                data={applications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyState}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.l,
    },
    title: {
        fontSize: FONT_SIZE.xxxl,
        fontWeight: '900', // Heavy bold
        color: COLORS.text,
        marginBottom: SPACING.xl,
        marginTop: SPACING.m,
    },
    listContainer: {
        paddingBottom: SPACING.l,
        flexGrow: 1,
    },
    card: {
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: 16,
        marginBottom: SPACING.m,
        ...SHADOWS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    statusText: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
    },
    statusApproved: {
        color: COLORS.success,
    },
    statusPending: {
        color: COLORS.warning,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xxl,
    },
    emptyStateImage: {
        width: 200, // Maximized image
        height: 200,
        marginBottom: SPACING.l,
    },
    emptyStateTitle: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: '800',
        color: COLORS.text,
        marginTop: SPACING.m,
    },
    emptyStateSubtitle: {
        fontSize: FONT_SIZE.l,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: SPACING.m,
        paddingHorizontal: SPACING.l,
        lineHeight: 28,
    },
});

export default MyApplicationsScreen;
