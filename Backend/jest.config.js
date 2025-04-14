module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    setupFiles: ['<rootDir>/app/tests/jest.setup.js'],
    verbose: true
  };
  