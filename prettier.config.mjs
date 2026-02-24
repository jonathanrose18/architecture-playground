/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  arrowParens: "avoid",
  bracketSpacing: true,
  jsxSingleQuote: true,
  printWidth: 120,
  semi: true,
  singleQuote: true,
  tabWidth: 3,
  trailingComma: "es5",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["cn", "cva", "clsx"],
};

export default config;
