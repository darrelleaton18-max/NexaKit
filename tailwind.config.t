import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors"; // Make sure to import colors at the top!

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // OVERRIDE OLD COLORS: 
        // This instantly changes all 30+ tools without editing their files
        slate: colors.neutral, 
        blue: colors.orange,
        sky: colors.amber,
      },
    },
  },
  plugins: [],
};
export default config;