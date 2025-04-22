
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
  build: {
    // Habilita a minificação para produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console logs em produção
        drop_debugger: true
      }
    },
    // Split chunks para melhor cache
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-tabs'],
          charts: ['recharts'],
          maps: ['leaflet']
        }
      }
    },
    // Pré-carregamento de recursos críticos
    assetsInlineLimit: 4096, // Inline pequenos assets
    cssCodeSplit: true,
    sourcemap: false
  },
  // Otimiza as dependências
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lovable-tagger'] // Excluir do pacote de otimização
  }
}));
