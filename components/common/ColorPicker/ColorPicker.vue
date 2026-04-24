<script setup lang="ts">
import { computed } from 'vue'

type ColorPickerSize = 'small' | 'medium' | 'large'

interface Props {
  modelValue: string
  disabled?: boolean
  showInput?: boolean
  placeholder?: string
  size?: ColorPickerSize
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  showInput: true,
  placeholder: '#000000',
  size: 'medium'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const pickerClasses = computed(() => [
  'zt-color-picker',
  `zt-color-picker--${props.size}`,
  {
    'is-disabled': props.disabled,
    'without-input': !props.showInput
  }
])

const nativeColorValue = computed(() => {
  return /^#[0-9a-fA-F]{6}$/.test(props.modelValue) ? props.modelValue : '#000000'
})

function updateValue(value: string): void {
  emit('update:modelValue', value)
  emit('change', value)
}

function handleColorInput(event: Event): void {
  updateValue((event.target as HTMLInputElement).value)
}

function handleTextInput(event: Event): void {
  updateValue((event.target as HTMLInputElement).value)
}
</script>

<template>
  <div :class="pickerClasses">
    <label class="zt-color-picker__swatch">
      <input
        class="zt-color-picker__native"
        type="color"
        :value="nativeColorValue"
        :disabled="disabled"
        @input="handleColorInput"
      />
      <span class="zt-color-picker__preview" :style="{ backgroundColor: nativeColorValue }"></span>
    </label>
    <input
      v-if="showInput"
      class="zt-color-picker__input"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      spellcheck="false"
      @input="handleTextInput"
      @change="handleTextInput"
    />
  </div>
</template>

<style scoped>
.zt-color-picker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
}

.zt-color-picker.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zt-color-picker__swatch {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.zt-color-picker__swatch:hover {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-color-picker__swatch:focus-within {
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.zt-color-picker__native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;
}

.zt-color-picker__native:disabled {
  cursor: not-allowed;
}

.zt-color-picker__preview {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.zt-color-picker__input {
  min-width: 112px;
  border: 2px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  color: var(--text-color);
  outline: none;
  transition: all 0.2s;
}

.zt-color-picker__input::placeholder {
  color: var(--placeholder-color);
}

.zt-color-picker__input:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-color-picker__input:focus {
  background: var(--active-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.zt-color-picker--small .zt-color-picker__swatch {
  width: 28px;
  height: 28px;
}

.zt-color-picker--medium .zt-color-picker__swatch {
  width: 34px;
  height: 34px;
}

.zt-color-picker--large .zt-color-picker__swatch {
  width: 40px;
  height: 40px;
}

.zt-color-picker--small .zt-color-picker__input {
  height: 28px;
  padding: 3px 10px;
  font-size: 12px;
}

.zt-color-picker--medium .zt-color-picker__input {
  height: 34px;
  padding: 5px 12px;
  font-size: 14px;
}

.zt-color-picker--large .zt-color-picker__input {
  height: 40px;
  padding: 8px 14px;
  font-size: 15px;
}
</style>
