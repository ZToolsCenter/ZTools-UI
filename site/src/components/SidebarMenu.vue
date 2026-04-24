<script setup lang="ts">
import type { SidebarItem } from '../layouts/DocsShell.vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  items: SidebarItem[]
  activeId?: string  // 可选，用于非组件文档页
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const route = useRoute()
const router = useRouter()

// 判断是否当前激活项
function isActive(id: string): boolean {
  // 如果提供了 activeId prop（普通文档页），使用它
  if (props.activeId !== undefined) {
    return props.activeId === id
  }
  // 否则使用路由判断（组件文档页）
  return route.name === 'component-detail' && route.params.componentId === id
}

// 点击导航到指定组件（仅用于组件文档）
function navigateTo(id: string): void {
  router.push({ name: 'component-detail', params: { componentId: id } })
}
</script>

<template>
  <nav class="sidebar-menu">
    <template v-for="group in items" :key="group.id">
      <div v-if="group.children" class="menu-group">
        <div class="menu-group-title">{{ group.label }}</div>
        <!-- 兼容两种格式：组件文档使用 zhName/enName，普通文档使用 label -->
        <template v-if="group.children[0]?.zhName">
          <!-- 组件文档格式 -->
          <router-link
            v-for="child in group.children"
            :key="child.id"
            :to="{ name: 'component-detail', params: { componentId: child.id } }"
            class="menu-item menu-item-component"
            :class="{ active: isActive(child.id) }"
          >
            <span class="menu-item-zh">{{ child.zhName }}</span>
            <span class="menu-item-en">{{ child.enName }}</span>
          </router-link>
        </template>
        <template v-else>
          <!-- 普通文档格式（兼容旧版） -->
          <a
            v-for="child in group.children"
            :key="child.id"
            class="menu-item"
            :class="{ active: false }"
            @click="$emit('select', child.id)"
          >
            {{ child.label }}
          </a>
        </template>
      </div>
      <a
        v-else
        class="menu-item"
        :class="{ active: isActive(group.id) }"
        @click="navigateTo(group.id)"
      >
        {{ group.label }}
      </a>
    </template>
  </nav>
</template>

<style scoped>
.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-group-title {
  padding: 8px 12px 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-item {
  display: block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
}

.menu-item:hover {
  background: var(--hover-bg);
  color: var(--primary-color);
}

.menu-item.active {
  background: var(--active-bg);
  color: var(--primary-color);
  font-weight: 500;
}

.menu-item-component {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 8px;
  padding: 8px 12px;
  white-space: nowrap;
}

.menu-item-component .menu-item-zh {
  font-size: 13px;
  font-weight: 500;
}

.menu-item-component .menu-item-en {
  font-size: 11px;
  opacity: 0.6;
  font-weight: 400;
}

.menu-item-component.active .menu-item-en {
  opacity: 0.8;
}
</style>
