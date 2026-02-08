import React, { useEffect, useState, useMemo } from 'react';
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
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryPill from '../components/CategoryPill';
import SchemeCard from '../components/SchemeCard';
import { fetchCategories, fetchSchemes, Category, Scheme } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { t } = useLanguage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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
        // Toggle selection
        setSelectedCategoryId(prev => prev === category.id ? null : category.id);
    };

    const handleSchemePress = (scheme: Scheme) => {
        navigation.navigate('SchemeDetails', { schemeId: scheme.id });
    };

    // Derived state for filtered schemes
    const filteredSchemes = useMemo(() => {
        return schemes.filter(scheme => {
            // 1. Search Filter
            const matchesSearch =
                scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                scheme.short_description.toLowerCase().includes(searchQuery.toLowerCase());

            // 2. Category Filter
            // scheme.categories is an array of category IDs (strings)
            // If selectedCategoryId is null, show all. 
            // Otherwise, check if scheme.categories includes the selected ID.
            const matchesCategory = selectedCategoryId
                ? scheme.categories && scheme.categories.includes(selectedCategoryId)
                : true;

            return matchesSearch && matchesCategory;
        });
    }, [schemes, searchQuery, selectedCategoryId]);

    const renderHeader = () => (
        <View style={styles.headerContainer}>


            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <MaterialCommunityIcons name="magnify" size={24} color={COLORS.secondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('searchPlaceholder')}
                    placeholderTextColor={COLORS.textLight}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.secondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Greeting (Optional, kept smaller) */}
            <View style={styles.greetingSection}>
                <Text style={styles.greetingTitle}>{t('findSchemesTitle')}</Text>
            </View>

            {/* Categories */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('browseCategory')}</Text>
                    {selectedCategoryId && (
                        <TouchableOpacity onPress={() => setSelectedCategoryId(null)}>
                            <Text style={styles.clearFilter}>{t('clear')}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                >
                    {categories.map((category) => (
                        <CategoryPill
                            key={category.id}
                            label={category.label}
                            isActive={selectedCategoryId === category.id}
                            onPress={() => handleCategoryPress(category)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Featured Schemes Header */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    {searchQuery || selectedCategoryId ? t('results') : t('featuredSchemes')}
                    <Text style={styles.resultsCount}> ({filteredSchemes.length})</Text>
                </Text>
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
                data={filteredSchemes}
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
                ListFooterComponent={<View style={{ height: SPACING.xxl }} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{t('noSchemes')}</Text>
                    </View>
                }
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        marginHorizontal: SPACING.l,
        paddingHorizontal: SPACING.m,
        borderRadius: 12, // Softer radius
        height: 50,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.light, // Use subtle shadow
    },
    searchIcon: {
        marginRight: SPACING.s,
    },
    searchInput: {
        flex: 1,
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        height: '100%',
    },
    greetingSection: {
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.l,
    },
    greetingTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
        color: COLORS.text,
        lineHeight: 32,
    },
    section: {
        marginBottom: SPACING.m,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.m,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
    },
    resultsCount: {
        fontSize: FONT_SIZE.m,
        fontWeight: 'normal',
        color: COLORS.textLight,
    },
    clearFilter: {
        fontSize: FONT_SIZE.s,
        color: COLORS.primary,
        fontWeight: '600',
    },
    categoriesList: {
        paddingHorizontal: SPACING.l,
        paddingBottom: SPACING.s,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    emptyText: {
        color: COLORS.textLight,
        fontSize: FONT_SIZE.m,
    },
});

export default HomeScreen;
