import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          background: '#090A0C',
          surface: '#1A1D21',
          card: '#1E2228',
          border: '#2A2D33',
          accent: '#0066FF',
          accentHover: '#0052CC',
          success: '#00C49A',
          danger: '#F56565',
          warning: '#F6E05E'
        }
      }
    }
  },
  plugins: []
}

export default config