import { nextui } from "@nextui-org/react";
import { Config } from "tailwindcss";
import path from "path";
import { fileURLToPath } from "url";
import typography from '@tailwindcss/typography';


const themePkg = fileURLToPath(import.meta.resolve('@nextui-org/theme/package.json'));
const themePath = path.resolve(themePkg, '..', 'dist/**/*.{js,ts,jsx,tsx}')

const frontendPkg = fileURLToPath(import.meta.resolve('@bitler/frontend/package.json'));
const frontendPath = path.resolve(frontendPkg, '..', 'dist/**/*.{js,ts,jsx,tsx}')

console.log({ themePath, frontendPath })


const tailwindConfig: Config = {
  content: [
    themePath,
    frontendPath,
    "./index.html",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui(),
    typography,
  ],
}

export { tailwindConfig }
