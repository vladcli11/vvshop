import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist", "node_modules"] },

  // 🔹 React + browser files (frontend)
  {
    files: ["src/**/*.{js,jsx}", "components/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // 🔸 Firebase Functions (CommonJS, Node backend)
  {
    files: ["functions/**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script", // 🔧 CommonJS
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
