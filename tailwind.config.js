module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      accentPurple: "#F1F8FF",
      bannerPurple: "#4D00B4",
      borderGrey: "#999999",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
