/**
 * Rhema — Design Tokens
 *
 * Visual direction: Minimal & modern layout + scholarly depth
 * Clean whitespace like Notion, deep palette and serif fonts for gravitas.
 */

export const colors = {
  // Primary — deep navy with scholarly weight
  primary: {
    50: "#EEF2F7",
    100: "#D4DFEC",
    200: "#A9BFDA",
    300: "#7E9FC7",
    400: "#5380B5",
    500: "#2D4A6F",  // main
    600: "#243C5A",
    700: "#1B2E44",
    800: "#12202F",
    900: "#0A1219",
  },

  // Accent — warm gold for highlights and CTAs
  accent: {
    50: "#FFF9EB",
    100: "#FFF0CC",
    200: "#FFE099",
    300: "#FFD166",
    400: "#FFC233",
    500: "#D4A012",  // main
    600: "#AA800E",
    700: "#80600B",
    800: "#554007",
    900: "#2B2004",
  },

  // Neutral — warm grays (not cold/blue)
  neutral: {
    50: "#FAFAF8",
    100: "#F5F5F0",
    200: "#E8E8E0",
    300: "#D4D4C8",
    400: "#A8A89C",
    500: "#7C7C70",
    600: "#5C5C52",
    700: "#3E3E38",
    800: "#2A2A26",
    900: "#1A1A17",
  },

  // Semantic
  success: "#2D6A4F",
  warning: "#D4A012",
  error: "#9B2C2C",
  info: "#2D4A6F",

  // Surface
  background: "#FAFAF8",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  border: "#E8E8E0",
  borderSubtle: "#F5F5F0",
};

export const typography = {
  // Serif for scripture, headings, and content that should feel "weighty"
  fontSerif: "'Libre Baskerville', 'Georgia', 'Times New Roman', serif",

  // Sans-serif for UI elements, navigation, metadata
  fontSans: "'Inter', 'system-ui', '-apple-system', 'Segoe UI', sans-serif",

  // Monospace for references and technical content
  fontMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",

  // Scale
  sizes: {
    xs: "0.75rem",     // 12px
    sm: "0.875rem",    // 14px
    base: "1rem",      // 16px
    lg: "1.125rem",    // 18px
    xl: "1.25rem",     // 20px
    "2xl": "1.5rem",   // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",     // 48px
  },

  // Line heights optimized for reading
  leading: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",     // for scripture body text
    scripture: "1.9",     // extra spacious for scripture reading
  },
};

export const spacing = {
  page: {
    maxWidth: "72rem",         // 1152px
    paddingX: "1.5rem",        // 24px on mobile
    paddingXLg: "3rem",        // 48px on desktop
  },
  section: {
    gap: "3rem",               // between major sections
  },
  card: {
    padding: "1.5rem",
    borderRadius: "0.75rem",
  },
};

export const shadows = {
  sm: "0 1px 2px 0 rgba(26, 26, 23, 0.05)",
  md: "0 4px 6px -1px rgba(26, 26, 23, 0.07), 0 2px 4px -2px rgba(26, 26, 23, 0.05)",
  lg: "0 10px 15px -3px rgba(26, 26, 23, 0.08), 0 4px 6px -4px rgba(26, 26, 23, 0.05)",
};
