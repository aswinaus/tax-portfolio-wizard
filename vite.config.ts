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
    sourcemap: mode === 'development',
    // Improved chunking strategy
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Put react and react-dom in the vendor chunk
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          
          // Group router-related packages
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          
          // Group UI component libraries
          if (id.includes('node_modules/@radix-ui') || 
              id.includes('node_modules/framer-motion')) {
            return 'vendor-ui';
          }
          
          // Other node_modules go to vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Ensure assets have consistent naming patterns
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Reduce chunk size
    chunkSizeWarningLimit: 1000,
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
    // Add explicit extensions to resolve
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  // Increase memory limit for build process
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
}));
