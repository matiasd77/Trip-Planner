/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue-500
          light: '#60A5FA', // Blue-400
          dark: '#2563EB', // Blue-600
        }
      }
    },
  },
  plugins: [],
}
