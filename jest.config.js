/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@controllers/(.*)": "<rootDir>/src/controllers/$1",
    "@infrastructure/(.*)": "<rootDir>/src/infrastructure/$1",
    "@core/(.*)": "<rootDir>/src/core/$1",
    "@config/(.*)": "<rootDir>/src/config/$1",
  },
  setupFiles: ["dotenv/config"],
};