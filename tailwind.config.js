/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        safety: {
          navy: '#0B192C',
          dark: '#1E293B',
          blue: '#1E3E62',
          teal: '#008170',
          accent: '#00BD9D',
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          darkcard: '#1E293B',
          darksurface: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 30px -4px rgba(0, 0, 0, 0.1)',
        'glow-teal': '0 0 15px rgba(0, 189, 157, 0.35)',
        'glow-red': '0 0 15px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}
