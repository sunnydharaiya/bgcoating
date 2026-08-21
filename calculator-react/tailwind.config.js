/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F7941D',
          amber: '#FFB347',
          darkOrange: '#D97706',
          crimson: '#A41E22',
          charcoal: '#2B2B2B',
          darkSidebar: '#2B303A',
        }
      }
    },
  },
  plugins: [],
}
