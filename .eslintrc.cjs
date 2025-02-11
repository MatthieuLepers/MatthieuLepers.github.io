module.exports = {
  root: true,
  env: {
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vue/vue3-essential',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 'latest',
    project: ['tsconfig.app.json'],
    extraFileExtensions: ['.vue'],
  },
  plugins: [
    'vue',
    'import',
    '@typescript-eslint',
  ],
  globals: {
    localStorage: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'tsconfig.app.json',
      },
    },
  },
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'object-curly-newline': ['error', {
      ImportDeclaration: { multiline: true, minProperties: 4 },
    }],
    'no-param-reassign': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', {
      code: 512,
      tabWidth: 2,
    }],
    'semi-style': 'off',
    'class-methods-use-this': 'off',
    'func-names': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-mutating-props': 'off',
  },
};
