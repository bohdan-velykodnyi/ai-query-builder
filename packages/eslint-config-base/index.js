module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'root',
  ],
  rules: {
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
  },
};
