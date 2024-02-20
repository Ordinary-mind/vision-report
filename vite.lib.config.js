import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  productionSourceMap: false,
  build: {
    sourcemap: false,
    lib: {
      entry: "./src/package/index.js",
      name: "qreport",
      fileName: 'index'
    },
    outDir: './src/package/dist',
    rollupOptions: {
      external: ['vue', 'pinia', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    copyPublicDir: false
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
