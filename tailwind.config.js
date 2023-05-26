/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        thank: ["Solitreo", "cursive"],
        whole: ["Prompt", "cursive"]
      },
      keyframes: {
        wave: {
          '0%': { width: '0' },
          '10%': { width: '10%' },
          '20%': { width: '20%' },
          '30%': { width: '30%' },
          '40%': { width: '40%' },
          '50%': { width: '50%' },
          '60%': { width: '60%' },
          '100%': { width: '100%' },
        },
        infiniteGoDown: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: 1,
          },
        },
      },
      animation: {
        'progress-bar': 'wave 1.4s linear',
        'download-button': 'infiniteGoDown 1.5s linear infinite'
      },
    },
  },
  plugins: [],
}
