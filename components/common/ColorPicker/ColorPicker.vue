<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useOverlayPosition } from '../shared/useOverlayPosition'
import type { ColorPickerEmits, ColorPickerProps } from './ColorPicker'

type DragTarget = 'sv' | 'hue' | 'alpha'
type ColorValueFormat = 'hex' | 'rgba' | 'hsl'

interface RgbaColor {
  r: number
  g: number
  b: number
  a: number
}

interface HsvColor {
  h: number
  s: number
  v: number
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  disabled: false,
  showInput: true,
  showAlpha: false,
  size: 'medium',
  placement: 'bottom-start',
  autoAdjustPlacement: true
})

const isPanelOpen = ref(false)
const colorValueFormat = ref<ColorValueFormat>('hex')
const pickerRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const svPanelRef = ref<HTMLElement | null>(null)
const hueSliderRef = ref<HTMLElement | null>(null)
const alphaSliderRef = ref<HTMLElement | null>(null)
let dragTarget: DragTarget | null = null

const emit = defineEmits<ColorPickerEmits>()

const pickerClasses = computed(() => [
  'zt-color-picker',
  `zt-color-picker--${props.size}`,
  {
    'is-disabled': props.disabled,
    'without-input': !props.showInput
  }
])

const { resolvedPlacement, panelStyle, containsTarget, scheduleUpdate } = useOverlayPosition({
  visible: computed(() => isPanelOpen.value),
  triggerRef: pickerRef,
  anchorRef: computed(() => (props.showInput ? pickerRef.value : triggerRef.value)),
  panelRef,
  placement: computed(() => props.placement),
  autoAdjustPlacement: computed(() => props.autoAdjustPlacement)
})

const activeHue = ref(0)
const rgbaValue = computed(() => parseColor(props.modelValue))
const rawHsvValue = computed(() => rgbToHsv(rgbaValue.value.r, rgbaValue.value.g, rgbaValue.value.b))
const hsvValue = computed(() => ({ ...rawHsvValue.value, h: activeHue.value }))
const hexColorValue = computed(() => rgbToHex(rgbaValue.value.r, rgbaValue.value.g, rgbaValue.value.b))
const alphaValue = computed(() => rgbaValue.value.a)
const alphaHexValue = computed(() => alphaToHex(alphaValue.value))

const outputColorValue = computed(() => formatColor(colorValueFormat.value))

const displayColorValue = computed(() => {
  if (!props.showAlpha) {
    return props.modelValue
  }

  return outputColorValue.value
})

const previewBackground = computed(() => {
  return props.showAlpha ? hexToRgbaCss(hexColorValue.value, alphaValue.value) : hexColorValue.value
})

const inputPlaceholder = computed(() => {
  return props.placeholder ?? (props.showAlpha ? '#000000ff' : '#000000')
})

const hueColor = computed(() => {
  const { r, g, b } = hsvToRgb(hsvValue.value.h, 100, 100)

  return rgbToHex(r, g, b)
})

const huePosition = computed(() => `${(activeHue.value / 360) * 100}%`)
const alphaPosition = computed(() => `${alphaValue.value * 100}%`)
const sliderPointerBackground = computed(() => (props.showAlpha ? previewBackground.value : hexColorValue.value))
const svPointerStyle = computed(() => ({
  left: `${hsvValue.value.s}%`,
  top: `${100 - hsvValue.value.v}%`
}))
const panelColorValue = computed(() => formatColor(colorValueFormat.value))
const currentFormatLabel = computed(() => {
  if (colorValueFormat.value === 'hex') {
    return 'HEX'
  }

  if (colorValueFormat.value === 'rgba') {
    return props.showAlpha ? 'RGBA' : 'RGB'
  }

  return props.showAlpha ? 'HSLA' : 'HSL'
})

function parseColor(value: string): RgbaColor {
  return parseHexColor(value) ?? parseRgbColor(value) ?? parseHslColor(value) ?? { r: 0, g: 0, b: 0, a: 1 }
}

