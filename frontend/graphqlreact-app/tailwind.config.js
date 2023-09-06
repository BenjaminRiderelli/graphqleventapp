/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "light-bg-color": "var(--light-bg-color)",
        "dark-bg-color": "var(--dark-bg-color)",
        "light-text-color":"var(--light-text-color)",
        "dark-text-color": "var(--dark-text-color)",
        "p-btn-color":"var(--primary-btn-color)",
        "s-btn-color":"var(--secondary-btn-color)"
      }
    },
  },
  plugins: [],
}

