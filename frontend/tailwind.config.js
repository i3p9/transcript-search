/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-brown': '#4F200D',
        'brand-yellow': '#FFD93D',
        'brand-cream': '#F6F1E9',
        'brand-orange': '#FF8400',
      },
      boxShadow: {
        'brutal': '3px 3px 0px #4F200D',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
