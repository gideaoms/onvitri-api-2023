import { defineConfig } from 'vitest/config'
import configPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [configPaths()],
  test: {
    setupFiles: ['src/tests/setup.ts'],
  },
})
