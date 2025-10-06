export default {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/setup.js'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/index.js'
    ],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    },
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
  };