<script setup lang="ts">
import { computed } from 'vue'

type RadioValue = string | number | boolean

interface Props {
  modelValue: RadioValue
  value: RadioValue
  label?: string
  name?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  name: undefined,
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: RadioValue): void
  (e: 'change', value: RadioValue): void
}>()

const checked = computed(() => props.modelValue === props.value)
const radioClasses = computed(() => [
  'zt-radio',
  {
    'is-checked': checked.value,
    'is-disabled': props.disabled
  }
])

function handleChange(): void {
  if (props.disabled) return
  emit('update:modelValue', props.value)
  emit('change', props.value)
}
</script>

<template>
  <label :class="radioClasses">
    <span class="zt-radio__box">
      <input
        class="zt-radio__input"
        type="radio"
        :name="name"
        :checked="checked"
        :disabled="disabled"
        @change="handleChange"
      />
      <span class="zt-radio__inner"></span>
    </span>
    <span v-if="$slots.default || label" class="zt-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.zt-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.zt-radio.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zt-radio__box {
  position: relative;
  display: inline-flex;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.zt-radio__input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.zt-radio__input:disabled {
  cursor: not-allowed;
}

.zt-radio__inner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--control-border);
  border-radius: 50%;
  background: var(--control-bg);
  transition: all 0.2s;
}

.zt-radio:hover:not(.is-disabled) .zt-radio__inner {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-radio__input:focus-visible + .zt-radio__inner {
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.zt-radio.is-checked .zt-radio__inner {
  border-color: var(--primary-color);
}

.zt-radio.is-checked .zt-radio__inner::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
}

.zt-radio__label {
  line-height: 1.4;
}
</style>
