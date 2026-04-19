import { defineConfig } from "cypress";
import { resolveApiUrl, resolveFrontendUrl } from "./src/config/runtimeUrls.mjs";

export default defineConfig({
  allowCypressEnv: false,
  apiUrl: resolveApiUrl(process.env.CYPRESS_API_URL || process.env.VITE_API_URL),
  e2e: {
    baseUrl: resolveFrontendUrl(process.env.CYPRESS_BASE_URL),
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});
