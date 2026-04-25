import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactNative from 'eslint-plugin-react-native';
import globals from 'globals';

import js from '@eslint/js';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserTypeScript from '@typescript-eslint/parser';

export default [
  pluginReactHooks.configs.flat.recommended,
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: [
      'node_modules/**',
      'android/**',
      'ios/**',
      'build/**',
      'dist/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
    },
    rules: {
      ...pluginTypeScript.configs.recommended.rules,
      // TypeScript custom rules
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      semi: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-require-imports': [
        'warn',
        {
          allow: ['@assets/.*'],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        __DEV__: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        React: 'readonly',
        JSX: 'readonly',
        NodeJS: 'readonly',
        jest: 'readonly',
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: pluginReact,
      'react-native': pluginReactNative,
      import: pluginImport,
    },
    rules: {
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'error',
      'react-native/no-single-element-style-arrays': 'error',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/refs': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/preserve-manual-memoization': 'off',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react/jsx-no-bind': 'off',

      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Text', 'Button', 'TextInput'],
              message: 'Please import component from @components instead.',
            },
          ],
        },
      ],
      'import/order': [
        'warn',
        {
          groups: ['external', 'builtin', 'internal', 'parent', 'sibling', 'index'],
          warnOnUnassignedImports: true,
        },
      ],
      'import/no-cycle': [
        'warn',
        {
          ignoreExternal: true,
        },
      ],

      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off',
      'no-case-declarations': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      semi: ['error', 'always'],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/__mocks__/**'],
    languageOptions: {
      globals: {
        ...globals.jest,
        jest: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
