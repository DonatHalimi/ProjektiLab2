/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        malibu: {
          '50': '#f0faff',
          '100': '#e0f4fe',
          '200': '#baeafd',
          '300': '#7cdafd',
          '400': '#2fc6f9',
          '500': '#0db2ea',
          '600': '#018fc8',
          '700': '#0272a2',
          '800': '#066086',
          '900': '#0b4f6f',
          '950': '#083349',
        },
      },
    },
  },
  plugins: [],
};