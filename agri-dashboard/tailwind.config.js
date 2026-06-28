/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        s1: "#16a34a",
        s2: "#ca8a04",
        nclass: "#dc2626",
        kuat: "#16a34a",
        lemah: "#ca8a04",
      },
    },
  },
  plugins: [],
};
