import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,cjs}"], // only js and cjs files
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",  // ✅ CommonJS (require/module.exports)
      globals: {
        ...globals.node,       // ✅ Enable Node.js globals like require, module
      },
    },
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-undef": "error",        // ❌ Throw error for undefined variables
      "no-unused-vars": "warn",   // ⚠️ Warn if variable is declared but not used
      "no-console": "off",        // Allow console.log for debugging
    },
  },
]);
