module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2021
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/typescript/recommended',
    '@vue/prettier'
  ],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        bracketSpacing: true,
        trailingComma: 'none'
      }
    ]
  }
};
