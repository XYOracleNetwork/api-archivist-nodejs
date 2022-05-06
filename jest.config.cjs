const generateJestConfig = ({ esModules }) => {
  const esModuleslist = Array.isArray(esModules) ? esModules.join('|') : esModules
  return {
    coverageThreshold: {
      global: {
        branches: 50,
        functions: 80,
        lines: 70,
        statements: 70,
      },
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      },
    },
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    preset: 'ts-jest/presets/default-esm',
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['jest-sorted'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    testTimeout: 15000,
    transform: {
      [`(${esModuleslist}).+\\.js$`]: 'babel-jest',
      '^.+\\.tsx?$': 'ts-jest',
    },
    transformIgnorePatterns: [`./node_modules/(?!${esModuleslist})`],
  }
}

module.exports = generateJestConfig({ esModules: ['is-ip', 'ip-regex'] })
