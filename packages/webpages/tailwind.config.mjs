/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      boxShadow: {
        borderNdFlat: "0 0 0 0.5px #e4e5e9, 0 0 0 3.5px #f9f9fb",
        borderNdFlatElevated:
          "0 0 0 0.5px #e4e5e9, 3px 3px 0 3.5px rgba(0,0,0,0.03), 0 0 0 3.5px #f9f9fb",
      },
      fontFamily: {
        satoshi:
          'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        tex: '"Tex Gyre Heros", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  // safelist: [
  //   {
  //     pattern: /.src/,
  //     variants: ['sm', 'md', 'lg', 'xl', '2xl']
  //   },
  // ]
}
