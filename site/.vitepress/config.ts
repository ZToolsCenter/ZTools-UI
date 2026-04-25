import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import UnoCSS from 'unocss/vite'
import { componentGroups, componentIndex } from '../src/content/components/nav'

const resolvePath = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

const componentSidebar = componentGroups.map((group) => ({
  text: group.label,
  items: componentIndex
    .filter((component) => component.group === group.id)
    .map((component) => ({
      text: `${component.zhName} ${component.enName}`,
      link: `/components/${component.id}`
    }))
}))

export default defineConfig({
  title: 'ZTools UI',
  description: '为 ZTools 插件生态打造的 Vue 3 组件库',
  outDir: '../dist-docs',
  cleanUrls: true,
  head: [['link', { rel: 'icon', type: 'image/png', href: '/image/logo.png' }]],
  markdown: {
    theme: {
      light: 'one-dark-pro',
      dark: 'one-dark-pro'
    }
  },
  themeConfig: {
    logo: '/image/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/introduction' },
      { text: '组件', link: '/components/select' }
    ],
    sidebar: {
      '/docs/': [
        {
          text: '文档',
          items: [
            { text: '介绍', link: '/docs/introduction' },
            { text: '快速上手', link: '/docs/getting-started' },
            { text: '主题系统', link: '/docs/theme' }
          ]
        }
      ],
      '/components/': componentSidebar
    },
    socialLinks: []
  },
  vite: {
    publicDir: resolvePath('../../assets'),
    plugins: [UnoCSS()],
    resolve: {
      alias: {
        '@site': resolvePath('../src'),
        'ztools-ui-lib': resolvePath('../../index.ts'),
        'ztools-ui-components': resolvePath('../../components'),
        'ztools-ui-composables': resolvePath('../../composables'),
        'ztools-ui-utils': resolvePath('../../utils'),
        'ztools-ui-assets': resolvePath('../../assets')
      }
    }
  }
})
