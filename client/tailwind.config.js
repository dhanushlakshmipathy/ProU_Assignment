/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-text-primary': '#E0E0E0',
        'dark-text-secondary': '#B0B0B0',
        'dark-border': '#444444',
        'dark-accent': '#888888',
      }
    },
  },
  plugins: [],
}
