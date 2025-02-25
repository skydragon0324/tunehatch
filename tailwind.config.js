/* eslint-disable import/no-anonymous-default-export */
/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  // prefix: "",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      keyframes: {
        expandWide: {
          '0%': { maxWidth: '40px', overflow: "hidden" },
          '100%': { maxWidth: '100%' },
        },
        notificationJump:{
          '0%': { transform: "translateY(100%)"},
          '2%': { transform: "translateY(0)"},
          '95%': { transform: "translateX(0)"},
          '100%': { transform: "translateX(100%)"},
        }
      },
      animation: {
        'expand-wide': 'expandWide .3s ease-in-out',
        'notification-jump': 'notificationJump 3s linear'
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontSize: {
        '2xs': ['.5rem', {
          lineHeight: '.55rem',
          letterSpacing: '-0.01em',
        }]
      },
        colors: {
          transparent: 'transparent',
          current: 'currentColor',
          black: colors.black,
          white: colors.white,
          gray: colors.gray,
          emerald: colors.emerald,
          indigo: colors.indigo,
          yellow: colors.yellow,
          red: colors.red,
        'orange': '#f99d1b',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms')({    
      strategy: 'class', // only generate classes
  }),
  ],
  darkMode: 'class',
}

