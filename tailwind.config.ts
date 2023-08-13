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
      colors: {
        gray: "#98A2B3",
        red: "red",
      },
      borderColor: {
        primaryGray: "#1C1C28",
        gray: "#222230",
        mainGray2: "rgb(28,28,40)",
        layer3: "rgb(38,38,54)",
        "socket-primary": "rgb(34,34,48)",
      },
      backgroundColor: {
        main: "#171721",
        mainGray: "#262636",
        mainGray2: "rgb(28,28,40)",
        pink: "#D71174",
        purple: "rgb(119,32,233)",
        theGray: "rgb(23,23,33)",
        layer3: "rgb(38,38,54)",
        darkGray: "#334054",
        "socket-layers-1": "rgb(23,23,33)",
        "socket-layers-2": "rgb(28,28,40)",
        "socket-layers-3": "rgb(38,38,54)",
      },
    },
  },
  plugins: [],
};
export default config;
