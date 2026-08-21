/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.hbs",
    "./public/**/*.js",
    "./src/**/*.ts"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8f0',
          100: '#ffeedb',
          200: '#ffd9b3',
          300: '#ffc24b', // highlight amber
          400: '#f9a83d',
          500: '#F7941E', // BG Amber / Primary Accent
          600: '#D96F00', // Deep Amber Hover
          700: '#b35600',
          800: '#8c4000',
          900: '#662d00',
          accent: '#F7941E',
          cyan: '#37B7E8', // Digital / Inspection Blue
        },
        navy: {
          950: '#0A111F', // Carbon Navy Base
          900: '#101A2E', // Raised Dark Surface
          850: '#16233C', // Card Surface / Elevated
          800: '#1E2D4A', // Border / Muted Lines
        },
        sidebar: {
          bg: '#0A111F',
          card: '#101A2E',
          hover: '#16233C',
          border: 'rgba(255,255,255,0.08)',
          text: '#9AA7BD',
          active: '#F7941E'
        }
      }
    },
  },
  plugins: [],
}