function parseHexColor(value: string): RgbaColor | null {
  const match = value.trim().match(/^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/)

  if (!match) {
    return null
  }

  return {
    r: Number.parseInt(match[1].slice(0, 2), 16),
    g: Number.parseInt(match[1].slice(2, 4), 16),
    b: Number.parseInt(match[1].slice(4, 6), 16),
    a: match[2] ? Number.parseInt(match[2], 16) / 255 : 1
  }
}

function parseRgbColor(value: string): RgbaColor | null {
  const match = value.trim().match(/^rgba?\((.+)\)$/i)

  if (!match) {
    return null
  }

  const parts = match[1].split(',').map((part) => part.trim())

  if (parts.length < 3) {
    return null
  }

  const r = parseCssNumber(parts[0], 255)
  const g = parseCssNumber(parts[1], 255)
  const b = parseCssNumber(parts[2], 255)
  const a = parts[3] === undefined ? 1 : parseCssAlpha(parts[3])

  if ([r, g, b, a].some(Number.isNaN)) {
    return null
  }

  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
    a: clamp(a, 0, 1)
  }
}

function parseHslColor(value: string): RgbaColor | null {
  const match = value.trim().match(/^hsla?\((.+)\)$/i)

  if (!match) {
    return null
  }

  const parts = match[1].split(',').map((part) => part.trim())

  if (parts.length < 3) {
    return null
  }

  const h = Number.parseFloat(parts[0])
  const s = parseCssNumber(parts[1], 100)
  const l = parseCssNumber(parts[2], 100)
  const a = parts[3] === undefined ? 1 : parseCssAlpha(parts[3])

  if ([h, s, l, a].some(Number.isNaN)) {
    return null
  }

  const { r, g, b } = hslToRgb(h, s, l)

  return {
    r,
    g,
    b,
    a: clamp(a, 0, 1)
  }
}

function parseCssNumber(value: string, percentBase: number): number {
  if (value.endsWith('%')) {
    return (Number.parseFloat(value) / 100) * percentBase
  }

  return Number.parseFloat(value)
}

function parseCssAlpha(value: string): number {
  return parseCssNumber(value, 1)
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function formatColor(format: ColorValueFormat): string {
  if (format === 'hex') {
    return props.showAlpha ? `${hexColorValue.value}${alphaHexValue.value}` : hexColorValue.value
  }

  const { r, g, b } = rgbaValue.value

  if (format === 'rgba') {
    return props.showAlpha
      ? `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${formatAlpha(alphaValue.value)})`
      : `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
  }

  const { h, s, l } = rgbToHsl(r, g, b)

  return props.showAlpha
    ? `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${formatAlpha(alphaValue.value)})`
    : `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
}

function toHex(value: number): string {
  return Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0')
}

function alphaToHex(value: number): string {
  return Math.round(clamp(value, 0, 1) * 255).toString(16).padStart(2, '0')
}

function hexToRgbaCss(hex: string, alpha: number): string {
  const color = parseColor(hex)

  return `rgba(${color.r}, ${color.g}, ${color.b}, ${formatAlpha(alpha)})`
}

function formatAlpha(value: number): string {
  return String(Number(clamp(value, 0, 1).toFixed(2)))
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))

    if (max === red) {
      h = ((green - blue) / delta) % 6
    } else if (max === green) {
      h = (blue - red) / delta + 2
    } else {
      h = (red - green) / delta + 4
    }

    h *= 60
  }

  return {
    h: h < 0 ? h + 360 : h,
    s: s * 100,
    l: l * 100
  }
}

