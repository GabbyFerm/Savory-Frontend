import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#81BAB4',      // Soft teal
        secondary: '#FBD180',    // Warm peach
        dark: '#32324D',         // Dark navy
        darkTeal: '#3F716C',     // Dark teal
        light: '#F5F5F5',        // Light gray
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config