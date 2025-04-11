module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/app/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@services/(.*)': '<rootDir>/app/services/$1',
    '@models/(.*)': '<rootDir>/app/api/$1/Models',
    '@tests/(.*)': '<rootDir>/app/tests/$1'
  },
  moduleDirectories: ['node_modules', 'app'],
  setupFilesAfterEnv: ['<rootDir>/app/tests/setup.ts']
};
  