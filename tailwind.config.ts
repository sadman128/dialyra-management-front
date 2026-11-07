import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Primary Palette (#411264)
        "primary": "#280044",
        "primary-container": "#411264",
        "on-primary": "#ffffff",
        "on-primary-container": "#af7fd4",
        "primary-fixed": "#f2daff",
        "primary-fixed-dim": "#e1b6ff",
        "on-primary-fixed": "#2e004e",
        "on-primary-fixed-variant": "#5e3281",
        "inverse-primary": "#e1b6ff",

        // Brand Secondary Palette (#f0a60a)
        "secondary": "#805600",
        "secondary-container": "#feb21f",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#6b4800",
        "secondary-fixed": "#ffddaf",
        "secondary-fixed-dim": "#ffba43",
        "on-secondary-fixed": "#281800",
        "on-secondary-fixed-variant": "#614000",

        // Brand Tertiary / Telephony Indicators
        "tertiary": "#001c10",
        "tertiary-container": "#003320",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#00a774",
        "tertiary-fixed": "#6ffbbe",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary-fixed": "#002113",
        "on-tertiary-fixed-variant": "#005236",

        // Dynamic Surface and Background Colors (Adaptive Soft Palette)
        "surface": "rgb(var(--color-surface) / <alpha-value>)",
        "surface-dim": "rgb(var(--color-surface-dim) / <alpha-value>)",
        "surface-bright": "rgb(var(--color-surface-bright) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--color-surface-container-highest) / <alpha-value>)",
        "surface-variant": "rgb(var(--color-surface-variant) / <alpha-value>)",

        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        "inverse-surface": "rgb(var(--color-inverse-surface) / <alpha-value>)",
        "inverse-on-surface": "rgb(var(--color-inverse-on-surface) / <alpha-value>)",
        "surface-tint": "#784a9b",

        "outline": "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "background": "rgb(var(--color-background) / <alpha-value>)",
        "on-background": "rgb(var(--color-on-background) / <alpha-value>)",
      },
      spacing: {
        "margin-desktop": "2rem",
        "margin-tablet": "1.5rem",
        "margin": "1rem",
        "gutter-desktop": "1.5rem",
        "gutter": "1.25rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "0.75rem",
        "space-lg": "1.25rem",
        "space-xl": "1.75rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        code: ["monospace"],
      },
      // All font sizes scaled up +4px for comfortable readability (Except Navbar)
      fontSize: {
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.025em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["19px", { lineHeight: "26px", letterSpacing: "-0.005em", fontWeight: "400" }],
        "body-md": ["18px", { lineHeight: "26px", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["16px", { lineHeight: "22px", letterSpacing: "0em", fontWeight: "400" }],
        "label-lg": ["18px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "500" }],
        "label-md": ["16px", { lineHeight: "22px", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-sm": ["15px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "600" }],
        "code-sm": ["15px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "500" }],
      },
      boxShadow: {
        "stitch": "0 1px 8px rgba(0,0,0,0.04)",
        "stitch-card": "0 4px 20px -2px rgba(65, 18, 100, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
