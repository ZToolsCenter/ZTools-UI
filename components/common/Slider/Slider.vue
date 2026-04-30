<template>
  <div class="slider-wrapper">
    <input
      :value="mergedValue"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="slider"
      @input="handleInput"
      @mousedown="showTooltip = true"
      @mouseup="showTooltip = false"
      @mouseleave="showTooltip = false"
      @focus="showTooltip = true"
      @blur="showTooltip = false"
    />
    <div v-show="showTooltip" class="slider-tooltip" :style="{ left: tooltipPosition }">
      {{ formatValue(mergedValue) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue?: number
  defaultModelValue?: number
  min?: number
  max?: number
  step?: number
  formatter?: (value: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  formatter: (value: number) => `${Math.round(value)}`
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const uncontrolledValue = ref(props.modelValue ?? props.defaultModelValue ?? props.min)
const showTooltip = ref(false)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      uncontrolledValue.value = value
    }
  }
)

const mergedValue = computed(() => (props.modelValue !== undefined ? props.modelValue : uncontrolledValue.value))

function updateValue(value: number): void {
  if (props.modelValue === undefined) {
    uncontrolledValue.value = value
  }

  emit('update:modelValue', value)
  emit('change', value)
}

function handleInput(event: Event): void {
  const value = Number((event.target as HTMLInputElement).value)
  updateValue(value)
}

function formatValue(value: number): string {
  return props.formatter(value)
}

const tooltipPosition = computed(() => {
  const percent = (mergedValue.value - props.min) / (props.max - props.min)
  const thumbWidth = 20
  const thumbRadius = thumbWidth / 2
  return `calc(${percent * 100}% * (100% - ${thumbWidth}px) / 100% + ${thumbRadius}px)`
})
</script>

<style scoped>
.slider-wrapper {
  position: relative;
  flex: 1;
}

.slider-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  transform: translateX(-50%);
  background: var(--primary-color);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.slider-tooltip::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--primary-color);
}

.slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 10px;
  border-radius: 5px;
  background: var(--control-bg);
  border: 2px solid var(--control-border);
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}

.slider:hover {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.slider:focus {
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  border: 3px solid white;
}

.slider::-webkit-slider-thumb:hover {
  background: var(--primary-hover);
  transform: scale(1.15);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.slider::-webkit-slider-thumb:active {
  transform: scale(1.05);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: 3px solid white;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.slider::-moz-range-thumb:hover {
  background: var(--primary-hover);
  transform: scale(1.15);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb:active {
  transform: scale(1.05);
}
</style>
