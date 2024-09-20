// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  maxWorkers: 1, // Run tests serially
};