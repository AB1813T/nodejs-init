import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testMatch: ['**/src/tests/**/*.test.ts'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  testTimeout: 30000, 
};

export default config;