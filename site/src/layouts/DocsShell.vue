<script setup lang="ts">
import { ref } from 'vue'
import SidebarMenu from '../components/SidebarMenu.vue'
import PageToc from '../components/PageToc.vue'

export interface SidebarItem {
  id: string
  label: string
  zhName?: string
  enName?: string
  children?: { id: string; label?: string; zhName?: string; enName?: string }[]
}

defineProps<{
  sidebarItems: SidebarItem[]
  activeId?: string  // 可选，用于非组件文档页
  tocItems: { id: string; label: string; level: number }[]
  tocActiveId: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'toc-click', id: string): void
}>()

const mainRef = ref<HTMLElement | null>(null)

defineExpose({
  mainRef
})
</script>

<template>
  <div class="docs-shell">
    <aside class="docs-sidebar">
      <SidebarMenu :items="sidebarItems" :active-id="activeId" @select="emit('select', $event)" />
    </aside>
    <main ref="mainRef" class="docs-main">
      <slot />
    </main>
    <aside class="docs-toc">
      <PageToc :items="tocItems" :active-id="tocActiveId" @click="emit('toc-click', $event)" />
    </aside>
  </div>
</template>

<style scoped>
.docs-shell {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  background: var(--site-bg);
  color: var(--site-text);
}

.docs-sidebar {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid var(--site-border);
  background: var(--site-panel-bg);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 0;
}

.docs-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 32px;
  min-width: 0;
  background: var(--site-bg);
}

.docs-toc {
  width: 180px;
  flex-shrink: 0;
  border-left: 1px solid var(--site-border);
  background: var(--site-panel-bg);
  overflow-y: auto;
  padding: 16px 12px;
}
</style>
