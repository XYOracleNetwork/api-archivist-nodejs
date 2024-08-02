// eslint.config.mjs

import { config as xylabsConfig } from '@xylabs/eslint-config-flat'

export default [
  {
    ignores: ['.yarn/**', 'jest.config.cjs', '**/dist/**', 'dist', 'build/**', 'coverage', 'node_modules/**'],
  },
  ...xylabsConfig,
  {
    rules: {},
  },
]
