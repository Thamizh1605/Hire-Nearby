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
        cream: {
          light: '#f1f3e0',
          DEFAULT: '#f1f3e0',
        },
        sage: {
          light: '#d2dcb6',
          DEFAULT: '#d2dcb6',
          medium: '#a1bc98',
          dark: '#778873',
        },
        primary: {
          50: '#f1f3e0',
          100: '#d2dcb6',
          200: '#a1bc98',
          300: '#778873',
          400: '#5a6b56',
          500: '#4a5747',
          600: '#3a4538',
          700: '#2a3329',
          800: '#1a211a',
          900: '#0a0f0a',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(119, 136, 115, 0.1), 0 10px 20px -2px rgba(119, 136, 115, 0.1)',
        'medium': '0 4px 25px -5px rgba(119, 136, 115, 0.2), 0 10px 30px -5px rgba(119, 136, 115, 0.15)',
        'large': '0 10px 40px -10px rgba(119, 136, 115, 0.3), 0 20px 50px -10px rgba(119, 136, 115, 0.2)',
      },
    },
  },
  plugins: [],
}

