/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'Sora', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#1a1c22',
          700: '#3a3d46',
          500: '#6b6f7a',
          300: '#c4c7ce',
        },
      },
    },
  },
  plugins: [],
}
