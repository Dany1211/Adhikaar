import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

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
        padding: SPACING.m,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.l,
    },
    listContainer: {
        paddingBottom: SPACING.m,
        flexGrow: 1,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: SPACING.m,
        borderRadius: 8,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.s,
    },
    statusText: {
        fontSize: FONT_SIZE.m,
        fontWeight: 'bold',
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
        marginTop: SPACING.xl,
    },
    emptyStateImage: {
        width: 150,
        height: 150,
        marginBottom: SPACING.m,
    },
    emptyStateTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.s,
    },
    emptyStateSubtitle: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textLight,
        textAlign: 'center',
        marginTop: SPACING.s,
        paddingHorizontal: SPACING.l,
    },
});

export default MyApplicationsScreen;
