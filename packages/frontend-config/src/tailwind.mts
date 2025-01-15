import { nextui } from "@nextui-org/react";
import { Config } from "tailwindcss";
import path from "path";
import { fileURLToPath } from "url";
import typography from '@tailwindcss/typography';

const getThemePath = () => {
  const themePkg = fileURLToPath(import.meta.resolve('@nextui-org/theme/package.json'));
  return path.resolve(themePkg, '..', 'dist/**/*.{js,ts,jsx,tsx}')
}

const getFrontendPath = () => {
  const pkg = fileURLToPath(import.meta.resolve('@bitler/frontend/package.json'));
  return path.resolve(pkg, '..', 'dist/**/*.{js,ts,jsx,tsx}')
}

type CreateTailwindConfigOptions = {
  frontendPath?: string;
}
const createTailwindConfig = ({
  frontendPath = getFrontendPath(),
}: CreateTailwindConfigOptions): Config => ({

  content: [
    getThemePath(),
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
})

export { createTailwindConfig, type CreateTailwindConfigOptions }
