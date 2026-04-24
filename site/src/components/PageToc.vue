<script setup lang="ts">
defineProps<{
  items: { id: string; label: string; level: number }[]
  activeId: string
}>()

const emit = defineEmits<{
  (e: 'click', id: string): void
}>()
</script>

<template>
  <nav v-if="items.length" class="page-toc">
    <div class="toc-title">目录</div>
    <a
      v-for="item in items"
      :key="item.id"
      class="toc-item"
      :class="{ active: activeId === item.id }"
      :style="{ paddingLeft: `${8 + (item.level - 1) * 12}px` }"
      @click="emit('click', item.id)"
    >
      {{ item.label }}
    </a>
  </nav>
</template>

<style scoped>
.page-toc {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-title {
  padding: 4px 8px 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--site-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toc-item {
  display: block;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 12px;
  color: var(--site-text-muted);
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-item:hover {
  color: var(--primary-color);
  background: var(--site-panel-hover-bg);
}

.toc-item.active {
  color: var(--primary-color);
  font-weight: 500;
  background: var(--site-panel-muted-bg);
}
</style>
