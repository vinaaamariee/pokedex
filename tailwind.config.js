/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Outfit', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f7f8',
          100: '#ececf0',
          200: '#d5d5de',
          300: '#b0b0c0',
          400: '#85859a',
          500: '#67677d',
          600: '#525266',
          700: '#434355',
          800: '#3a3a49',
          900: '#333340',
          950: '#1c1c26',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
        'glass-lg': '0 24px 48px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.06)',
        glow: '0 0 40px rgba(139, 92, 246, 0.25)',
        'glow-cyan': '0 0 36px rgba(34, 211, 238, 0.2)',
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(ellipse 90% 55% at 50% -15%, rgba(139, 92, 246, 0.18), transparent 55%), radial-gradient(ellipse 70% 45% at 100% 0%, rgba(34, 211, 238, 0.14), transparent 50%), radial-gradient(ellipse 55% 40% at 0% 100%, rgba(251, 113, 133, 0.12), transparent 50%), linear-gradient(165deg, #f8fafc 0%, #eef2ff 45%, #f0fdfa 100%)',
        'mesh-dark':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139, 92, 246, 0.22), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 10%, rgba(34, 211, 238, 0.1), transparent 50%), radial-gradient(ellipse 50% 45% at 0% 90%, rgba(244, 63, 94, 0.08), transparent 50%), linear-gradient(165deg, #0c0b12 0%, #111827 40%, #0f172a 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
