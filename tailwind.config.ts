import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#334e68',
          800: '#102a43',
          900: '#0f172a', // Deep Navy
        },
        status: {
          done: '#10b981',       // Emerald Green
          progress: '#f59e0b',   // Amber Yellow
          pending: '#ef4444',    // Crimson Red / Orange
        }
      },
      fontFamily: {
        prompt: ['var(--font-prompt)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
