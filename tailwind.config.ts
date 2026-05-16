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
          DEFAULT: "#ceb389",
          muted: "#94846a",
          dim: "#534a3a",
        },
        text: {
          DEFAULT: "#ffffff",
          muted: "#e5e7eb",
          dim: "#9ca3af",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      maxWidth: {
        site: "1600px",
      },
    },
  },
  plugins: [],
};

export default config;
