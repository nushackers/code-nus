const WARN_IN_DEV = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': WARN_IN_DEV,
  },
};
