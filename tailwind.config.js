/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1792px",
        "4xl": "2048px",
      },
      colors: {
        orange: "#FF5500",
        peach: "#FFC3A6",
        mint: "#C2EBC4",
        sky: {
          50: "#eff7ff",
          100: "#daecff",
          200: "#b3d9ff", // palette generated with https://uicolors.app/create from #B3D9FF
          300: "#91cbff",
          400: "#5eaefc",
          500: "#388cf9",
          600: "#226dee",
          700: "#1a58db",
          800: "#1c47b1",
          900: "#1c3f8c",
          950: "#162755",
        },
        pink: "#FF9ECF",
        gold: "#BC812E",
        black: "#0D0C0C", // todo: really? everywhere?
        neutral: {
          0: "#F2F0ED",
          50: "#EBE8E5",
          100: "#E4E0DC",
          200: "#CFC9C2",
          300: "#8C877D",
          400: "#595650",
          500: "#383432",
          600: "#2A2726",
          700: "#1E1C1B",
          800: "#181717",
          900: "#141312",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
