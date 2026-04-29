import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import UnoCSS from 'unocss/vite'

const resolvePath = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    dts({
      tsconfigPath: resolvePath('./tsconfig.json'),
      outDir: 'dist',
      insertTypesEntry: false,
      rollupTypes: false,
      copyDtsFiles: true,
      exclude: ['site']
    })
  ],
  build: {
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolvePath('./index.ts'),
        resolver: resolvePath('./resolver.ts')
      },
      formats: ['es'],
      fileName: (_format, entryName): string => `${entryName}.js`,
      cssFileName: 'style'
    },
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        assetFileNames: (assetInfo): string => {
          if (assetInfo.name === 'style.css') {
            return 'style.css'
          }

          return 'assets/[name][extname]'
        }
      }
    }
  }
})
