/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Reddit-inspired color palette
        reddit: {
          orange: '#FF4500',
          'orange-light': '#FF6314',
          'orange-dark': '#CC3700',
          'orange-hover': '#E63E00',
          blue: '#0079D3',
          'blue-light': '#24A0ED',
          'blue-dark': '#005BA1',
          'upvote': '#FF4500',
          'downvote': '#7193FF',
          // Reddit dark theme colors
          dark: {
            bg: '#000000',
            'bg-light': '#1A1A1B',
            'bg-paper': '#1A1A1B',
            'bg-hover': '#272729',
            text: '#D7DADC',
            'text-secondary': '#818384',
            border: '#343536',
          },
          // Reddit light theme colors
          light: {
            bg: '#FFFFFF',
            'bg-light': '#F8F9FA',
            'bg-paper': '#FFFFFF',
            'bg-hover': '#F6F7F8',
            text: '#1C1C1C',
            'text-secondary': '#7C7C7C',
            border: '#EDEFF1',
          }
        },
        // Override primary colors to match Reddit theme
        primary: {
          50: '#F8F9FA',   // Reddit light bg
          100: '#F6F7F8',  // Reddit light hover
          200: '#EDEFF1',  // Reddit light border
          300: '#D7DADC',  // Reddit dark text
          400: '#818384',  // Reddit dark text secondary
          500: '#7C7C7C',  // Reddit light text secondary
          600: '#343536',  // Reddit dark hover
          700: '#272729',  // Reddit dark paper
          800: '#1A1A1B',  // Reddit dark bg light
          900: '#000000',  // Reddit dark bg
        }
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}