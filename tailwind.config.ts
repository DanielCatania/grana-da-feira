import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#94D82D",
          150: "#83AE42",
        },
        secondary: {
          100: "#9DA0F0F",
          150: "#AD0808",
        },
        dark: "#262626",
        light: "#F9F9F9",
        neutral: "#9E9E9E",
      },
    },
  },
  plugins: [],
} satisfies Config;
