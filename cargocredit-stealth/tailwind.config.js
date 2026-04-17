/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./src/_archive/**/*",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0B',
        text: '#F4F4F5',
        muted: '#71717A',
        subtle: '#27272A',
        accent: '#C7A56A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
