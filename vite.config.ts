import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the output folder that `npm run publish` uploads to surge.
    outDir: 'build',
    // Previously set via .browserslistrc ("ios 11.3").
    target: 'safari11',
  },
  test: {
    environment: 'jsdom',
    pool: 'vmThreads',
    globals: true,
    mockReset: true,
  },
  fmt: {
    printWidth: 80,
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    options: { typeAware: true, typeCheck: true },
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
      // Ported from the previous Biome config.
      'no-extra-boolean-cast': 'error',
      'no-lone-blocks': 'error',
      'no-useless-concat': 'error',
      'no-unneeded-ternary': 'error',
      'no-void': 'error',
      'no-regex-spaces': 'error',
      'no-sequences': 'error',
      'no-constant-condition': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-obj-calls': 'error',
      'no-inner-declarations': 'error',
      'no-use-before-define': ['error', { functions: false, variables: false }],
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'no-eval': 'error',
      'no-param-reassign': 'error',
      yoda: 'error',
      curly: 'error',
      'no-lonely-if': 'error',
      'unicorn/new-for-builtins': 'error',
      'default-case': 'error',
      'operator-assignment': 'error',
      'no-array-constructor': 'error',
      'no-ex-assign': 'error',
      'no-console': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-duplicate-case': 'error',
      'no-dupe-keys': 'error',
      'no-empty': 'error',
      'no-fallthrough': 'error',
      'no-func-assign': 'error',
      'no-label-var': 'error',
      'no-redeclare': 'error',
      'no-self-compare': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-with': 'error',
      // noUselessUndefinedInitialization
      'unicorn/no-useless-undefined': [
        'error',
        { checkArguments: false, checkArrowFunctionBody: false },
      ],
      // useLiteralKeys
      'dot-notation': 'error',
      'no-useless-computed-key': 'error',
      // useSingleVarDeclarator
      'one-var': ['error', 'never'],
      // noDuplicateParameters: no rule needed, duplicate parameters are a
      // syntax error in ES modules and fail `vp check` at parse time.
    },
    env: { browser: true },
    overrides: [
      {
        files: ['src/**/*.spec.jsx'],
        env: { vitest: true },
      },
      {
        files: ['src/registerServiceWorker.js', 'src/helpers.ts'],
        rules: { 'no-console': 'off' },
      },
    ],
  },
})
