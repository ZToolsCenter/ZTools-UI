<template>
  <div class="slider-wrapper">
    <input
      :value="displayValue"
      :style="sliderStyle"
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
      {{ formatValue(displayValue) }}
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
  disabledValue?: (value: number) => boolean
  disabledTrackColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  formatter: (value: number) => `${Math.round(value)}`,
  disabledTrackColor: 'var(--control-border)'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const uncontrolledValue = ref(props.modelValue ?? props.defaultModelValue ?? props.min)
const showTooltip = ref(false)

const precision = computed(() => Math.max(getPrecision(props.min), getPrecision(props.max), getPrecision(props.step)))
const mergedValue = computed(() => (props.modelValue !== undefined ? props.modelValue : uncontrolledValue.value))
const displayValue = computed(() => resolveValue(mergedValue.value, mergedValue.value))

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      uncontrolledValue.value = value
    }
  }
)

watch(
  [() => props.min, () => props.max, () => props.step, () => props.disabledValue],
  () => {
    if (props.modelValue !== undefined) {
      return
    }

    const resolvedValue = resolveValue(uncontrolledValue.value, uncontrolledValue.value)

    if (resolvedValue !== uncontrolledValue.value) {
      uncontrolledValue.value = resolvedValue
    }
  },
  { immediate: true }
)

function getPrecision(value: number): number {
  const valueString = `${value}`

  if (valueString.includes('e-')) {
    return Number(valueString.split('e-')[1] ?? 0)
  }

  return valueString.split('.')[1]?.length ?? 0
}

function roundValue(value: number): number {
  const factor = 10 ** precision.value
  return Math.round(value * factor) / factor
}

function clampValue(value: number): number {
  return Math.min(props.max, Math.max(props.min, value))
}

function alignToStep(value: number): number {
  const clampedValue = clampValue(value)

  if (props.step <= 0 || clampedValue === props.min || clampedValue === props.max) {
    return roundValue(clampedValue)
  }

  const stepCount = Math.round((clampedValue - props.min) / props.step)
  return clampValue(roundValue(props.min + stepCount * props.step))
}

function isValueDisabled(value: number): boolean {
  return props.disabledValue?.(value) ?? false
}

function resolveValue(targetValue: number, referenceValue: number): number {
  const normalizedTargetValue = alignToStep(targetValue)

  if (!isValueDisabled(normalizedTargetValue)) {
    return normalizedTargetValue
  }

  return alignToStep(referenceValue)
}

function updateValue(value: number): void {
  const currentValue = mergedValue.value

  if (props.modelValue === undefined) {
    uncontrolledValue.value = value
  }

  if (value === currentValue) {
    return
  }

  emit('update:modelValue', value)
  emit('change', value)
}

function handleInput(event: Event): void {
  const input = event.target as HTMLInputElement
  const rawValue = Number(input.value)
  const resolvedValue = resolveValue(rawValue, displayValue.value)

  if (resolvedValue !== rawValue) {
    input.value = `${resolvedValue}`
  }

  updateValue(resolvedValue)
}

function formatValue(value: number): string {
  return props.formatter(value)
}

const disabledSegments = computed(() => {
  if (!props.disabledValue || props.max <= props.min) {
    return []
  }

  if (props.step <= 0) {
    return isValueDisabled(props.min) && isValueDisabled(props.max)
      ? [{ start: props.min, end: props.max }]
      : []
  }

  const segments: Array<{ start: number; end: number }> = []
  const maxIterations = Math.ceil((props.max - props.min) / props.step) + 1
  let segmentStart: number | null = null
  let previousValue: number | null = null

  for (let index = 0; index < maxIterations; index += 1) {
    const rawValue = props.min + props.step * index
    const value = index === maxIterations - 1 ? props.max : alignToStep(rawValue)
    const disabled = isValueDisabled(value)

    if (disabled && segmentStart === null) {
      segmentStart = value
    }

    if (!disabled && segmentStart !== null && previousValue !== null) {
      segments.push({ start: segmentStart, end: previousValue })
      segmentStart = null
    }

    previousValue = value

    if (value >= props.max) {
      break
    }
  }

  if (segmentStart !== null && previousValue !== null) {
    segments.push({ start: segmentStart, end: previousValue })
  }

  return segments
})

const sliderStyle = computed(() => {
  if (props.max <= props.min || disabledSegments.value.length === 0) {
    return undefined
  }

  const backgroundStops = disabledSegments.value.flatMap((segment) => {
    const startPercent = ((segment.start - props.min) / (props.max - props.min)) * 100
    const endPercent = ((segment.end - props.min) / (props.max - props.min)) * 100

    return [
      `transparent ${startPercent}%`,
      `var(--slider-disabled-track-color) ${startPercent}%`,
      `var(--slider-disabled-track-color) ${endPercent}%`,
      `transparent ${endPercent}%`
    ]
  })

  return {
    backgroundImage: `linear-gradient(90deg, ${backgroundStops.join(', ')})`,
    '--slider-disabled-track-color': props.disabledTrackColor
  }
})

const tooltipPosition = computed(() => {
  if (props.max === props.min) {
    return '10px'
  }

  const percent = (displayValue.value - props.min) / (props.max - props.min)
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
