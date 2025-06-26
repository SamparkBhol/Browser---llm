import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint
  .config(
    { ignores: ["dist", "download-model.cjs"] },
    {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ["**/*.{js,jsx}"],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      },
    }
  )
  .concat(prettierRecommended)
  .concat({
    rules: {
      "no-console": ["error", { allow: ["debug"] }],
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          singleQuote: false,
          trailingComma: "es5",
          printWidth: 120,
          ignoreComments: true,
          jsxSingleQuote: false,
          jsxBracketSameLine: true,
        },
      ],
    },
  });
