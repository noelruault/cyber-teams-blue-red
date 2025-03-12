/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/frontend/**/*.{html,js}",
    "./src/frontend/index.html",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        white: "#F7F7F8",
      },
    }
  },
  plugins: []
}
