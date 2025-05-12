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
      // Allow usage of the `any` type
      "@typescript-eslint/no-explicit-any": "off",

      // Allow empty interfaces
      "@typescript-eslint/no-empty-object-type": "off",

      // Disallow unused variables, but allow unused arguments if prefixed with _
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // Warn if let can be const
      "prefer-const": "warn",
    },
  },
];