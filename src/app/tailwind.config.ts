import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#111111',
      },
    },
  },
  plugins: [],
};
export default config;
