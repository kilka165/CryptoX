import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    // 👇 Мы явно указываем папку app и components
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // На всякий случай добавим и src, если он вдруг появится
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
