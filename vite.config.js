import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

  return {
    base: isGithubActions ? '/web-giang-aluminum/' : '/',
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
  };
});
