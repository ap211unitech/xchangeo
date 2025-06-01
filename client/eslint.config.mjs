import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "./prettier.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: false,
});

const eslintConfig = [
  // Manually define all required plugins
  {
    plugins: {
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
      prettier,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Next.js config with manual override
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Your custom rules
  {
    rules: {
      // Single source of truth for Prettier rules
      "prettier/prettier": ["error", prettierConfig],

      semi: ["error"],
      "no-unused-vars": ["error"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@next/next/no-html-link-for-pages": "error",
    },
  },
];

export default eslintConfig;
