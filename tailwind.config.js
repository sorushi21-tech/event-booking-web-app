/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        button: {
          primary: {
            DEFAULT: '#4f46e5',
            hover: '#4338ca',
            foreground: '#ffffff'
          },
          secondary: {
            DEFAULT: '#ffffff',
            hover: '#f8fafc',
            foreground: '#0f172a',
            border: '#e2e8f0'
          },
          success: {
            DEFAULT: '#10b981',
            hover: '#059669',
            foreground: '#ffffff'
          },
          danger: {
            DEFAULT: '#ef4444',
            hover: '#dc2626',
            foreground: '#ffffff'
          }
        },
        input: {
          DEFAULT: '#ffffff',
          border: '#d1d5db',
          focus: '#6366f1',
          placeholder: '#94a3b8',
          text: '#0f172a',
          disabled: '#f8fafc'
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          soft: '#f1f5f9',
          dark: '#020617',
          'dark-muted': '#111827'
        },
        foreground: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
          soft: '#475569',
          inverse: '#f8fafc',
          'inverse-muted': '#cbd5e1'
        },
        border: {
          DEFAULT: '#e2e8f0',
          muted: '#cbd5e1',
          dark: '#334155'
        }
      }
    }
  },
  plugins: []
};
