const { nextui } = require("@nextui-org/react");
const path = require('path');

const themePkg = require.resolve('@nextui-org/theme/package.json');
const themePath = path.resolve(themePkg, '..', 'dist/**/*.{js,ts,jsx,tsx}')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    themePath,
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui(),
    require('@tailwindcss/typography'),
  ],
}

