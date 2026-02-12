import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ActivityIndicator,
    LayoutAnimation,
    UIManager,
    Image,
    ScrollView,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

// AI Modules
import { initialEligibilityState, EligibilityState } from '../ai/eligibilityState';
import { getNextQuestion, inferFieldFromQuestion, detectDeterministicUpdate } from '../ai/conversationController';
import { extractEligibilityInfo, generateExplanation } from '../ai/openRouterExtractor';
import { checkEligibility } from '../ai/eligibilityEngine'; // Placeholder import if not ready yet
import { Scheme } from '../services/api';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isSystem?: boolean; // For loading indicators or system alerts
    type?: 'text' | 'schemes';
    data?: Scheme[]; // Array of schemes if type is 'schemes'
};

const ChatScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();

    // UI State
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! 👋 I\'m your Adhikaar Assistant.\n\nI can help you discover government schemes you\'re eligible for. Let\'s get started! 🚀\n\nTo begin, could you please tell me how old you are?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // AI State
    const eligibilityState = useRef<EligibilityState>({ ...initialEligibilityState });

    // Scroll to bottom on new message
    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages, isTyping]);

    const addMessage = (text: string, sender: 'user' | 'bot') => {
        const msg: Message = {
            id: Date.now().toString() + Math.random().toString(),
            text,
            sender,
            timestamp: new Date(),
        };
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMessages(prev => [...prev, msg]);
    };

    const handleUserMessage = async () => {
        if (!inputText.trim()) return;

        const userText = inputText.trim();
        setInputText('');
        addMessage(userText, 'user');
        setIsTyping(true);

        // Get context from last message
        const lastMessage = messages[messages.length - 1];
        const lastBotQuestion = lastMessage?.sender === 'bot' ? lastMessage.text : null;

        try {
            // 1. Try Deterministic Update (Fast & Cheap)
            // We need to import inferFieldFromQuestion and detectDeterministicUpdate which are now exported
            const expectedField = lastBotQuestion ? inferFieldFromQuestion(lastBotQuestion) : null;
            const deterministicUpdates = detectDeterministicUpdate(userText, expectedField);

            console.log("Deterministic Updates:", deterministicUpdates);

            // 2. Extract Info using AI (Smart)
            const aiUpdates = await extractEligibilityInfo(userText, eligibilityState.current, lastBotQuestion);
            console.log("AI Updates:", aiUpdates);

            // 3. Merge Updates (Deterministic takes precedence for specific yes/no logic if we trust it more, or merge)
            // Here we merge, letting deterministic override if present (since it's explicit logic), or vice versa.
            // Let's assume deterministic is safer for simple booleans where AI might fail.
            const updates = { ...aiUpdates, ...deterministicUpdates };

            // 4. Update State
            eligibilityState.current = {
                ...eligibilityState.current,
                ...updates,
            };
            console.log("Current State:", eligibilityState.current);

            // 5. Determine Next Step
            const nextQuestion = getNextQuestion(eligibilityState.current);

            if (nextQuestion) {
                // Ask next question
                setIsTyping(false);
                addMessage(nextQuestion, 'bot');
            } else {
                // Flow Complete - Check Eligibility
                addMessage("Thank you! I have all the details. Checking eligible schemes now... 🔍", 'bot');

                // Fetch schemes
                const schemes = await checkEligibility(eligibilityState.current);

                // Generate explanation
                const explanation = await generateExplanation(schemes, eligibilityState.current);

                setIsTyping(false);
                addMessage(explanation, 'bot');

                // List schemes
                if (schemes.length > 0) {
                    addMessage("Here are the schemes you might be eligible for:", 'bot');
                    // Add a special message for schemes
                    const schemeMsg: Message = {
                        id: Date.now().toString() + Math.random().toString(),
                        text: '',
                        sender: 'bot',
                        timestamp: new Date(),
                        type: 'schemes',
                        data: schemes
                    };
                    setMessages(prev => [...prev, schemeMsg]);
                } else {
                    addMessage("I couldn't find any specific schemes matching your profile at the moment.", 'bot');
                }
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setIsTyping(false);
            addMessage("I'm sorry, I encountered an issue while processing that. Could you please try again?", 'bot');
        }
    };

    const renderSchemeCard = (scheme: Scheme) => (
        <View key={scheme.id} style={styles.schemeCard}>
            <View style={[styles.schemeIcon, { backgroundColor: COLORS.vibrant.primary }]}>
                <MaterialCommunityIcons name="text-box-check-outline" size={24} color={COLORS.white} />
            </View>
            <View style={styles.schemeContent}>
                <Text style={styles.schemeTitle} numberOfLines={2}>{scheme.name}</Text>
                <Text style={styles.schemeDesc} numberOfLines={2}>{scheme.short_description}</Text>
                <TouchableOpacity style={styles.viewDetailsButton}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.vibrant.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';

        if (item.type === 'schemes' && item.data) {
            return (
                <View style={[styles.messageRow, styles.botRow, { marginBottom: SPACING.l }]}>
                    <View style={styles.botAvatar}>
                        <MaterialCommunityIcons name="message-text" size={24} color={COLORS.vibrant.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: SPACING.m }}>
                            {item.data.map((scheme: Scheme) => renderSchemeCard(scheme))}
                        </ScrollView>
                    </View>
                </View>
            );
        }

        return (
            <View style={[
                styles.messageRow,
                isUser ? styles.userRow : styles.botRow
            ]}>
                {!isUser && (
                    <View style={styles.botAvatar}>
                        {/* Message icon on light background */}
                        <MaterialCommunityIcons name="message-text" size={24} color={COLORS.vibrant.primary} />
                    </View>
                )}
                <View style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.botBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isUser ? styles.userText : styles.botText
                    ]}>{item.text}</Text>
                    <Text style={[
                        styles.timestamp,
                        isUser ? styles.userTimestamp : styles.botTimestamp
                    ]}>
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Adhikaar Assistant</Text>
                    <View style={styles.onlineIndicator}>
                        <View style={styles.dot} />
                        <Text style={styles.onlineText}>Online</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Chat Area */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    isTyping ? (
                        <View style={styles.typingContainer}>
                            <ActivityIndicator size="small" color={COLORS.primary} />
                            <Text style={styles.typingText}>Thinking...</Text>
                        </View>
                    ) : null
                }
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    {/* Shadow wrapper or ensuring elevation works */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('searchPlaceholder') || "Type a message..."}
                            placeholderTextColor={COLORS.textLight}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
                            onPress={handleUserMessage}
                            disabled={!inputText.trim() || isTyping}
                        >
                            <MaterialCommunityIcons name="send" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.vibrant.background, // New vibrant background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
        backgroundColor: 'rgba(255,255,255,0.9)', // Translucent white
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        zIndex: 10,
    },
    backButton: {
        marginRight: SPACING.m,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 20,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '800', // Bolder
        color: COLORS.vibrant.text, // Dark Indigo
        letterSpacing: -0.5,
    },
    onlineIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success, // Emerald Green - Good for status
        marginRight: 6,
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    onlineText: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    moreButton: {
        padding: SPACING.s,
    },
    chatContent: {
        padding: SPACING.m,
        paddingBottom: 100, // Extra space for floating input
    },
    messageRow: {
        marginBottom: SPACING.l, // More breathing room
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    botRow: {
        justifyContent: 'flex-start',
    },
    botAvatar: {
        width: 38,
        height: 38,
        borderRadius: 14, // Softer square
        backgroundColor: COLORS.vibrant.background, // Match chat background (light)
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
        marginBottom: 2,
        ...SHADOWS.medium, // More pop
        shadowColor: COLORS.vibrant.primary,
        shadowOpacity: 0.15,
        borderWidth: 1,
        borderColor: COLORS.vibrant.primary + '10',
    },
    messageBubble: {
        maxWidth: '75%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        ...SHADOWS.light,
    },
    userBubble: {
        backgroundColor: COLORS.vibrant.primary, // Indigo
        borderTopRightRadius: 4,
        shadowColor: COLORS.vibrant.primary,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    botBubble: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 4, // Subtle "tail" hint
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    messageText: {
        fontSize: FONT_SIZE.m,
        lineHeight: 24,
    },
    userText: {
        color: COLORS.white,
    },
    botText: {
        color: COLORS.text,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 6,
        alignSelf: 'flex-end',
        opacity: 0.7,
    },
    userTimestamp: {
        color: 'rgba(255,255,255,0.8)',
    },
    botTimestamp: {
        color: COLORS.textLight,
    },
    inputContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 20 : 10,
        left: 0,
        right: 0,
        paddingHorizontal: SPACING.m,
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 25,
        paddingHorizontal: SPACING.l,
        paddingVertical: 12,
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        maxHeight: 100,
        marginRight: SPACING.xs,
        ...SHADOWS.medium, // Floating effect
        shadowColor: COLORS.vibrant.primary,
        shadowOpacity: 0.1,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.vibrant.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
        shadowColor: COLORS.vibrant.primary,
        shadowOpacity: 0.4,
        elevation: 8,
    },
    sendButtonDisabled: {
        backgroundColor: '#CBD5E1', // Slate 300
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.m,
        marginLeft: 54, // Align with bot text
    },
    typingText: {
        marginLeft: SPACING.s,
        color: COLORS.textLight,
        fontSize: FONT_SIZE.s,
        fontStyle: 'italic',
    },
    schemeCard: {
        width: 240,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.m,
        marginRight: SPACING.m,
        ...SHADOWS.medium,
        shadowColor: COLORS.vibrant.secondary,
        shadowOpacity: 0.1,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    schemeIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    schemeContent: {
        flex: 1,
    },
    schemeTitle: {
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
        color: COLORS.vibrant.text,
        marginBottom: 4,
    },
    schemeDesc: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textLight,
        marginBottom: SPACING.m,
        lineHeight: 18,
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewDetailsText: {
        fontSize: FONT_SIZE.s,
        fontWeight: '600',
        color: COLORS.vibrant.primary,
        marginRight: 4,
    }
});

export default ChatScreen;
