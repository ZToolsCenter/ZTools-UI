<script setup lang="ts">
import { computed } from 'vue'

type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'text'
type ButtonSize = 'small' | 'medium' | 'large'
type NativeType = 'button' | 'submit' | 'reset'

interface Props {
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  nativeType?: NativeType
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  nativeType: 'button',
  disabled: false,
  loading: false,
  block: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const buttonClasses = computed(() => [
  'zt-button',
  `zt-button--${props.type}`,
  `zt-button--${props.size}`,
  {
    'zt-button--block': props.block,
    'is-loading': props.loading
  }
])

function handleClick(event: MouseEvent): void {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<template>
  <button
    :class="buttonClasses"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="zt-button__spinner" aria-hidden="true"></span>
    <span v-else-if="$slots.icon" class="zt-button__icon">
      <slot name="icon"></slot>
    </span>
    <span v-if="$slots.default" class="zt-button__content">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.zt-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 2px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  color: var(--text-color);
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  user-select: none;
}

.zt-button:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  color: var(--primary-color);
}

.zt-button:active:not(:disabled) {
  background: var(--active-bg);
}

.zt-button:focus-visible {
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.zt-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zt-button--small {
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
}

.zt-button--medium {
  height: 34px;
  padding: 0 16px;
  font-size: 14px;
}

.zt-button--large {
  height: 40px;
  padding: 0 20px;
  font-size: 15px;
}

.zt-button--block {
  width: 100%;
}

.zt-button--primary,
.zt-button--success,
.zt-button--warning,
.zt-button--danger {
  color: var(--text-on-primary);
}

.zt-button--primary {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.zt-button--primary:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  color: var(--text-on-primary);
}

.zt-button--success {
  background: var(--success-color);
  border-color: var(--success-color);
}

.zt-button--success:hover:not(:disabled) {
  background: color-mix(in srgb, var(--success-color), black 10%);
  border-color: color-mix(in srgb, var(--success-color), black 10%);
  color: var(--text-on-primary);
}

.zt-button--warning {
  background: var(--warning-color);
  border-color: var(--warning-color);
}

.zt-button--warning:hover:not(:disabled) {
  background: color-mix(in srgb, var(--warning-color), black 10%);
  border-color: color-mix(in srgb, var(--warning-color), black 10%);
  color: var(--text-on-primary);
}

.zt-button--danger {
  background: var(--danger-color);
  border-color: var(--danger-color);
}

.zt-button--danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--danger-color), black 10%);
  border-color: color-mix(in srgb, var(--danger-color), black 10%);
  color: var(--text-on-primary);
}

.zt-button--text {
  border-color: transparent;
  background: transparent;
  color: var(--primary-color);
}

.zt-button--text:hover:not(:disabled) {
  border-color: transparent;
  background: var(--hover-bg);
}

.zt-button__icon,
.zt-button__content {
  display: inline-flex;
  align-items: center;
}

.zt-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: zt-button-spin 0.8s linear infinite;
}

@keyframes zt-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
