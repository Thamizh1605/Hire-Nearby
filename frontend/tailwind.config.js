/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b2ff',
          300: '#4d93ff',
          400: '#1a74ff',
          500: '#0055e6',
          600: '#0044b3',
          700: '#003380',
          800: '#00224d',
          900: '#00111a',
        },
        dark: {
          50: '#1a1f2e',
          100: '#151a28',
          200: '#0f1420',
          300: '#0a0e18',
          400: '#050810',
          500: '#000208',
        },
      },
    },
  },
  plugins: [],
}

