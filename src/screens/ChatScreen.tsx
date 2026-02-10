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

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isSystem?: boolean; // For loading indicators or system alerts
};

const ChatScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();

    // UI State
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I am your Adhikaar Assistant. 🤖\nI can help you check your eligibility for government schemes. Let\'s start! How old are you?',
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
                    const schemeList = schemes.map(s => `• ${s.name}`).join('\n');
                    addMessage(`Here are the schemes you might be eligible for:\n\n${schemeList}`, 'bot');
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

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[
                styles.messageRow,
                isUser ? styles.userRow : styles.botRow
            ]}>
                {!isUser && (
                    <View style={styles.botAvatar}>
                        <MaterialCommunityIcons name="robot" size={20} color={COLORS.white} />
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
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Adhikaar Assistant</Text>
                    <View style={styles.onlineIndicator}>
                        <View style={styles.dot} />
                        <Text style={styles.onlineText}>Online</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color={COLORS.white} />
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
        backgroundColor: COLORS.primary,
        ...SHADOWS.medium,
    },
    backButton: {
        marginRight: SPACING.m,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: '700',
        color: COLORS.white,
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
        backgroundColor: '#4ADE80',
        marginRight: 4,
    },
    onlineText: {
        fontSize: FONT_SIZE.xs,
        color: 'rgba(255,255,255,0.8)',
    },
    moreButton: {
        padding: SPACING.s,
    },
    chatContent: {
        padding: SPACING.m,
        paddingBottom: SPACING.xl,
    },
    messageRow: {
        marginBottom: SPACING.m,
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
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
        marginBottom: 4,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: SPACING.m,
        borderRadius: 20,
        ...SHADOWS.light,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    botBubble: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: FONT_SIZE.m,
        lineHeight: 22,
    },
    userText: {
        color: COLORS.white,
    },
    botText: {
        color: COLORS.text,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    userTimestamp: {
        color: 'rgba(255,255,255,0.7)',
    },
    botTimestamp: {
        color: COLORS.textLight,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: SPACING.l,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        fontSize: FONT_SIZE.m,
        color: COLORS.text,
        maxHeight: 100,
        marginRight: SPACING.m,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.textLight,
    },
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        marginLeft: 40,
    },
    typingText: {
        marginLeft: SPACING.s,
        color: COLORS.textLight,
        fontSize: FONT_SIZE.s,
        fontStyle: 'italic',
    }
});

export default ChatScreen;
