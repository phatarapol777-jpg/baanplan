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
        gold: {
          DEFAULT: "#c9a55a",
          light: "#e2c07a",
          dark: "#8B6010",
        },
        ink: {
          DEFAULT: "#111111",
          secondary: "#555555",
          muted: "#999999",
        },
        cream: {
          DEFAULT: "#f9f8f5",
          dark: "#f0ede6",
        },
        dark: {
          DEFAULT: "#0f0f0f",
          card: "#161616",
          border: "#2a2a2a",
        },
      },
      fontFamily: {
        sans: ["Sarabun", "sans-serif"],
        display: ["Prompt", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(5rem,14vw,13rem)", { lineHeight: "0.9", letterSpacing: "-0.02em" }],
        "hero-sm": ["clamp(3rem,9vw,7rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        card: "0 2px 20px rgba(0,0,0,0.07)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.13)",
        search: "0 8px 60px rgba(0,0,0,0.25)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #e2c07a 0%, #c9a55a 60%, #8B6010 100%)",
        "hero-overlay":
          "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.55) 100%)",
        "hero-overlay-mobile":
          "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.20) 50%, rgba(0,0,0,0.70) 100%)",
        "house-gradient":
          "linear-gradient(160deg, #c8e6fa 0%, #a8d5b5 35%, #6aaa80 65%, #3d7a55 100%)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-up-delay": "fadeUp 0.7s ease-out 0.15s forwards",
        "fade-up-delay2": "fadeUp 0.7s ease-out 0.30s forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
