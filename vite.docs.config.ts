import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

const resolvePath = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  root: resolvePath('./site'),
  publicDir: resolvePath('./assets'),
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@site': resolvePath('./site/src'),
      'ztools-ui-lib': resolvePath('./index.ts'),
      'ztools-ui-components': resolvePath('./components'),
      'ztools-ui-composables': resolvePath('./composables'),
      'ztools-ui-utils': resolvePath('./utils'),
      'ztools-ui-assets': resolvePath('./assets')
    }
  },
  server: {
    port: 5180,
    open: true
  },
  build: {
    outDir: resolvePath('./dist-docs'),
    emptyOutDir: true
  }
})
