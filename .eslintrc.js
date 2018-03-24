module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  rules: {
    'no-use-before-define': ['error', 'nofunc'],
    'react/prop-types': 'error',
    'react/jsx-filename-extension': 'off',
    'no-debugger': 'warn',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  },
  env: {
    browser: true,
  },
};
