// Theme configuration for 4 color scheme options
// Users can preview all themes before selecting their preferred one

export type ThemeId = "neutral" | "sage" | "indigo" | "terracotta";

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
};

export const themeIds = Object.keys(themes) as ThemeId[];

export const defaultTheme: ThemeId = "sage";
