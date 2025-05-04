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
        "custom-gray": "#6F7276",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        /**
         * font-thin (100)
         * font-light (300)
         * font-normal (400)
         * font-medium (500)
         * font-semibold (600)
         * font-bold (700)
         * font-extrabold (800)
         * font-black (900)
         */
      },
    },
  },
  plugins: [],
};

export default config;
