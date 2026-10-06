import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        /* Resolve per surface: Geist in admin, the title-sequence faces on .site */
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent:     "var(--accent)",
        "bg-primary":   "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card":      "var(--bg-card)",
        "text-primary":   "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted":     "var(--text-muted)",
        "border-token":   "var(--border)",
        /* admin panel tokens (channels defined in globals.css) */
        adm: {
          bg:        "rgb(var(--adm-bg) / <alpha-value>)",
          surface:   "rgb(var(--adm-surface) / <alpha-value>)",
          raised:    "rgb(var(--adm-raised) / <alpha-value>)",
          border:    "rgb(var(--adm-border) / <alpha-value>)",
          text:      "rgb(var(--adm-text) / <alpha-value>)",
          muted:     "rgb(var(--adm-muted) / <alpha-value>)",
          subtle:    "rgb(var(--adm-subtle) / <alpha-value>)",
          accent:    "rgb(var(--adm-accent) / <alpha-value>)",
          "accent-text": "rgb(var(--adm-accent-text) / <alpha-value>)",
          "on-accent":   "rgb(var(--adm-on-accent) / <alpha-value>)",
          danger:    "rgb(var(--adm-danger) / <alpha-value>)",
          success:   "rgb(var(--adm-success) / <alpha-value>)",
        },
      },
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.65s ease both",
      },
    },
  },
  plugins: [
    // `wide:` styles apply once the nearest element with [container-type:inline-size]
    // is at least 40rem wide. For layouts that sit in panes of varying width.
    plugin(({ addVariant }) => addVariant("wide", "@container (min-width: 40rem)")),
  ],
} satisfies Config;
