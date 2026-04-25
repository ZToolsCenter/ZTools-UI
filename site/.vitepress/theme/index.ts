import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import Layout from './Layout.vue'
import { installMock } from '../../src/mocks/ztools'
import 'ztools-ui-assets/styles'
import 'virtual:uno.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp() {
    if (inBrowser) {
      installMock()
    }
  }
} satisfies Theme
