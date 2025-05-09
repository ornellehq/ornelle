/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../webui-library/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1800px",
    },
    extend: {
      colors: {
        purpleX11: "#923ef4",
      },
      fontFamily: {
        dm: [
          "DMSans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "'Apple Color Emoji'",
          "'Segoe UI Emoji'",
          "'Segoe UI Symbol'",
          "'Noto Color Emoji'",
        ],
        tex: [
          "'Tex Gyre Heros'",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "'Apple Color Emoji'",
          "'Segoe UI Emoji'",
          "'Segoe UI Symbol'",
          "'Noto Color Emoji'",
        ],
        satoshi: [
          "Satoshi Variable",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "'Apple Color Emoji'",
          "'Segoe UI Emoji'",
          "'Segoe UI Symbol'",
          "'Noto Color Emoji'",
        ],
      },
      fontSize: {
        smr: "13px",
      },
      boxShadow: {
        smallBottom:
          "0px 2px 0.5px rgba(0,0,0,0.02), 0px 2px 0px rgba(0,0,0,0.05)",
        borderNdFlat: "0 0 0 0.5px #e4e5e9, 0 0 0 3.5px #f9f9fb",
      },
      height: {
        144: "36rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-react-aria-components"),
  ],
}
