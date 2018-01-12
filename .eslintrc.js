module.exports = {
  extends: 'airbnb',
  rules: {
    'no-use-before-define': ['error', 'nofunc'],
    'react/prop-types': 'error',
    'react/jsx-filename-extension': 'off',
  },
  env: {
    browser: true,
  },
};
