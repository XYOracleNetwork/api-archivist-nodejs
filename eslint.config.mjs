// eslint.config.mjs


import {   typescriptConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  importConfig } from '@xylabs/eslint-config-flat'

export default [
  {
    ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'node_modules/**', 'public', '.storybook', 'storybook-static', 'eslint.config.mjs'],
  },
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  {
    ...typescriptConfig,
    rules: {
      ...typescriptConfig.rules,
      '@typescript-eslint/consistent-type-imports': ['warn']
    },
  },
  {
    ...importConfig,
    rules: {
      ...importConfig.rules,
      'import-x/no-cycle': ['warn', { maxDepth: 5 }]
    }
  }
]
