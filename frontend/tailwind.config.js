/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        panel: '#151618',
        accent: '#5a54f9',
        accentDim: 'rgba(90, 84, 249, 0.15)',
        textMain: '#ececec',
        textDim: '#8b8d91'
      },
    },
  },
  plugins: [],
}
