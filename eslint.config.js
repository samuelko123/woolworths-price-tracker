import stylistic from "@stylistic/eslint-plugin";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import airbnbBaseConfig from "eslint-config-airbnb-base";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaVersion: 2022,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...airbnbBaseConfig.rules,
      ...tsPlugin.configs["eslint-recommended"].rules,
      ...tsPlugin.configs["recommended"].rules,
      "no-console": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
      "eol-last": ["error", "always"],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "inline-type-imports" }]
    },
  },
  {
    files: ["**/*.ts"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["**/*.ts"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
    },
  },
];
