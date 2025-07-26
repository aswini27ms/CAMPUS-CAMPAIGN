/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'fluido-purple': '#8224e3',
        'fluido-pink': '#e73c7e',
        'fluido-yellow': '#ffd500',
      },
    },
  },
  plugins: [],
}
