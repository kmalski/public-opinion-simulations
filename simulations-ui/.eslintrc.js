module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  parserOptions: {
    ecmaVersion: 2021
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', '@vue/typescript/recommended', '@vue/prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        bracketSpacing: true,
        trailingComma: 'none',
        printWidth: 120
      }
    ]
  }
};
