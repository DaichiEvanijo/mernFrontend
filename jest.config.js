export default {
  
  // テスト対象のファイルを指定
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  
  // TypeScript をサポートする
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  // 使用するテスト環境
  testEnvironment: "jsdom",

  // jest.setup.ts ファイルが、すべてのテストが実行される前に呼び出される
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // カバレッジ取得対象
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};
