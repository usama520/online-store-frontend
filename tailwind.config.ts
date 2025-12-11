import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Theme-aware colors using CSS variables
        "theme-primary": "var(--color-primary)",
        "theme-primary-hover": "var(--color-primary-hover)",
        "theme-primary-light": "var(--color-primary-light)",
        "theme-primary-dark": "var(--color-primary-dark)",
        "theme-primary-dark-end": "var(--color-primary-dark-end)",

        "theme-accent": "var(--color-accent)",
        "theme-accent-hover": "var(--color-accent-hover)",

        "theme-surface": "var(--color-surface)",
        "theme-surface-secondary": "var(--color-surface-secondary)",
        "theme-surface-card": "var(--color-surface-card)",

        "theme-text": "var(--color-text-primary)",
        "theme-text-secondary": "var(--color-text-secondary)",
        "theme-text-muted": "var(--color-text-muted)",
        "theme-text-on-primary": "var(--color-text-on-primary)",
        "theme-text-on-accent": "var(--color-text-on-accent)",

        "theme-border": "var(--color-border)",
        "theme-border-light": "var(--color-border-light)",

        "theme-success": "var(--color-success)",
        "theme-error": "var(--color-error)",
        "theme-warning": "var(--color-warning)",

        // Legacy admin theme colors (kept for admin panel)
        primary: "#DC2626",
        "primary-dark": "#991B1B",
        sidebar: "#000000",
        "card-bg": "#FFFFFF",
        "content-bg": "#F9FAFB",
        "text-primary": "#1F2937",
        "text-secondary": "#6B7280",
        "text-muted": "#9CA3AF",
        "icon-blue": "#3B82F6",
        "icon-green": "#10B981",
        "icon-purple": "#A855F7",
        "icon-orange": "#F97316",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      spacing: {
        sidebar: "280px",
      },
      zIndex: {
        35: "35",
        40: "40",
        50: "50",
      },
      boxShadow: {
        "soft-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
        soft: "0 4px 12px -4px rgba(0, 0, 0, 0.08)",
        "soft-md": "0 8px 24px -8px rgba(0, 0, 0, 0.1)",
        "soft-lg": "0 16px 40px -12px rgba(0, 0, 0, 0.12)",
        "soft-xl": "0 24px 56px -16px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "gradient-flow": "gradientFlow 15s ease infinite",
        "float-slow": "floatSlow 20s ease-in-out infinite",
        "float-medium": "floatMedium 15s ease-in-out infinite",
        "float-fast": "floatFast 12s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        gradientFlow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(15px, -20px)" },
          "50%": { transform: "translate(-10px, 15px)" },
          "75%": { transform: "translate(20px, 5px)" },
        },
        floatMedium: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(-25px, 15px)" },
          "66%": { transform: "translate(20px, -20px)" },
        },
        floatFast: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(-15px, -15px)" },
          "50%": { transform: "translate(20px, 10px)" },
          "75%": { transform: "translate(-10px, 20px)" },
        },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/forms"),
  ],
};
export default config;
