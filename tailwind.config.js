/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        info: '#3B82F6',
        warn: '#F59E0B',
        danger: '#EF4444',
        risk: {
          green: '#10B981',
          yellow: '#F59E0B',
          orange: '#FB923C',
          red: '#EF4444',
        },
        neutral: {
          50: '#F9FAFB',
          200: '#E5E7EB',
          500: '#6B7280',
          900: '#1F2937',
        },
        canvas: '#F9FAFB',
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
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
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        phone: '0 25px 50px -12px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
