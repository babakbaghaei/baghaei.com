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
        primary: '#000000',
        secondary: '#666666',
        accent: '#0066FF',
      },
      fontFamily: {
        'sans': ['IRANSans', 'Yekan', 'sans-serif'],
        'display': ['Yekan', 'IRANSans', 'sans-serif'],
        'english': ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['clamp(1.5rem, 3.5vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-3': ['clamp(1.25rem, 2.5vw, 2rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
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
