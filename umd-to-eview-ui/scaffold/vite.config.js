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
    tildeImportPlugin
  ],
  server: {
    proxy: {
      '^/(assetRepository|designAssets)': {
        target: 'https://octo.hdesign.huawei.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});