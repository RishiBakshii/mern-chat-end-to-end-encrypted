/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"rgba(var(--primary))",
        "primary-dark":"rgba(var(--primary-dark))",
        secondary:"rgba(var(--secondary))",
        "secondary-dark":"rgba(var(--secondary-dark))",
        "secondary-darker":"rgba(var(--secondary-darker))",
        background:"rgba(var(--background))",
        text:"rgba(var(--text))"
      }
    },
  },
  plugins: [],
}