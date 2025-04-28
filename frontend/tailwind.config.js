/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        papyrus: {
          50: '#FFFDF5',
          100: '#F5F1E6',
          200: '#E8DFC8',
          300: '#D1C6A8',
          400: '#B5A889',
          500: '#96896A',
          600: '#6D614C',
          700: '#554B3A',
          800: '#3D3B30',
          900: '#28261F',
        },
        ink: {
          900: '#1A1A1A',
          800: '#2D2D2D',
          700: '#444444',
          600: '#5E5E5E',
          500: '#757575',
        },
      },
      fontFamily: {
        serif: ['"Lora"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-once': 'pulse 2s ease-in-out 1',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};