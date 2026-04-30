<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, watchEffect } from 'vue'

interface Props {
  modelValue?: boolean
  defaultModelValue?: boolean
  label?: string
  disabled?: boolean
  indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultModelValue: false,
  label: '',
  disabled: false,
  indeterminate: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const uncontrolledValue = ref(props.modelValue ?? props.defaultModelValue)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      uncontrolledValue.value = value
    }
  }
)

const mergedValue = computed(() => (props.modelValue !== undefined ? props.modelValue : uncontrolledValue.value))
const checkboxClasses = computed(() => [
  'zt-checkbox',
  {
    'is-checked': mergedValue.value,
    'is-indeterminate': props.indeterminate,
    'is-disabled': props.disabled
  }
])

const inputRef = useTemplateRef<HTMLInputElement>('inputRef')

watchEffect(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
})

function updateValue(value: boolean): void {
  if (props.modelValue === undefined) {
    uncontrolledValue.value = value
  }

  emit('update:modelValue', value)
  emit('change', value)
}

function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement
  const checked = target.checked
  updateValue(checked)

  if (props.modelValue !== undefined) {
    target.checked = mergedValue.value
  }
}
</script>

<template>
  <label :class="checkboxClasses">
    <span class="zt-checkbox__box">
      <input
        ref="inputRef"
        class="zt-checkbox__input"
        type="checkbox"
        :checked="mergedValue"
        :disabled="disabled"
        :aria-checked="indeterminate ? 'mixed' : mergedValue"
        @change="handleChange"
      />
      <span class="zt-checkbox__inner"></span>
    </span>
    <span v-if="$slots.default || label" class="zt-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.zt-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.zt-checkbox.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zt-checkbox__box {
  position: relative;
  display: inline-flex;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.zt-checkbox__input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.zt-checkbox__input:disabled {
  cursor: not-allowed;
}

.zt-checkbox__inner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--control-border);
  border-radius: 4px;
  background: var(--control-bg);
  transition: all 0.2s;
}

.zt-checkbox:hover:not(.is-disabled) .zt-checkbox__inner {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-checkbox__input:focus-visible + .zt-checkbox__inner {
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.zt-checkbox.is-checked .zt-checkbox__inner,
.zt-checkbox.is-indeterminate .zt-checkbox__inner {
  border-color: var(--primary-color);
  background: var(--primary-color);
}

.zt-checkbox.is-checked .zt-checkbox__inner::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 6px;
  width: 4px;
  height: 8px;
  border: solid var(--text-on-primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.zt-checkbox.is-indeterminate .zt-checkbox__inner::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 4px;
  width: 10px;
  height: 2px;
  border-radius: 2px;
  background: var(--text-on-primary);
}

.zt-checkbox__label {
  line-height: 1.4;
}
</style>

