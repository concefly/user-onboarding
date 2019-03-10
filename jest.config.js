const {
  join
} = require('path');

module.exports = {
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  coverageDirectory: '<rootDir>/../coverage',
  // setupFiles: ['<rootDir>/__mocks__/windowMock.ts'],
  rootDir: join(process.cwd(), 'src'),
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // https://github.com/facebook/jest/issues/6766
  testURL: 'http://localhost/',

  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },

  verbose: true,
};