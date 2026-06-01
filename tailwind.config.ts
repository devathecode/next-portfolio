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
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        body:    ["var(--font-sans)", "system-ui", "sans-serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "ui-monospace", "monospace"],
        /* legacy names — kept so admin panel doesn't break */
        thank: ["Solitreo", "cursive"],
        whole: ["Prompt", "cursive"],
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
        wiggle: {
          "0%, 100%": { transform: "rotate(-10deg)" },
          "50%":       { transform: "rotate(10deg)"  },
        },
        shimmer: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)"  },
        },
        marquee: {
          "0%":   { transform: "translateX(0)"    },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%":   { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)"    },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)"     },
          "50%":       { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)"    },
          "50%":       { opacity: "0.9", transform: "scale(1.12)" },
        },
        "draw-line": {
          "0%":   { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        wiggle:            "wiggle 200ms ease-in-out infinite",
        shimmer:           "shimmer 1.4s infinite",
        marquee:           "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        "fade-up":         "fade-up 0.65s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":         "fade-in 0.65s ease both",
        float:             "float 5s ease-in-out infinite",
        "pulse-glow":      "pulse-glow 5s ease-in-out infinite",
        "draw-line":       "draw-line 0.6s ease both",
      },
    },
  },
  plugins: [
    // `wide:` styles apply once the nearest element with [container-type:inline-size]
    // is at least 40rem wide. For layouts that sit in panes of varying width.
    plugin(({ addVariant }) => addVariant("wide", "@container (min-width: 40rem)")),
  ],
} satisfies Config;
