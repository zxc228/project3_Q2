/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-black": "#14192C",
        "custom-dark-grey": "#383B42",
        "custom-utad-logo": "#0065EF",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontWeight: {
        400: "400",
        700: "700",
        800: "800",
        900: "900",
      },
    },
  },
  plugins: [],
};

export default config;
