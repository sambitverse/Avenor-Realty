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
        background: '#fdf8f8',
        'on-background': '#1c1b1b',
        primary: '#000000',
        'on-primary': '#ffffff',
        secondary: '#755a24',
        'secondary-container': '#ffdb99',
        'on-secondary-container': '#795f28',
        'surface-container-low': '#f7f3f2',
        'surface-container': '#f1edec',
        'surface-container-high': '#ebe7e6',
        'surface-container-highest': '#e5e2e1',
        'on-surface-variant': '#444748',
        'outline-variant': '#c4c7c7',
        avenor: {
          beige: '#fdf8f8',
          'surface-low': '#f7f3f2',
          text: '#1c1b1b',
          gold: '#755a24',
          'gold-hover': '#5b430e',
          dark: '#1c1b1b',
          border: '#e5e2e1',
          muted: '#444748',
          glass: 'rgba(255, 255, 255, 0.7)'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        'editorial-italic': ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      fontSize: {
        'display-xl': ['120px', { lineHeight: '110px', letterSpacing: '-0.04em', fontWeight: '600' }],
        'headline-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '500' }],
        'editorial-italic': ['48px', { lineHeight: '1.2', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', letterSpacing: '0.01em', fontWeight: '300' }],
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.1em', fontWeight: '600' }]
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px'
      }
    },
  },
  plugins: [],
}
