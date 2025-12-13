// Theme configuration for 12 color scheme options
// Users can preview all themes before selecting their preferred one

export type ThemeId = "neutral" | "sage" | "indigo" | "terracotta" | "rose" | "sky" | "lavender" | "mint" | "warmWelcoming" | "freshClean" | "elegantSophisticated" | "calmTrustworthy";

export interface ThemeColors {
  // Primary brand color
  primary: string;
  primaryHover: string;
  primaryLight: string;

  // Accent color for CTAs and highlights
  accent: string;
  accentHover: string;

  // Surface colors (backgrounds)
  surface: string;
  surfaceSecondary: string;
  surfaceCard: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  textOnAccent: string;

  // Border colors
  border: string;
  borderLight: string;

  // Status colors (kept consistent across themes)
  success: string;
  error: string;
  warning: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  emoji: string;
  previewColor: string; // Main color for the theme switcher preview
  colors: ThemeColors;
}

export const themes: Record<ThemeId, Theme> = {
  neutral: {
    id: "neutral",
    name: "Warm Neutral",
    description: "Earthy, premium, approachable",
    emoji: "🪨",
    previewColor: "#78716C",
    colors: {
      primary: "#78716C",
      primaryHover: "#57534E",
      primaryLight: "#A8A29E",

      accent: "#F59E0B",
      accentHover: "#D97706",

      surface: "#FAFAF9",
      surfaceSecondary: "#F5F5F4",
      surfaceCard: "#FFFFFF",

      textPrimary: "#1C1917",
      textSecondary: "#57534E",
      textMuted: "#A8A29E",
      textOnPrimary: "#FFFFFF",
      textOnAccent: "#FFFFFF",

      border: "#E7E5E4",
      borderLight: "#F5F5F4",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  sage: {
    id: "sage",
    name: "Sage Green",
    description: "Fresh, natural, calming",
    emoji: "🌿",
    previewColor: "#22C55E",
    colors: {
      primary: "#22C55E",
      primaryHover: "#16A34A",
      primaryLight: "#86EFAC",

      accent: "#F59E0B",
      accentHover: "#D97706",

      surface: "#FEFDFB",
      surfaceSecondary: "#F7F6F3",
      surfaceCard: "#FFFFFF",

      textPrimary: "#1A1A1A",
      textSecondary: "#525252",
      textMuted: "#A3A3A3",
      textOnPrimary: "#FFFFFF",
      textOnAccent: "#FFFFFF",

      border: "#E5E5E5",
      borderLight: "#F5F5F5",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  indigo: {
    id: "indigo",
    name: "Soft Indigo",
    description: "Modern, trustworthy, premium",
    emoji: "💜",
    previewColor: "#6366F1",
    colors: {
      primary: "#6366F1",
      primaryHover: "#4F46E5",
      primaryLight: "#A5B4FC",

      accent: "#F43F5E",
      accentHover: "#E11D48",

      surface: "#FAFAFA",
      surfaceSecondary: "#F4F4F5",
      surfaceCard: "#FFFFFF",

      textPrimary: "#18181B",
      textSecondary: "#52525B",
      textMuted: "#A1A1AA",
      textOnPrimary: "#FFFFFF",
      textOnAccent: "#FFFFFF",

      border: "#E4E4E7",
      borderLight: "#F4F4F5",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  terracotta: {
    id: "terracotta",
    name: "Warm Terracotta",
    description: "Warm, inviting, artisanal",
    emoji: "🧱",
    previewColor: "#EA580C",
    colors: {
      primary: "#EA580C",
      primaryHover: "#C2410C",
      primaryLight: "#FDBA74",

      accent: "#14B8A6",
      accentHover: "#0D9488",

      surface: "#FFFBF7",
      surfaceSecondary: "#FEF7F0",
      surfaceCard: "#FFFFFF",

      textPrimary: "#1C1917",
      textSecondary: "#57534E",
      textMuted: "#A8A29E",
      textOnPrimary: "#FFFFFF",
      textOnAccent: "#FFFFFF",

      border: "#E7E5E4",
      borderLight: "#F5F5F4",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  rose: {
    id: "rose",
    name: "Dusty Rose",
    description: "Romantic, gentle, elegant",
    emoji: "🌸",
    previewColor: "#E879A9",
    colors: {
      primary: "#E879A9",
      primaryHover: "#DB5C94",
      primaryLight: "#FBCFE8",

      accent: "#6EE7B7",
      accentHover: "#34D399",

      surface: "#FFFBFC",
      surfaceSecondary: "#FDF2F4",
      surfaceCard: "#FFFFFF",

      textPrimary: "#1F1215",
      textSecondary: "#6B5359",
      textMuted: "#B8A3A8",
      textOnPrimary: "#FFFFFF",
      textOnAccent: "#1F2937",

      border: "#F3D5DC",
      borderLight: "#FAE8EC",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  sky: {
    id: "sky",
    name: "Powder Blue",
    description: "Airy, peaceful, clean",
    emoji: "☁️",
    previewColor: "#60A5FA",
    colors: {
      primary: "#60A5FA",
      primaryHover: "#3B82F6",
      primaryLight: "#BFDBFE",

      accent: "#FB923C",
      accentHover: "#F97316",

      surface: "#F8FAFC",
      surfaceSecondary: "#F0F7FF",
      surfaceCard: "#FFFFFF",

      textPrimary: "#0F172A",
      textSecondary: "#475569",
      textMuted: "#94A3B8",
      textOnPrimary: "#FFFFFF",
      textOnAccent: "#FFFFFF",

      border: "#CBD5E1",
      borderLight: "#E2E8F0",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  lavender: {
    id: "lavender",
    name: "Soft Lavender",
    description: "Dreamy, soothing, creative",
    emoji: "💐",
    previewColor: "#A78BFA",
    colors: {
      primary: "#A78BFA",
      primaryHover: "#8B5CF6",
      primaryLight: "#DDD6FE",

      accent: "#FBBF24",
      accentHover: "#F59E0B",

      surface: "#FAFAFE",
      surfaceSecondary: "#F5F3FF",
      surfaceCard: "#FFFFFF",

      textPrimary: "#1E1B4B",
      textSecondary: "#5B5779",
      textMuted: "#A5A3BD",
      textOnPrimary: "#FFFFFF",
      textOnAccent: "#1F2937",

      border: "#E0DEF7",
      borderLight: "#EDE9FE",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  mint: {
    id: "mint",
    name: "Fresh Mint",
    description: "Refreshing, spa-like, gentle",
    emoji: "🍃",
    previewColor: "#34D399",
    colors: {
      primary: "#34D399",
      primaryHover: "#10B981",
      primaryLight: "#A7F3D0",

      accent: "#F472B6",
      accentHover: "#EC4899",

      surface: "#F8FDFB",
      surfaceSecondary: "#ECFDF5",
      surfaceCard: "#FFFFFF",

      textPrimary: "#064E3B",
      textSecondary: "#047857",
      textMuted: "#6EE7B7",
      textOnPrimary: "#FFFFFF",
      textOnAccent: "#FFFFFF",

      border: "#A7F3D0",
      borderLight: "#D1FAE5",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  warmWelcoming: {
    id: "warmWelcoming",
    name: "Warm & Welcoming",
    description: "Cozy, approachable, lifestyle",
    emoji: "🍑",
    previewColor: "#FFD4B2",
    colors: {
      primary: "#E8B4A0",
      primaryHover: "#D9A08C",
      primaryLight: "#FFD4B2",

      accent: "#C17C60",
      accentHover: "#A86B52",

      surface: "#FFF8E7",
      surfaceSecondary: "#F5E6D3",
      surfaceCard: "#FFFFFF",

      textPrimary: "#4A3728",
      textSecondary: "#6B5344",
      textMuted: "#A89080",
      textOnPrimary: "#FFFFFF",
      textOnAccent: "#FFFFFF",

      border: "#E8D5C4",
      borderLight: "#F5E6D3",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  freshClean: {
    id: "freshClean",
    name: "Fresh & Clean",
    description: "Natural, minimalist, organic",
    emoji: "🌱",
    previewColor: "#C8D5B9",
    colors: {
      primary: "#C8D5B9",
      primaryHover: "#A8C094",
      primaryLight: "#E8F5E9",

      accent: "#7BA05B",
      accentHover: "#6A8F4A",

      surface: "#FFFEF2",
      surfaceSecondary: "#E8F5E9",
      surfaceCard: "#FFFFFF",

      textPrimary: "#2D3B28",
      textSecondary: "#4A5D44",
      textMuted: "#8A9D84",
      textOnPrimary: "#2D3B28",
      textOnAccent: "#FFFFFF",

      border: "#D4E7D7",
      borderLight: "#E8F5E9",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  elegantSophisticated: {
    id: "elegantSophisticated",
    name: "Elegant & Sophisticated",
    description: "Luxurious, beauty, fashion",
    emoji: "✨",
    previewColor: "#E8C4C4",
    colors: {
      primary: "#E8C4C4",
      primaryHover: "#D9AEAE",
      primaryLight: "#F5E0E0",

      accent: "#9B7B8E",
      accentHover: "#8A6A7D",

      surface: "#FFFEF9",
      surfaceSecondary: "#F7E7CE",
      surfaceCard: "#FFFFFF",

      textPrimary: "#3D3035",
      textSecondary: "#5D4A52",
      textMuted: "#A08A92",
      textOnPrimary: "#3D3035",
      textOnAccent: "#FFFFFF",

      border: "#E8D8DC",
      borderLight: "#F5EAED",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },

  calmTrustworthy: {
    id: "calmTrustworthy",
    name: "Calm & Trustworthy",
    description: "Professional, clean, reliable",
    emoji: "💎",
    previewColor: "#C4D7E0",
    colors: {
      primary: "#C4D7E0",
      primaryHover: "#A8C4D0",
      primaryLight: "#D4DCEA",

      accent: "#5B8BA0",
      accentHover: "#4A7A8F",

      surface: "#F9F9F9",
      surfaceSecondary: "#E5E5E5",
      surfaceCard: "#FFFFFF",

      textPrimary: "#2D3748",
      textSecondary: "#4A5568",
      textMuted: "#A0AEC0",
      textOnPrimary: "#2D3748",
      textOnAccent: "#FFFFFF",

      border: "#D4DCEA",
      borderLight: "#E8ECF2",

      success: "#22C55E",
      error: "#EF4444",
      warning: "#F59E0B",
    },
  },
};

export const themeIds = Object.keys(themes) as ThemeId[];

export const defaultTheme: ThemeId = "sage";
