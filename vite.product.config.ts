import { defineConfig } from "vite";

const inputFile = "./src/product-fetching-lambda/handler.ts";
const outputFile = "product-fetching-lambda.js";

export default defineConfig({
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
