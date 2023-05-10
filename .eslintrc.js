module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
  },
  env: {
    node: true,
  },
};
