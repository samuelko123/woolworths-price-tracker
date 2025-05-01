import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    watch: false,
    globals: true,
    setupFiles: ["./test/server.ts"],
  },
});
