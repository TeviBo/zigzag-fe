module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E0E9FF',
          100: '#B3C9FF',
          200: '#82A6FF',
          300: '#567FFF',
          400: '#325CEB',
          DEFAULT: '#0D3B91',
          600: '#0A3277',
          700: '#082868',
          800: '#061F51',
          900: '#04173B'
        },
        secondary: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          DEFAULT: '#E53935',
          600: '#D32F2F',
          700: '#C62828',
          800: '#B71C1C',
          900: '#7F0000'
        },
        surface: '#FFFFFF',
        brand: {
          DEFAULT: '#000000'
        }
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.18)'
      }
    }
  },
  plugins: []
};
