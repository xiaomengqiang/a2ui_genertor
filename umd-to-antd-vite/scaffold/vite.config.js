import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'icon-api-base-transform',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('.jsx') || id.endsWith('.js')) {
          if (code.includes('ICON_API_BASE') && code.includes('octo.hdesign.huawei.com')) {
            return code.replace(
              /const\s+ICON_API_BASE\s*=\s*["']https:\/\/octo\.hdesign\.huawei\.com["']/,
              'const ICON_API_BASE = ""'
            );
          }
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
