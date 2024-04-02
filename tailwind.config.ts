import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: "Raleway, sans-serif",
      serif: "Playfair Display, serif",
    },
    extend: {
      height: {
        screen: "100dvh",
      },
      maxWidth: {
        sixty: "60%",
        seventy: "70%",
        "8xl": "104rem",
        "9xl": "120rem",
      },
      screens: {
        "dt-xl": { min: "2540px" },
        dt: { max: "1540px" },
        "dt-sm": { max: "1344px" },
        "tab-xl": { max: "1200px" },
        "tab-lg": { max: "1072px" },
        tab: { max: "944px" },
        "mob-lg": { max: "704px" },
        mob: { max: "544px" },
        "mob-sm": { max: "440px" },
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
      addVariant("hover-child", "&:hover > *");
      addVariant("focus-child", "&:focus > *");
    },
  ],
};
export default config;
