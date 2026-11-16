import type { Config } from 'tailwindcss';

// Khushie Sarees palette: kumkum red (#A6132B, from the pleat-K logo) as the
// burgundy accent, warm cream/ivory grounds and restrained zari gold.
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        kumkum: { DEFAULT: '#A6132B', deep: '#6E0B1E', soft: '#F4E4E2' },
        cream: { DEFAULT: '#FAF6EE', warm: '#F4ECDF', deep: '#EBDFCB' },
        zari: { DEFAULT: '#7E6419', logo: '#9A7B1E', light: '#C9A227' },
        ink: { DEFAULT: '#2A1B1B', soft: '#5E4B48', mute: '#6F5E58' },
        // kept for the admin screen
        charcoal: '#1a1a1a',
        gold: { DEFAULT: '#d4af37', dark: '#b8941f', light: '#e6c75a' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { label: '0.18em' },
    },
  },
  plugins: [],
};

export default config;
