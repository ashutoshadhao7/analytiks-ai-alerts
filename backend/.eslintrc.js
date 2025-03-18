/*eslint-env es6*/
const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.join(__dirname, '..', 'custom-eslint-rules');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'rulesdir'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    '**/*.json',
    '**/*.sh',
    '**/*.md',
    '**/*.spec.ts',
    'src/database/migrations',
    'src/test/swaggere2e.ts',
    'src/test/**/*.e2e-spec.ts',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/type-annotation-spacing': 'error',
    curly: ['error', 'multi-line'],
    eqeqeq: 'error',
    'no-return-assign': 'error',
    'no-throw-literal': 'error',
    'no-fallthrough': [
      'error',
      { commentPattern: 'break omitted intentionally' },
    ],
    'no-return-await': 'error',
    'no-lonely-if': 'off', //can be used
    'dot-notation': 'warn',
    'max-lines-per-function': ['warn', 45],
    'max-lines': [
      'warn',
      { max: 500, skipBlankLines: true, skipComments: true },
    ],
    'no-console': 'warn',
    'default-case-last': 'error',
    'require-atomic-updates': ['error', { allowProperties: true }],
    'eol-last': 'error',
    'linebreak-style': 'error',
    'no-duplicate-imports': 'error',
    'no-extra-semi': 'error',
    'no-trailing-spaces': 'error',
    'prefer-template': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-await-in-loop': 'warn',
    'array-callback-return': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn', // Ideally be switched to error after usage of any is removed
    '@typescript-eslint/no-unsafe-member-access': 'warn', // Ideally be switched to error after usage of any is removed
    '@typescript-eslint/no-unsafe-return': 'warn', // Ideally be switched to error after usage of any is removed,
    '@typescript-eslint/restrict-template-expressions': [
      'warn',
      { allowBoolean: true, allowNullish: true },
    ], // Ideally be switched to error after usage of any is removed
    '@typescript-eslint/no-unsafe-call': 'warn', // Ideally be switched to error after usage of any is removed
    '@typescript-eslint/no-unsafe-argument': 'warn', // Ideally be switched to error after usage of any is removed
    '@typescript-eslint/explicit-member-accessibility': 'off', // can be error or warn
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    'no-unreachable-loop': 'error',
    'no-template-curly-in-string': 'warn',
    'rulesdir/max-functions-per-class': ['warn', 20], // used for code climate max functions 20 per class
  },
  overrides: [
    {
      files: ['test/**/*'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
  ],
};
