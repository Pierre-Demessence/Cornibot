module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": process.env.NODE_ENV !== "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        args: "after-used",
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": [
      "warn",
      {
        ignoreRestArgs: false
      }
    ]
  },
  env: {
    node: true,
    mocha: true,
    mongo: true
  },
  overrides: [
    {
      files: ["**/__tests?__/*.{j,t}s?(x)"],
      env: {
        mocha: true
      }
    }
  ]
};