function hslToRgb(h: number, s: number, l: number): Pick<RgbaColor, 'r' | 'g' | 'b'> {
  const hue = ((h % 360) + 360) % 360
  const saturation = clamp(s, 0, 100) / 100
  const lightness = clamp(l, 0, 100) / 100
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = lightness - chroma / 2
  let red = 0
  let green = 0
  let blue = 0

  if (hue >= 0 && hue < 60) {
    red = chroma
    green = x
  } else if (hue >= 60 && hue < 120) {
    red = x
    green = chroma
  } else if (hue >= 120 && hue < 180) {
    green = chroma
    blue = x
  } else if (hue >= 180 && hue < 240) {
    green = x
    blue = chroma
  } else if (hue >= 240 && hue < 300) {
    red = x
    blue = chroma
  } else {
    red = chroma
    blue = x
  }

  return {
    r: (red + m) * 255,
    g: (green + m) * 255,
    b: (blue + m) * 255
  }
}

function rgbToHsv(r: number, g: number, b: number): HsvColor {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let h = 0

  if (delta !== 0) {
    if (max === red) {
      h = ((green - blue) / delta) % 6
    } else if (max === green) {
      h = (blue - red) / delta + 2
    } else {
      h = (red - green) / delta + 4
    }

    h *= 60
  }

  return {
    h: h < 0 ? h + 360 : h,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100
  }
}

