import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        mainBg: "#0d0d2b",
        secondaryBg: "#050523",
        thirdBg: "#0F132C",
        darkBlue: "#333F51",
      },
      borderColor: {
        darkBlue: "#333F51",
      },
      colors: {
        lightWhite: "#E0E0E0",
        secondWhite: "#CFCFCF",
        thirdWhite: "#B3B3B3",
        fourthWhite: "#8896AB",
      },
    },
  },
  plugins: [],
};
export default config;
