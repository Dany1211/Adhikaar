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
            {/* Top Bar: Avatar & Greeting */}
            <View style={styles.topBar}>
                <View style={styles.userInfo}>
                    <Image
                        source={require('../assets/applogo.png')}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                    <View>
                        <Text style={styles.greetingText}>Good Morning 👋</Text>
                        <Text style={styles.userName}>Citizen</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationBtn}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.text} />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

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
            </View>

            {/* Bento Grid */}
            <View style={styles.bentoGrid}>
                {/* Row 1 */}
                <View style={styles.bentoRow}>
                    <TouchableOpacity
                        style={[styles.bentoCard, { backgroundColor: COLORS.bento.yellow }]}
                        onPress={() => navigation.navigate('Chat')}
                    >
                        <View style={styles.bentoIconContainer}>
                            <MaterialCommunityIcons name="clipboard-check" size={28} color={COLORS.black} />
                        </View>
                        <Text style={[styles.bentoText, { color: COLORS.black }]}>{t('checkEligibility')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bentoCard, { backgroundColor: COLORS.bento.blue }]}
                        onPress={() => navigation.navigate('MyApplications')}
                    >
                        <View style={styles.bentoIconContainer}>
                            <MaterialCommunityIcons name="folder-text" size={28} color={COLORS.white} />
                        </View>
                        <Text style={[styles.bentoText, { color: COLORS.white }]}>{t('myApplications')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Row 2 */}
                <View style={styles.bentoRow}>
                    <TouchableOpacity
                        style={[styles.bentoCard, { backgroundColor: COLORS.bento.green }]}
                        onPress={() => {
                            // Scroll to categories or just show them
                            Alert.alert('Info', 'Scroll down to see full categories list.')
                        }}
                    >
                        <View style={styles.bentoIconContainer}>
                            <MaterialCommunityIcons name="view-grid" size={28} color={COLORS.white} />
                        </View>
                        <Text style={[styles.bentoText, { color: COLORS.white }]}>{t('browseCategory')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.bentoCard, { backgroundColor: COLORS.bento.orange }]}
                        onPress={() => Alert.alert('Saved', 'View your saved schemes here.')}
                    >
                        <View style={styles.bentoIconContainer}>
                            <MaterialCommunityIcons name="bookmark" size={28} color={COLORS.white} />
                        </View>
                        <Text style={[styles.bentoText, { color: COLORS.white }]}>{t('helpSaved')}</Text>
                    </TouchableOpacity>
                </View>
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
                ListHeaderComponent={renderHeader()}
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
        paddingBottom: SPACING.xxl,
    },
    headerContainer: {
        paddingBottom: SPACING.l,
    },
    // Top Bar
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        marginTop: SPACING.m,
        marginBottom: SPACING.s,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: SPACING.m,
        backgroundColor: COLORS.primaryLight,
    },
    greetingText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    userName: {
        fontSize: FONT_SIZE.l,
        color: COLORS.text,
        fontWeight: '700',
    },
    notificationBtn: {
        padding: SPACING.s,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        ...SHADOWS.light,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.danger,
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginHorizontal: SPACING.l,
        paddingHorizontal: SPACING.l,
        borderRadius: 16,
        height: 52,
        marginTop: SPACING.s,
        marginBottom: SPACING.l,
        ...SHADOWS.light,
    },
    searchIcon: {
        marginRight: SPACING.m,
    },
    searchInput: {
        flex: 1,
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        fontWeight: '500',
        height: '100%',
    },
    // Bento Grid
    bentoGrid: {
        paddingHorizontal: SPACING.l,
        gap: SPACING.m,
        marginBottom: SPACING.xl,
    },
    bentoRow: {
        flexDirection: 'row',
        gap: SPACING.m,
    },
    bentoCard: {
        flex: 1,
        borderRadius: 20,
        padding: SPACING.l,
        height: 140, // Square-ish
        justifyContent: 'space-between',
        ...SHADOWS.light,
    },
    bentoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)', // Semi-transparent
        justifyContent: 'center',
        alignItems: 'center',
    },
    bentoText: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        marginTop: SPACING.s,
    },
    // Sections
    section: {
        marginBottom: SPACING.xs,
    },
    sectionTitle: {
        paddingHorizontal: SPACING.l,
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.text,
        letterSpacing: -0.2,
    },
    resultsCount: {
        fontSize: FONT_SIZE.m,
        fontWeight: 'normal',
        color: COLORS.textLight,
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
