<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type SwitchValue = boolean
type SwitchSize = 'small' | 'medium' | 'large'

interface Props {
  modelValue?: SwitchValue
  defaultModelValue?: SwitchValue
  disabled?: boolean
  activeText?: string
  inactiveText?: string
  activeValue?: SwitchValue
  inactiveValue?: SwitchValue
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
  (e: 'update:modelValue', value: SwitchValue): void
  (e: 'change', value: SwitchValue): void
}>()

const uncontrolledValue = ref<SwitchValue>(props.modelValue ?? props.defaultModelValue ?? props.inactiveValue)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      uncontrolledValue.value = value
    }
  }
)

const mergedValue = computed<SwitchValue>(() => (props.modelValue !== undefined ? props.modelValue : uncontrolledValue.value))
const checked = computed(() => mergedValue.value === props.activeValue)
const switchClasses = computed(() => [
  'zt-switch',
  `zt-switch--${props.size}`,
  {
    'is-checked': checked.value,
    'is-disabled': props.disabled
  }
])

function updateValue(value: SwitchValue): void {
  if (props.modelValue === undefined) {
    uncontrolledValue.value = value
  }

  emit('update:modelValue', value)
  emit('change', value)
}

function handleChange(event: Event): void {
  if (props.disabled) return

  const target = event.target as HTMLInputElement
  const value = target.checked ? props.activeValue : props.inactiveValue
  updateValue(value)

  if (props.modelValue !== undefined) {
    target.checked = checked.value
  }
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

