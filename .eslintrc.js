const WARN_IN_DEV = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  extends: ['synacor', 'airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': WARN_IN_DEV,
    // Allow hidden functions
    "no-underscore-dangle": [WARN_IN_DEV, { "allowAfterThis": true }],
    // Let git handle the linebreaks instead.
    'linebreak-style': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.{js,jsx}', '**/__mocks__/*.{js,jsx}'],
      env: {
        jest: true,
      },
      rules: {
        // Allow hidden functions for testing
        "no-underscore-dangle": 'off',
      }
    },
  ],
};
