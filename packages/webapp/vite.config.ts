import path from "node:path"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import Icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"
import biomePlugin from "./biome-save-unsafe"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    biomePlugin(),

    TanStackRouterVite(),
    react(),
    checker({
      typescript: true,
    }),
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ["./src/routes/icon-gallery"],
    },
  },
})
