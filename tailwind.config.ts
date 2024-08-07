import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-raleway)"],
      serif: ["var(--font-playfair-display)"],
    },
    extend: {
      backgroundImage: {
        "discount-banner":
          "linear-gradient(to right, rgba(255, 251, 235, 0.15), rgba(255, 251, 235, 0.15)), url('/images/jewelry.jpg')",
      },
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
        "dt-lg": { max: "1800px" },
        dt: { max: "1540px" },
        "dt-sm": { max: "1344px" },
        "tab-xl": { max: "1200px" },
        "tab-lg": { max: "1072px" },
        tab: { max: "944px" },
        "mob-lg": { max: "704px" },
        mob: { max: "544px" },
        "mob-sm": { max: "440px" },
      },
      boxShadow: {
        form: "0 0 6px rgba(0, 0, 0, 0.125)",
        button: "inset 0 0 0 2px rgb(39, 39, 42, 1)",
        "button-hover": "inset 0 0 0 2px rgb(161, 161, 170, 1)",
      },
    },
  },
  plugins: [
    function ({ addVariant }: any) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
      addVariant("child-focus", "& > *:focus");
      addVariant("hover-child", "&:hover > *");
      addVariant("focus-child", "&:focus > *");
    },
  ],
};
export default config;
