import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base path reset to root for local development
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        projects: resolve(__dirname, 'projects.html'),
        services: resolve(__dirname, 'services.html'),
      },
    },
  },
});
