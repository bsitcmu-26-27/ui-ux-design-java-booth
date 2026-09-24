import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const rawRoot = process.env.PUBLIC_URL_ROOT || "";
if (!rawRoot.trim()) {
  throw new Error(
    "Hello! I am a friendly entity! Despite being me in red i swear this one is an easy fix!\n If your on linux then just set the `PUBLIC_URL_ROOT` environment variable to whichever booth we are working with right now. if your on windows then please read the readme on how to set the enviroment variable. Peace out! 😇✌",
  );
}

const publicUrlRoot = rawRoot ? `/${rawRoot.replace(/^\/|\/$/g, "")}/` : "/";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  base: publicUrlRoot,
  build: {
    outDir: rawRoot ? rawRoot.replace(/^\/|\/$/g, "") : "dist",
  },
  define: {
    __PUBLIC_URL_ROOT__: JSON.stringify(publicUrlRoot),
  },
});
