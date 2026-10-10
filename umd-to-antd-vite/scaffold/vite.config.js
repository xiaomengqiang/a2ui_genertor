import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    react(),
    {
      name: 'icon-api-base-transform',
      enforce: 'pre',
      transform(code, id) {
        if (id.includes('shared/Icon/Icon.jsx')) {
          return code.replace(
            /const\s+ICON_API_BASE\s*=\s*["']https:\/\/octo\.hdesign\.huawei\.com["']/,
            'const ICON_API_BASE = ""'
          );
        }
      }
    }
  ],
  server: {
    proxy: {
      '/assetRepository': {
        target: 'https://octo.hdesign.huawei.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});