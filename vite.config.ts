
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: '/', // Ensure the base path is set correctly
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Disable minification for debugging if needed
    // minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'development',
    // Generate smaller chunks and handle large dependencies better
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@/components/ui'],
          motion: ['framer-motion'],
          utils: ['@/lib/utils'],
          charts: ['recharts']
        },
        // Ensure assets have consistent naming patterns
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Increase memory limit for build process
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
}));

