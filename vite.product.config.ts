import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const inputFile = "./src/handler/product-fetching.ts";
const outputFile = "product-fetching-lambda.js";

export default defineConfig({
  plugins: [tsconfigPaths()],
  define: {
    // Tell Vite to leave `process.env` as-is
    "process.env": "process.env",
  },
  build: {
    rollupOptions: {
      input: inputFile,
      output: {
        format: "commonjs",
        entryFileNames: outputFile,
      },
      external: [
        /^@aws-sdk/,
      ],
      preserveEntrySignatures: "strict",
    },
    outDir: "dist",
    emptyOutDir: false,
  },
});
