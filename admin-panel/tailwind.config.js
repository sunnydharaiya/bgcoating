/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.hbs",
    "./public/**/*.js",
    "./src/**/*.ts"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['Poppins', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Primary Blue
          600: '#1d4ed8', // Darker Hover Blue
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          accent: '#f59e0b',
        },
        sidebar: {
          bg: '#ffffff',
          card: '#f8fafc',
          hover: '#f1f5f9',
          border: '#e2e8f0',
          text: '#64748b',
          active: '#2563eb',
          activeBg: '#eff6ff'
        }
      }
    },
  },
  plugins: [],
}