function hsvToRgb(h: number, s: number, v: number): Pick<RgbaColor, 'r' | 'g' | 'b'> {
  const saturation = clamp(s, 0, 100) / 100
  const value = clamp(v, 0, 100) / 100
  const chroma = value * saturation
  const hue = h >= 360 ? 6 : (((h % 360) + 360) % 360) / 60
  const x = chroma * (1 - Math.abs((hue % 2) - 1))
  const m = value - chroma
  let red = 0
  let green = 0
  let blue = 0

  if (hue >= 0 && hue < 1) {
    red = chroma
    green = x
  } else if (hue >= 1 && hue < 2) {
    red = x
    green = chroma
  } else if (hue >= 2 && hue < 3) {
    green = chroma
    blue = x
  } else if (hue >= 3 && hue < 4) {
    green = x
    blue = chroma
  } else if (hue >= 4 && hue < 5) {
    red = x
    blue = chroma
  } else {
    red = chroma
    blue = x
  }

  return {
    r: (red + m) * 255,
    g: (green + m) * 255,
    b: (blue + m) * 255
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function emitFormattedColor(hexValue: string, alpha = alphaValue.value): void {
  const color = parseHexColor(hexValue) ?? { r: 0, g: 0, b: 0, a: alpha }
  const previousFormat = colorValueFormat.value
  const nextValue = formatColorFromRgba({ ...color, a: alpha }, previousFormat)

  updateValue(nextValue)
}

function formatColorFromRgba(color: RgbaColor, format: ColorValueFormat): string {
  const hex = rgbToHex(color.r, color.g, color.b)

  if (format === 'hex') {
    return props.showAlpha ? `${hex}${alphaToHex(color.a)}` : hex
  }

  if (format === 'rgba') {
    return props.showAlpha
      ? `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${formatAlpha(color.a)})`
      : `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`
  }

  const { h, s, l } = rgbToHsl(color.r, color.g, color.b)

  return props.showAlpha
    ? `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${formatAlpha(color.a)})`
    : `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
}

function emitColor(hexValue: string, alpha = alphaValue.value): void {
  emitFormattedColor(hexValue, alpha)
}

function emitHsvColor(hsv: HsvColor, alpha = alphaValue.value): void {
  const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v)

  emitColor(rgbToHex(r, g, b), alpha)
}

function updateValue(value: string): void {
  emit('update:modelValue', value)
  emit('change', value)
}

function handleTextInput(event: Event): void {
  updateValue((event.target as HTMLInputElement).value)
}

async function copyPanelColor(): Promise<void> {
  if (props.disabled || !navigator.clipboard) {
    return
  }

  try {
    await navigator.clipboard.writeText(panelColorValue.value)
  } catch {}
}

function schedulePanelPositionUpdate(): void {
  nextTick(() => scheduleUpdate())
}

async function togglePanel(): Promise<void> {
  if (props.disabled) {
    return
  }

  if (isPanelOpen.value) {
    closePanel()
    return
  }

  isPanelOpen.value = true
}

function closePanel(): void {
  isPanelOpen.value = false
  stopDrag()
}

function handleDocumentPointerDown(event: PointerEvent): void {
  if (!isPanelOpen.value || containsTarget(event.target)) {
    return
  }

  closePanel()
}

function handleKeydown(event: KeyboardEvent): void {
  if (isPanelOpen.value && event.key === 'Escape') {
    closePanel()
  }
}

function startDrag(target: DragTarget, event: PointerEvent): void {
  if (props.disabled) {
    return
  }

  dragTarget = target
  updateDragValue(event)
  window.addEventListener('pointermove', updateDragValue)
  window.addEventListener('pointerup', stopDrag, { once: true })
}

function stopDrag(): void {
  dragTarget = null
  window.removeEventListener('pointermove', updateDragValue)
}

function updateDragValue(event: PointerEvent): void {
  if (dragTarget === 'sv') {
    updateSvValue(event)
  } else if (dragTarget === 'hue') {
    updateHueValue(event)
  } else if (dragTarget === 'alpha') {
    updateAlphaValue(event)
  }
}

function updateSvValue(event: PointerEvent): void {
  const rect = svPanelRef.value?.getBoundingClientRect()

  if (!rect) {
    return
  }

  const s = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100)
  const v = clamp(100 - ((event.clientY - rect.top) / rect.height) * 100, 0, 100)

  emitHsvColor({ ...hsvValue.value, s, v })
}

function updateHueValue(event: PointerEvent): void {
  const rect = hueSliderRef.value?.getBoundingClientRect()

  if (!rect) {
    return
  }

  const h = clamp(((event.clientX - rect.left) / rect.width) * 360, 0, 360)

  activeHue.value = h
  emitHsvColor({ ...hsvValue.value, h })
}

function updateAlphaValue(event: PointerEvent): void {
  const rect = alphaSliderRef.value?.getBoundingClientRect()

  if (!rect) {
    return
  }

  const alpha = clamp((event.clientX - rect.left) / rect.width, 0, 1)

  emitColor(hexColorValue.value, alpha)
}

function detectColorFormat(value: string): ColorValueFormat | null {
  const normalized = value.trim().toLowerCase()

  if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(normalized)) {
    return 'hex'
  }

  if (/^rgba?\(/.test(normalized)) {
    return 'rgba'
  }

  if (/^hsla?\(/.test(normalized)) {
    return 'hsl'
  }

  return null
}

function toggleColorValueFormat(): void {
  const formats: ColorValueFormat[] = ['hex', 'rgba', 'hsl']
  const nextFormat = formats[(formats.indexOf(colorValueFormat.value) + 1) % formats.length]

  colorValueFormat.value = nextFormat
  updateValue(formatColor(nextFormat))
}

watch(
  rawHsvValue,
  (hsv) => {
    if (dragTarget !== 'hue' && hsv.s > 0 && !(hsv.h === 0 && activeHue.value === 360)) {
      activeHue.value = hsv.h
    }
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  (value) => {
    const format = detectColorFormat(value)

    if (format) {
      colorValueFormat.value = format
    }
  },
  { immediate: true }
)

watch(
  () => [props.showAlpha, props.showInput, props.modelValue] as const,
  () => {
    if (isPanelOpen.value) {
      schedulePanelPositionUpdate()
    }
  },
  { flush: 'post' }
)

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleKeydown)
  stopDrag()
})
</script>

<template>
  <div ref="pickerRef" :class="pickerClasses">
    <div ref="triggerRef" class="zt-color-picker__trigger">
      <button
        class="zt-color-picker__swatch"
        type="button"
        :disabled="disabled"
        @click="togglePanel"
      >
        <span class="zt-color-picker__preview" :style="{ backgroundColor: previewBackground }"></span>
      </button>
      <Teleport to="body">
        <div
          v-if="isPanelOpen"
          ref="panelRef"
          class="zt-color-picker__panel"
          :data-placement="resolvedPlacement"
          :style="panelStyle"
        >
          <div
            ref="svPanelRef"
            class="zt-color-picker__sv-panel"
            :style="{ '--zt-color-picker-hue-color': hueColor }"
            @pointerdown.prevent="startDrag('sv', $event)"
          >
            <span class="zt-color-picker__sv-pointer" :style="svPointerStyle"></span>
          </div>
          <div class="zt-color-picker__panel-body">
            <div
              ref="hueSliderRef"
              class="zt-color-picker__hue-slider"
              @pointerdown.prevent="startDrag('hue', $event)"
            >
              <span
                class="zt-color-picker__slider-pointer"
                :style="{ left: huePosition, backgroundColor: sliderPointerBackground }"
              ></span>
            </div>
            <div
              v-if="showAlpha"
              ref="alphaSliderRef"
              class="zt-color-picker__alpha-slider"
              :style="{ '--zt-color-picker-alpha-color': hexColorValue }"
              @pointerdown.prevent="startDrag('alpha', $event)"
            >
              <span
                class="zt-color-picker__slider-pointer"
                :style="{ left: alphaPosition, backgroundColor: sliderPointerBackground }"
              ></span>
            </div>
            <div class="zt-color-picker__value-row">
              <button
                class="zt-color-picker__format-button"
                type="button"
                @click="toggleColorValueFormat"
              >
                {{ currentFormatLabel }}
              </button>
              <button
                class="zt-color-picker__value-text"
                type="button"
                @click="copyPanelColor"
              >
                {{ panelColorValue }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
    <input
      v-if="showInput"
      class="zt-color-picker__input"
      :value="displayColorValue"
      :disabled="disabled"
      :placeholder="inputPlaceholder"
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

.zt-color-picker__trigger {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.zt-color-picker__swatch {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
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

.zt-color-picker__swatch:focus,
.zt-color-picker__swatch:focus-within {
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  box-shadow: 0 0 0 3px var(--primary-light-bg);
  outline: none;
}

.zt-color-picker__swatch:disabled {
  cursor: not-allowed;
}

.zt-color-picker__preview {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.zt-color-picker__panel {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  width: 220px;
  border: 1px solid var(--control-border);
  border-radius: 10px;
  background: var(--dialog-bg, var(--bg-color));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
  overflow: hidden;
  visibility: hidden;
}

.zt-color-picker__sv-panel {
  position: relative;
  width: 100%;
  height: 140px;
  background:
    linear-gradient(0deg, #000, transparent),
    linear-gradient(90deg, #fff, var(--zt-color-picker-hue-color));
  cursor: crosshair;
  overflow: hidden;
}

.zt-color-picker__panel-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.zt-color-picker__sv-pointer {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.zt-color-picker__hue-slider,
.zt-color-picker__alpha-slider {
  position: relative;
  height: 12px;
  border-radius: 999px;
  cursor: pointer;
}

.zt-color-picker__hue-slider {
  background: linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
}

.zt-color-picker__alpha-slider {
  background:
    linear-gradient(90deg, transparent, var(--zt-color-picker-alpha-color)),
    linear-gradient(45deg, var(--control-border) 25%, transparent 25%, transparent 75%, var(--control-border) 75%),
    linear-gradient(45deg, var(--control-border) 25%, transparent 25%, transparent 75%, var(--control-border) 75%);
  background-color: var(--control-bg);
  background-position: 0 0, 0 0, 4px 4px;
  background-size: auto, 8px 8px, 8px 8px;
}

.zt-color-picker__slider-pointer {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.zt-color-picker__value-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zt-color-picker__format-button {
  flex-shrink: 0;
  height: 28px;
  min-width: 48px;
  padding: 0 8px;
  border: 1px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
}

.zt-color-picker__format-button:hover,
.zt-color-picker__value-text:hover {
  background: var(--hover-bg);
  color: var(--text-color);
}

.zt-color-picker__value-text {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 5px 8px;
  border: 1px solid var(--control-border);
  border-radius: 6px;
  background: var(--active-bg);
  color: var(--text-color);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
  appearance: none;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zt-color-picker__input {
  min-width: 112px;
  width: 100%;
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
