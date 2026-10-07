import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // e2e/ holds Playwright specs, run with `npm run test:e2e`.
  test: { environment: "node", exclude: ["**/node_modules/**", "e2e/**"] },
});
