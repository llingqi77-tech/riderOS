/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#9B8AFB',
          light: '#B8ADFC',
          dark: '#6E5FD4',
        },
        accent: '#D9F977',
        info: '#9B8AFB',
        warn: '#F59E0B',
        danger: '#EF4444',
        risk: {
          green: '#10B981',
          yellow: '#F59E0B',
          orange: '#FB923C',
          red: '#EF4444',
        },
        neutral: {
          50: '#F3F0FA',
          200: '#E5E7EB',
          500: '#6B7280',
          900: '#1A0B2E',
        },
        canvas: '#F3F0FA',
      },
      borderRadius: {
        card: '20px',
        btn: '14px',
        tag: '4px',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
      },
      boxShadow: {
        card: '0 4px 20px rgba(26,11,46,0.06), 0 1px 3px rgba(26,11,46,0.04)',
        phone: '0 25px 50px -12px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
