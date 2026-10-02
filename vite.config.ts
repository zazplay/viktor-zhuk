import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run build:single` sets this: everything, images and the 3D chunk included, goes into one script.
const single = process.env.SINGLE_FILE === '1';

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs, so the build works under GitHub Pages' /businesscard/ path and at a domain root alike.
  base: './',
  build: {
    // three.js is the one large chunk, and it only loads with the 3D models.
    chunkSizeWarningLimit: single ? 4000 : 600,
    ...(single && {
      outDir: 'dist-single',
      assetsInlineLimit: Number.POSITIVE_INFINITY,
      rolldownOptions: { output: { inlineDynamicImports: true } },
    }),
  },
});
