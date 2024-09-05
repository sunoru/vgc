import typescriptEslint from '@typescript-eslint/eslint-plugin'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '**/dist/',
      '**/src-capacitor/',
      '**/src-cordova/',
      '**/.quasar/',
      '**/node_modules/',
      '**/eslint.config.mjs',
      '**/src-ssr/',
      'frontend/public/deps/',
    ],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-essential', 'prettier'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      vue,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...vue.environments['setup-compiler-macros']['setup-compiler-macros'],
        ga: 'readonly',
        cordova: 'readonly',
        __statics: 'readonly',
        __QUASAR_SSR__: 'readonly',
        __QUASAR_SSR_SERVER__: 'readonly',
        __QUASAR_SSR_CLIENT__: 'readonly',
        __QUASAR_SSR_PWA__: 'readonly',
        process: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
      },

      ecmaVersion: 5,
      sourceType: 'commonjs',

      parserOptions: {
        parser: '/Users/si/donotbackup/pro/vgc/node_modules/@typescript-eslint/parser/dist/index.js',
        extraFileExtensions: ['.vue'],
      },
    },

    rules: {
      'prefer-promise-reject-errors': 'off',

      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
        },
      ],

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-unused-vars': 'off',
      'no-debugger': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
]
