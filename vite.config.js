import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Use GITHUB_ACTIONS environment variable to set base path for GitHub Pages
  base: '/web-giang-aluminum/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Other pages temporarily disabled to allow successful builds until they are uploaded
      },
    },
  },
});
