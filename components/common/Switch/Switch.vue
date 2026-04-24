<script setup lang="ts">
import { computed } from 'vue'

type SwitchSize = 'small' | 'medium' | 'large'

interface Props {
  modelValue: boolean
  disabled?: boolean
  activeText?: string
  inactiveText?: string
  activeValue?: boolean
  inactiveValue?: boolean
  size?: SwitchSize
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  activeText: '',
  inactiveText: '',
  activeValue: true,
  inactiveValue: false,
  size: 'medium'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const checked = computed(() => props.modelValue === props.activeValue)
const switchClasses = computed(() => [
  'zt-switch',
  `zt-switch--${props.size}`,
  {
    'is-checked': checked.value,
    'is-disabled': props.disabled
  }
])

function handleChange(): void {
  if (props.disabled) return

  const value = checked.value ? props.inactiveValue : props.activeValue
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <label :class="switchClasses">
    <span v-if="inactiveText" class="zt-switch__text" :class="{ active: !checked }">
      {{ inactiveText }}
    </span>
    <span class="zt-switch__control">
      <input
        class="zt-switch__input"
        type="checkbox"
        :checked="checked"
        :disabled="disabled"
        @change="handleChange"
      />
      <span class="zt-switch__slider"></span>
    </span>
    <span v-if="activeText" class="zt-switch__text" :class="{ active: checked }">
      {{ activeText }}
    </span>
  </label>
</template>

<style scoped>
.zt-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.zt-switch.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zt-switch__control {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.zt-switch__input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.zt-switch__input:disabled {
  cursor: not-allowed;
}

.zt-switch__slider {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  border: 2px solid var(--control-border);
  border-radius: 999px;
  background: var(--control-bg);
  transition: all 0.2s;
}

.zt-switch__slider::before {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: var(--text-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.zt-switch:hover:not(.is-disabled) .zt-switch__slider {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-switch__input:focus-visible + .zt-switch__slider {
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.zt-switch.is-checked .zt-switch__slider {
  border-color: var(--primary-color);
  background: var(--primary-color);
}

.zt-switch.is-checked .zt-switch__slider::before {
  background: var(--text-on-primary);
}

.zt-switch__text {
  color: var(--text-secondary);
  line-height: 1.4;
  transition: color 0.2s;
}

.zt-switch__text.active {
  color: var(--primary-color);
}

.zt-switch--small .zt-switch__control {
  width: 36px;
  height: 20px;
}

.zt-switch--small .zt-switch__slider::before {
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
}

.zt-switch--small.is-checked .zt-switch__slider::before {
  transform: translateX(16px);
}

.zt-switch--medium .zt-switch__control {
  width: 44px;
  height: 24px;
}

.zt-switch--medium .zt-switch__slider::before {
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
}

.zt-switch--medium.is-checked .zt-switch__slider::before {
  transform: translateX(20px);
}

.zt-switch--large .zt-switch__control {
  width: 54px;
  height: 30px;
}

.zt-switch--large .zt-switch__slider::before {
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
}

.zt-switch--large.is-checked .zt-switch__slider::before {
  transform: translateX(24px);
}
</style>
