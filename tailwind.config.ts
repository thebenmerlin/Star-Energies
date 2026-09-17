import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#161716",
        mineral: "#f4f1e9",
        oxide: "#b87832",
      },
    },
  },
  plugins: [],
};

export default config;
