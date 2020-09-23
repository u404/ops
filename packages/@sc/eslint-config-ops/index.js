"use strict"

module.exports = {
  extends: ["eslint-config-ali/react"].map(require.resolve),
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    ecmaFeatures: {
      impliedStrict: false,
      modules: false,
    },
  },
  rules: {
    "new-cap": "off",
    "require-yield": "off",
    "import/no-dynamic-require": "off",
    strict: "off",
    "class-methods-use-this": "off",
    "no-console": "off",
    "react/no-danger": "off",
    "react/prop-types": "off",
    "no-param-reassign": "off",
    "react/forbid-prop-types": ["warn", { forbid: ["any"] }],
    "react/sort-comp": "off",
    "react/require-default-props": "off",
    "react/jsx-no-bind": "off",
    "require-atomic-updates": "off",
    "no-misleading-character-class": "off",
    "no-async-promise-executor": "off",
    "no-plusplus": "off",
    "max-len": "off",
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    semi: [
      "error",
      "never",
    ],
  },
  globals: {
    __DEV__: true,
  },
}
