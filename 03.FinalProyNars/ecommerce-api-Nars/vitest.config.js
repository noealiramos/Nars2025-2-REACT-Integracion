import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false, // Forzamos imports explícitos según AGENTS.testing.md
    include: ['tests/**/*.test.js'],
    setupFiles: ['./tests/setup.js'],
  },
});
