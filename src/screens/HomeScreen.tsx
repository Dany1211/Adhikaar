import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryPill from '../components/CategoryPill';
import SchemeCard from '../components/SchemeCard';
import { fetchCategories, fetchSchemes, Category, Scheme } from '../services/api';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [categoriesData, schemesData] = await Promise.all([
                fetchCategories(),
                fetchSchemes(),
            ]);
            setCategories(categoriesData);
            setSchemes(schemesData);
        } catch (error) {
            console.error('Failed to load home screen data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (category: Category) => {
        // In a real app, this would filter or navigate
        console.log('Category pressed:', category.label);
    };

    const handleSchemePress = (scheme: Scheme) => {
        navigation.navigate('SchemeDetails', { schemeId: scheme.id });
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Greeting */}
            <View style={styles.greetingSection}>
                <Text style={styles.greetingTitle}>Find schemes you're eligible for</Text>
                <Text style={styles.greetingSubtitle}>Explore government benefits tailored to you</Text>
            </View>

            {/* Primary Actions Grid */}
            <View style={styles.actionGrid}>
                <TouchableOpacity
                    style={[styles.actionCard, styles.primaryActionCard]}
                    onPress={() => Alert.alert('Coming Soon', 'Eligibility check feature is under development.')}
                    activeOpacity={0.8}
                >
                    <View style={styles.iconContainerPrimary}>
                        <Image
                            source={require('../assets/illustrations/eligibility.png')}
                            style={styles.actionIconImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.primaryActionText}>Check Eligibility</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, styles.secondaryActionCard]}
                    onPress={() => navigation.navigate('MyApplications')}
                    activeOpacity={0.8}
                >
                    <View style={styles.iconContainerSecondary}>
                        <Image
                            source={require('../assets/illustrations/my_applications.png')}
                            style={styles.actionIconImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.secondaryActionText}>My Applications</Text>
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Browse by Category</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                >
                    {categories.map((category) => (
                        <CategoryPill
                            key={category.id}
                            label={category.label}
                            onPress={() => handleCategoryPress(category)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Featured Schemes Header */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Schemes</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <FlatList
                data={schemes}
                renderItem={({ item }) => (
                    <SchemeCard
                        scheme={item}
                        onPress={() => handleSchemePress(item)}
                    />
                )}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                // Add footer padding to ensure content is reachable
                ListFooterComponent={<View style={{ height: SPACING.xl }} />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: SPACING.l,
    },
    headerContainer: {
        paddingBottom: SPACING.s,
    },
    greetingSection: {
        paddingHorizontal: SPACING.m,
        paddingTop: SPACING.m,
        marginBottom: SPACING.l,
    },
    greetingTitle: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.xxs,
    },
    greetingSubtitle: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textLight,
    },
    actionGrid: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.m,
        gap: SPACING.m,
        marginBottom: SPACING.l,
    },
    actionCard: {
        flex: 1,
        padding: SPACING.m,
        borderRadius: 12,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        minHeight: 100,
        // Shadows
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryActionCard: {
        backgroundColor: COLORS.primary,
    },
    secondaryActionCard: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconContainerPrimary: {
        marginBottom: SPACING.s,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 8,
    },
    iconContainerSecondary: {
        marginBottom: SPACING.s,
        backgroundColor: COLORS.background,
        padding: 8,
        borderRadius: 8,
    },
    actionIconImage: {
        width: 32,
        height: 32,
    },
    primaryActionText: {
        color: COLORS.surface,
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
    },
    secondaryActionText: {
        color: COLORS.primary,
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
    },
    section: {
        marginBottom: SPACING.s,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
        marginLeft: SPACING.m,
        marginBottom: SPACING.s,
    },
    categoriesList: {
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.s,
    },
});

export default HomeScreen;
