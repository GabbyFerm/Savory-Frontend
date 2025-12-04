/* eslint flat config (no "extends") — replace the existing file at the repo root */
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // Ignore build folders and deps
  {
    ignores: ["dist", "node_modules", ".vite", "public"],
  },

  // Apply to JS/TS/JSX/TSX source files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        // project: "./tsconfig.json", // enable only if you need type-aware rules
      },
      globals: globals.browser,
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
    },

    settings: {
      react: { version: "detect" },
    },

    rules: {
      // Prettier integration via plugin (no eslint-config-prettier extends)
      "prettier/prettier": "warn",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React refresh helper (same option you used previously)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true, allowExportNames: ["useAuth"] },
      ],

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Add or tweak other rules here as needed...
    },
  },

  // Node / CommonJS files (if you have any)
  {
    files: ["**/*.cjs"],
    languageOptions: {
      globals: globals.node,
    },
  },
];
