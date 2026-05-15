import type { Config } from "tailwindcss";

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
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)",    "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)",    "Courier New", "monospace"],
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
  plugins: [],
} satisfies Config;
