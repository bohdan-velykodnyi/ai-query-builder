module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'root',
  ],
  ignorePatterns: ['next.config.js'],
  overrides: [
    {
      /** Next.js specific files used only with default export */
      files: [
        'page.tsx',
        'layout.tsx',
        '[*].tsx',
        'not-found.tsx',
        'error.tsx',
      ],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
  ],
  rules: {
    'no-console': 'warn',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'react/no-unescaped-entities': 0,
  },
};
