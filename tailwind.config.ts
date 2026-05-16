import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#17171a",
          card: "#1f1f23",
          elevated: "#26262b",
        },
        accent: {
          DEFAULT: "#c4b094",
          muted: "#8e8068",
          dim: "#4d4639",
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
