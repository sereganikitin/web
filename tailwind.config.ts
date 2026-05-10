import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a0a",
          card: "#141414",
          elevated: "#1a1a1a",
        },
        accent: {
          DEFAULT: "#d4b88a",
          muted: "#9b8866",
          dim: "#5a4f3b",
        },
        text: {
          DEFAULT: "#f4f1ea",
          muted: "#8a8478",
          dim: "#55514a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      maxWidth: {
        site: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
