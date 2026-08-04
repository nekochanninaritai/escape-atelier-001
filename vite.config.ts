import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryBase = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  plugins: [react()],
  base: repositoryBase,
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
