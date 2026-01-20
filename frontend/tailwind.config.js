export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tg-bg': 'var(--tg-theme-bg-color)',
        'tg-text': 'var(--tg-theme-text-color)',
        'tg-hint': 'var(--tg-theme-hint-color)',
        'tg-button': 'var(--tg-theme-button-color)',
        'tg-button-text': 'var(--tg-theme-button-text-color)',
        'consumer': '#b0c3d9',
        'industrial': '#5e98d9',
        'mil-spec': '#4b69ff',
        'restricted': '#8847ff',
        'classified': '#d32ce6',
        'covert': '#eb4b4b',
        'rare': '#ffd700',
      },
      animation: {
        'spin-roulette': 'spinRoulette 5s cubic-bezier(0.15, 0.8, 0.3, 1) forwards',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        spinRoulette: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(var(--final-position))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.7)' },
        },
      },
    },
  },
  plugins: [],
}
