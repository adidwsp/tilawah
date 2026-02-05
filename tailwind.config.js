/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        secondary: '#1E40AF',
      },
      fontFamily: {
        'arabic': ['Amiri', 'serif'],
      }
    },
  },
  plugins: [],
}