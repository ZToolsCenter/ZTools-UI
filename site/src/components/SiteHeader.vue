<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useColorScheme } from '../../../composables'
import { applyOsClass } from 'ztools-ui-utils/themeUtils'

const logoUrl = new URL('../../../assets/image/logo.png', import.meta.url).href
const route = useRoute()

// Initialize theme so components using useColorScheme / useZtoolsTheme work
applyOsClass('win32')
const { isDark } = useColorScheme()

function toggleTheme() {
  ;(window as typeof window & { __toggleDocsTheme?: () => void }).__toggleDocsTheme?.()
}

const navItems = [
  { path: '/', label: '首页' },
  { path: '/docs', label: '文档' },
  { path: '/components', label: '组件' }
]
</script>

<template>
  <header class="site-header">
    <div class="header-left">
      <router-link to="/" class="logo" aria-label="ZTools UI">
        <img class="logo-image" :src="logoUrl" alt="ZTools UI" />
      </router-link>
      <nav class="nav-links">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: route.path === item.path || (item.path !== '/' && route.path.startsWith(item.path)) }"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </div>
    <button
      class="theme-toggle"
      type="button"
      :aria-label="isDark ? '切换为亮色主题' : '切换为暗色主题'"
      :title="isDark ? '切换为亮色主题' : '切换为暗色主题'"
      @click="toggleTheme"
    >
      {{ isDark ? 'Light' : 'Dark' }}
    </button>
  </header>
</template>

<style scoped>
.site-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color);
  flex-shrink: 0;
  user-select: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.logo-image {
  width: 32px;
  height: 32px;
  display: block;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.15s;
}

.nav-link:hover {
  background: var(--hover-bg);
  color: var(--text-color);
}

.nav-link.active {
  background: var(--active-bg);
  color: var(--primary-color);
}

.theme-toggle {
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.theme-toggle:hover {
  border-color: var(--primary-color);
  background: var(--hover-bg);
  color: var(--primary-color);
}
</style>
