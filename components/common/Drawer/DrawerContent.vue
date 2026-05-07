<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import { drawerInjectionKey } from './Drawer'
import type { DrawerContentProps } from './Drawer'

defineOptions({ name: 'ZDrawerContent' })

const props = withDefaults(defineProps<DrawerContentProps>(), {
  closable: false,
  nativeScrollbar: true
})

const slots = useSlots()
const drawer = inject(drawerInjectionKey, null)

const hasHeader = computed(() => Boolean(slots.header) || Boolean(props.title) || props.closable)
const hasFooter = computed(() => Boolean(slots.footer))
const bodyClasses = computed(() => [
  'zt-drawer-content__body',
  {
    'zt-drawer-content__body--native-scrollbar': props.nativeScrollbar,
    'zt-drawer-content__body--custom-scrollbar': !props.nativeScrollbar
  },
  props.bodyClass
])

function close(): void {
  drawer?.close()
}
</script>

<template>
  <div class="zt-drawer-content">
    <div v-if="hasHeader" class="zt-drawer-content__header" :class="props.headerClass" :style="props.headerStyle">
      <slot name="header">
        <div v-if="props.title" class="zt-drawer-content__title">{{ props.title }}</div>
      </slot>
      <button
        v-if="props.closable"
        class="zt-drawer-content__close"
        type="button"
        aria-label="关闭"
        @click="close"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div :class="bodyClasses" :style="props.bodyStyle">
      <div class="zt-drawer-content__body-content" :class="props.bodyContentClass" :style="props.bodyContentStyle">
        <slot></slot>
      </div>
    </div>

    <div v-if="hasFooter" class="zt-drawer-content__footer" :class="props.footerClass" :style="props.footerStyle">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style>
.zt-drawer-content {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  color: var(--text-color);
}

.zt-drawer-content__header,
.zt-drawer-content__footer {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-color: var(--divider-color);
  color: var(--text-color);
}

.zt-drawer-content__header {
  border-bottom: 1px solid var(--divider-color);
}

.zt-drawer-content__footer {
  justify-content: flex-end;
  border-top: 1px solid var(--divider-color);
}

.zt-drawer-content__title {
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zt-drawer-content__close {
  display: inline-flex;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.zt-drawer-content__close:hover {
  border-color: var(--control-border);
  color: var(--text-color);
  background: var(--control-bg);
}

.zt-drawer-content__close svg {
  width: 16px;
  height: 16px;
}

.zt-drawer-content__body {
  flex: 1 1 auto;
  min-height: 0;
}

.zt-drawer-content__body--native-scrollbar {
  overflow: auto;
}

.zt-drawer-content__body--custom-scrollbar {
  overflow: hidden;
}

.zt-drawer-content__body-content {
  padding: 16px;
}
</style>
