import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Map the project's "@/*" path alias for tests.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
});
