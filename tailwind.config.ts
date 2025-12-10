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
        // Ziebart theme colors
        primary: "#DC2626", // Red accent
        "primary-dark": "#991B1B",
        sidebar: "#000000", // Black sidebar
        "card-bg": "#FFFFFF", // White cards
        "content-bg": "#F9FAFB", // Light gray background
        "text-primary": "#1F2937", // Dark gray text
        "text-secondary": "#6B7280", // Medium gray text
        "text-muted": "#9CA3AF", // Light gray text
        "icon-blue": "#3B82F6",
        "icon-green": "#10B981",
        "icon-purple": "#A855F7",
        "icon-orange": "#F97316",
      },
      fontFamily: {
        sans: [
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
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/forms"),
  ],
};
export default config;
