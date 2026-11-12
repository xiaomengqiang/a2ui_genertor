import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        paths: [path.resolve('node_modules')],
        plugins: [{
          install(less, pluginManager) {
            const FileManager = less.FileManager;
            class TildeFileManager extends FileManager {
              supports(filename) {
                return filename.startsWith('~');
              }

              supportsSync() {
                return false;
              }

              loadFile(filename, currentDirectory, options, environment) {
                const stripped = filename.replace(/^~/, '');
                return super.loadFile(stripped, currentDirectory, options, environment);
              }
            }

            pluginManager.addFileManager(new TildeFileManager());
          },
          minVersion: [3, 0, 0],
        }],
      }
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
