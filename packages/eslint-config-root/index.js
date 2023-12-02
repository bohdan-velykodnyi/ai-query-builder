module.exports = {
  ignorePatterns: ['.eslintrc.js'],
  plugins: [
    'prettier',
    'unused-imports',
    'no-relative-import-paths',
    'simple-import-sort',
  ],
  extends: ['turbo', 'prettier', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { rootDir: 'src' },
    ],
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'turbo/no-undeclared-env-vars': 'off',
  },
};
