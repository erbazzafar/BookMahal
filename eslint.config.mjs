import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next.js recommended + TypeScript support
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom rule overrides
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Disallow usage of the `any` type
      "@typescript-eslint/no-explicit-any": "error",

      // Disallow empty interfaces
      "@typescript-eslint/no-empty-object-type": "error",

      // Disallow unused variables
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],

      // Use const if variable is never reassigned
      "prefer-const": "warn",
    },
  },
];