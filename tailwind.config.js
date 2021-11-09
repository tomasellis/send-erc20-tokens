module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        accentPurple: "#F1F8FF",
        bannerPurple: "#4D00B4",
        borderGrey: "#999999",
        textGrey: "#333333",
        lightBlue: "#009AFF",
        lightPurple: "#9013FE",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
