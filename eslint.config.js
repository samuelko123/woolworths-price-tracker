import stylistic from "@stylistic/eslint-plugin";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import airbnbBaseConfig from "eslint-config-airbnb-base";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import vitest from "@vitest/eslint-plugin";
import importPlugin from "eslint-plugin-import";

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
      import: importPlugin,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      "@stylistic": stylistic,
    },
    rules: {
      // Airbnb + TypeScript
      ...airbnbBaseConfig.rules,
      ...tsPlugin.configs["eslint-recommended"].rules,
      ...tsPlugin.configs["recommended"].rules,

      // General
      "no-console": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
      "eol-last": ["error", "always"],

      // TypeScript
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": "off", // replaced by unused-imports

      // Import cleanup
      "no-duplicate-imports": "error",
      "import/no-duplicates": "error",

      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Unused imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
        },
      ],

      // Path restrictions
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["*src*"],
              message: "Please use path alias '@/...' instead of 'src/...'",
            },
          ],
        },
      ],

      // Styling
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
    },
  },

  // Test-specific rules
  {
    files: ["**/*.test.ts", "**/test/**/*.ts"],
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/no-importing-vitest-globals": ["error"],
      "vitest/expect-expect": [
        "error",
        {
          assertFunctionNames: ["expect*"],
        },
      ],
    },
  },
];
