import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  esbuild: {
    target: 'es2020',
    supported: {
      'top-level-await': true,
    },
  },
});
