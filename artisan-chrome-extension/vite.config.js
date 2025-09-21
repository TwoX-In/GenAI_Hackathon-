import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "public/manifest.json",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "index.html"),       // your React popup
        background: path.resolve(__dirname, "public/background.js"), // background script
        content: path.resolve(__dirname, "public/content.js"),       // content script
      },
      output: {
        entryFileNames: "[name].js", // ensures background.js, content.js names are preserved
      },
    },
  },
});
