// eslint.config.mjs


import {   typescriptConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  importConfig } from '@xylabs/eslint-config-flat'

export default [
  {
    ignores: ['.yarn/**', '**/dist/**', 'dist', 'build/**', 'node_modules/**', 'public', '.storybook', 'storybook-static', 'eslint.config.mjs', 'coverage'],
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
