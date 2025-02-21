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
        "custom-yellow": "#FFF4C0",
        "custom-orange": "#FFD0A8",
        "custom-red": "#FFA4A4",
        "custom-violet": "#CCC5FF",
        "custom-blue": "#A2EBFC",
        "custom-green": "#A2F9BC",
        "custom-utad-logo": "#0E50FC",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontWeight: {
        700: "700",
        800: "800",
      },
    },
  },
  plugins: [],
};

export default config;