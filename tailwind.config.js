/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- THIS LINE IS CRUCIAL
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for a unique look
        purple: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED', // Main purple
          700: '#6D28D9', // Darker purple for backgrounds
          800: '#522B5B', // Darkest purple, near black
          900: '#432049',
        },
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3', // Complementary indigo
          900: '#2E288F',
        },
        pink: {
          300: '#FBCFE8', // Accent pink for highlights
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777', // Main accent pink
          700: '#BE185D',
        },
        teal: {
          300: '#99F6E4',
          400: '#5EEAD4',
          500: '#2DD4BF',
          600: '#14B8A6', // Secondary accent for actions
          700: '#0F9E8E',
        },
        green: {
          300: '#B4EDBC',
          400: '#83E894',
          500: '#22C55E', // Success
          600: '#15803D',
          700: '#166534',
          800: '#166534',
        },
        red: {
          500: '#EF4444', // Error/Danger
          800: '#991B1B',
        },
        blue: {
          300: '#A7CCFF',
          400: '#62A7FF',
          500: '#3B82F6', // Info/Upload
          600: '#2563EB',
          700: '#1D4ED8',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1', },
        },
      },
    },
  },
  plugins: [],
}