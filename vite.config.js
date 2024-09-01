import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/reportApi': {
        target: 'http://127.0.0.1:9003',
        secure: false,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/reportApi/, ''),
      }
    }
  },
  build: {
    outDir: 'docs'
  },
  // base: '/vision-report/',
  // productionSourceMap: false,
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    createHtmlPlugin({
      inject: {
        data: {
          buildTime: new Date().toLocaleString()
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})