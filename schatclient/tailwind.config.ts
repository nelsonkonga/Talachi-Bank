import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // Deep Blue
          50: '#EFF6FF',
          500: '#3B82F6',
          700: '#1D4ED8',
          900: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#F59E0B', // Gold
          50: '#FFFBEB',
          500: '#F59E0B',
          700: '#B45309',
        },
        success: {
          DEFAULT: '#10B981',
          500: '#10B981',
          700: '#059669',
        },
        danger: {
          DEFAULT: '#EF4444',
          500: '#EF4444',
          700: '#DC2626',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
