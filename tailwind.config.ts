import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          black: "#0A0A0A",
          darkGray: "#1A1A1A",
          red: "#DC2626",
          darkRed: "#B91C1C",
          bloodRed: "#991B1B",
        },
        secondary: {
          gray: "#404040",
          lightGray: "#6B7280",
          white: "#F8F8F8",
        },
        accent: {
          crimson: "#EF4444",
          rose: "#F87171",
          ember: "#FCA5A5",
        }
      },
      fontFamily: {
        'display': ['var(--font-display)', 'serif'],
        'body': ['var(--font-body)', 'sans-serif'],
        'mono': ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-red': 'pulseRed 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(220, 38, 38, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { textShadow: '0 0 5px #DC2626, 0 0 10px #DC2626, 0 0 15px #DC2626' },
          '100%': { textShadow: '0 0 10px #DC2626, 0 0 20px #DC2626, 0 0 30px #DC2626' },
        },
      },
    },
  },
  plugins: [],
};

export default config;