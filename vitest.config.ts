// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/node_modules/**', '**/dist/**', 'src/databases', 'src/interfaces', 'src/index.ts', 'src/knexfile.ts', '.eslintrc.js'],
      provider: 'v8', // or 'v8'
      reporter: ['text', 'html']
    }
  }
})
