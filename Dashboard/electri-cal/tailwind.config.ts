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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        halloween: {
          primary: "#189ef2",
          "primary-focus": "#0d33c9",
          "primary-content": "#0a597b",

          secondary: "#1e3799",
          "secondary-focus": "#341c4a",
          "secondary-content": "#341c4a",

          accent: "#4fa300",
          "accent-focus": "#367000",
          "accent-content": "#ffffff",

          neutral: "#1b1d1d",
          "neutral-focus": "#131616",
          "neutral-content": "#ffffff",

          "base-100": "#1f1f1f",
          "base-200": "#1b1d1d",
          "base-300": "#131616",
          "base-content": "#ffffff",

          info: "#66c7ff",
          success: "#87cf3a",
          warning: "#e1d460",
          error: "#ff6b6b",

          "--rounded-box": "1rem",
          "--rounded-btn": ".5rem",
          "--rounded-badge": "1.9rem",

          "--animation-btn": ".25s",
          "--animation-input": ".2s",

          "--btn-text-case": "uppercase",
          "--navbar-padding": ".5rem",
          "--border-btn": "1px",
        },
      },
    ],
  },
};
export default config;
