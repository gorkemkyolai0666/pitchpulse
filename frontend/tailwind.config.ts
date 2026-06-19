import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#0a0a0f',
          light: '#14141f',
        },
        neon: {
          purple: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
        },
        surface: {
          DEFAULT: '#f4f3ff',
          dark: '#e8e6ff',
        },
      },
      fontFamily: {
        display: ['JetBrains Mono', 'monospace'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
