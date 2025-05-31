/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lunexa': {
          'ultraviolet': '#7B2CBF',
          'neon-cyan': '#00F5FF',
          'deep-blue': '#0A1128',
          'accent': '#4361EE',
          'glass': 'rgba(255, 255, 255, 0.1)',
          'dark': '#0A0A0F',
          'card': 'rgba(20, 20, 30, 0.7)'
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      backdropFilter: {
        'glass': 'blur(10px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'tilt': 'tilt 10s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 245, 255, 0.8)',
            transform: 'scale(1.05)',
          },
        },
        tilt: {
          '0%, 100%': {
            transform: 'rotateX(0deg) rotateY(0deg)',
          },
          '25%': {
            transform: 'rotateX(2deg) rotateY(2deg)',
          },
          '75%': {
            transform: 'rotateX(-2deg) rotateY(-2deg)',
          },
        },
      },
    },
  },
  plugins: [],
}