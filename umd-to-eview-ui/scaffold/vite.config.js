import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

function tildeImportPlugin() {
  return {
    name: 'tilde-import',
    resolveId(source) {
      if (source.startsWith('~')) {
        return source.slice(1);
      }
    },
  };
}

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: '$1',
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      }
    ]
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        paths: [path.resolve(__dirname, 'node_modules')],
      },
    },
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
    },
    tildeImportPlugin
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