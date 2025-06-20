import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    watch: false,
    globals: true,
    setupFiles: ["./test/helper/msw.ts", "./test/mocks/logger.ts"],
  },
});
