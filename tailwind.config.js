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
        sky: "#B3D9FF",
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
