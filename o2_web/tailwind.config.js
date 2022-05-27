module.exports = {
  content: ["./src/index.html", "./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
}
