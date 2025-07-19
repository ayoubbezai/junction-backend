import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import lingoCompiler from "lingo.dev/compiler";

// https://vite.dev/config/
const viteConfig = {
  plugins: [react(), tailwindcss()],
  // Your existing Vite configuration
};

export default defineConfig(() =>
  lingoCompiler.vite({
    sourceRoot: "src",
    targetLocales: ["en", "fr", "ar"],
    models: "lingo.dev",
  })(viteConfig)
);
