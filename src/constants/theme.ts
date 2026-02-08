export const COLORS = {
    primary: '#4A90E2', // Softer, more modern blue
    primaryLight: '#F0F6FF', // Very light blue background
    secondary: '#7F8C8D', // Soft gray text
    background: '#F9FAFB', // Off-white/light gray background
    surface: '#FFFFFF', // Pure white cards
    text: '#2C3E50', // Dark blue-gray for text (softer than black)
    textLight: '#95A5A6', // Lighter gray for secondary text
    border: '#E3E8EC', // Very subtle border
    success: '#27AE60', // Muted green
    warning: '#F39C12', // Muted orange
    danger: '#E74C3C', // Muted red
    white: '#FFFFFF',
    black: '#000000',
};

export const SPACING = {
    xxs: 4,
    xs: 8,
    s: 12,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64, // Massive spacing
};

export const FONT_SIZE = {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36, // Hero text
};

export const SHADOWS = {
    light: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03, // Extremely subtle
        shadowRadius: 6,
        elevation: 1,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    card: {
        shadowColor: '#171a1f', // Slightly tinted shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
    }
};
