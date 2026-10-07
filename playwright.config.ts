import { defineConfig } from "@playwright/test";

const PORT = 3100;

// Browser checks that unit tests can't cover (layout/responsiveness).
// Uses the locally installed Chrome, so no browser download is needed.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
  },
  // A dedicated dev server with its own port and build folder, so running the
  // tests never interferes with your own `npm run dev` (or `npm run build`).
  webServer: {
    command: `next dev -p ${PORT}`,
    env: { NEXT_DIST_DIR: ".next-e2e" },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
