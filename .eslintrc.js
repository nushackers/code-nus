const WARN_IN_DEV = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  extends: ['synacor', 'airbnb', 'prettier'],
  plugins: ['prettier'],
  rules: {
    // Allow hidden functions
    'no-underscore-dangle': [WARN_IN_DEV, { allowAfterThis: true }],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    // Let git handle the linebreaks instead.
    'linebreak-style': 'off',
    'react/prefer-stateless-function': 'off',
    'prettier/prettier': WARN_IN_DEV,
  },
  settings: {
    react: {
      pragma: 'h',
    },
  },
  overrides: [
    {
      files: ['**/*.test.{js,jsx}', '**/__mocks__/*.{js,jsx}'],
      env: {
        jest: true,
      },
      rules: {
        // Allow hidden functions for testing
        'no-underscore-dangle': 'off',
      },
    },
  ],
};
