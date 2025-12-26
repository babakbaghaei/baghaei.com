import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Keeping 'black' for explicit usage if needed, otherwise rely on gray scale
        'black': 'var(--color-black)', // Map to a CSS variable

        // Radix-inspired Slate Gray Scale (using CSS variables)
        gray: {
          50:  'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
          950: 'var(--color-gray-950)',
        },

        // Radix-inspired Blue Accent Scale (using CSS variables)
        blue: {
          50:  'var(--color-blue-50)',
          100: 'var(--color-blue-100)',
          200: 'var(--color-blue-200)',
          300: 'var(--color-blue-300)',
          400: 'var(--color-blue-400)',
          500: 'var(--color-blue-500)',
          600: 'var(--color-blue-600)',
          700: 'var(--color-blue-700)',
          800: 'var(--color-blue-800)',
          900: 'var(--color-blue-900)',
          950: 'var(--color-blue-950)',
        },

        // Semantic Colors (using CSS variables)
        success: 'var(--color-success)',
        error:   'var(--color-error)',
        warning: 'var(--color-warning)',
        info:    'var(--color-info)',

        // Optional: Re-map 'accent' to a blue shade if still needed for legacy components
        accent: 'var(--color-blue-500)',
      },
      fontFamily: {
        'sans': ['IRANSans', 'sans-serif'],
        'display': ['YekanBakh', 'IRANSans', 'sans-serif'],
        'english': ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1' }],
        'display-2': ['clamp(1.5rem, 3.5vw, 3rem)', { lineHeight: '1.2' }],
        'display-3': ['clamp(1.25rem, 2.5vw, 2rem)', { lineHeight: '1.3' }],
      },
      borderRadius: {
        'none': '0',
        'DEFAULT': '12px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
    },
  },
  plugins: [],
};
export default config;
