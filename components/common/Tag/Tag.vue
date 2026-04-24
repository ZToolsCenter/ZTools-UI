<script setup lang="ts">
import { computed } from 'vue'

type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
type TagSize = 'small' | 'medium' | 'large'

interface Props {
  type?: TagType
  size?: TagSize
  closable?: boolean
  disabled?: boolean
  round?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  closable: false,
  disabled: false,
  round: false
})

const emit = defineEmits<{
  (e: 'close', event: MouseEvent): void
  (e: 'click', event: MouseEvent): void
}>()

const tagClasses = computed(() => [
  'zt-tag',
  `zt-tag--${props.type}`,
  `zt-tag--${props.size}`,
  {
    'zt-tag--round': props.round,
    'is-disabled': props.disabled
  }
])

function handleClick(event: MouseEvent): void {
  if (props.disabled) return
  emit('click', event)
}

function handleClose(event: MouseEvent): void {
  event.stopPropagation()
  if (props.disabled) return
  emit('close', event)
}
</script>

<template>
  <span :class="tagClasses" @click="handleClick">
    <span v-if="$slots.icon" class="zt-tag__icon">
      <slot name="icon"></slot>
    </span>
    <span class="zt-tag__content">
      <slot></slot>
    </span>
    <button
      v-if="closable"
      class="zt-tag__close"
      type="button"
      :disabled="disabled"
      aria-label="关闭标签"
      @click="handleClose"
    >
      ×
    </button>
  </span>
</template>

<style scoped>
.zt-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--control-border);
  border-radius: 4px;
  background: var(--control-bg);
  color: var(--text-color);
  font-weight: 500;
  line-height: 1;
  transition: all 0.2s;
  user-select: none;
  cursor: pointer;
}

.zt-tag:hover:not(.is-disabled) {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-tag.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zt-tag--small {
  padding: 3px 8px;
  font-size: 12px;
}

.zt-tag--medium {
  padding: 5px 10px;
  font-size: 13px;
}

.zt-tag--large {
  padding: 7px 12px;
  font-size: 14px;
}

.zt-tag--round {
  border-radius: 999px;
}

.zt-tag--primary {
  border-color: color-mix(in srgb, var(--primary-color), transparent 65%);
  background: var(--primary-light-bg);
  color: var(--primary-color);
}

.zt-tag--success {
  border-color: var(--success-border);
  background: var(--success-light-bg);
  color: var(--success-color);
}

.zt-tag--warning {
  border-color: var(--warning-border);
  background: var(--warning-light-bg);
  color: var(--warning-color);
}

.zt-tag--danger {
  border-color: var(--danger-border);
  background: var(--danger-light-bg);
  color: var(--danger-color);
}

.zt-tag--info {
  border-color: color-mix(in srgb, var(--text-secondary), transparent 70%);
  background: color-mix(in srgb, var(--text-secondary), transparent 88%);
  color: var(--text-secondary);
}

.zt-tag__icon,
.zt-tag__content {
  display: inline-flex;
  align-items: center;
}

.zt-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 2px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: currentColor;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.75;
  transition: all 0.2s;
}

.zt-tag__close:hover:not(:disabled) {
  background: color-mix(in srgb, currentColor, transparent 85%);
  opacity: 1;
}

.zt-tag__close:disabled {
  cursor: not-allowed;
}
</style>
