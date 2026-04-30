<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { parsePlacement, useOverlayPosition } from '../shared/useOverlayPosition'
import type { PopoverEmits, PopoverPlacement, PopoverProps } from './Popover'

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: 'hover',
  placement: 'top',
  overlap: false,
  raw: false,
  scrollable: false,
  showArrow: false,
  to: 'body',
  zIndex: 10000,
  keepAliveOnHover: false,
  defaultShow: false
})

const emit = defineEmits<PopoverEmits>()
const slots = useSlots()

const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const uncontrolledShow = ref(props.show ?? props.defaultShow)
const arrowStyle = ref<CSSProperties>({})

const mergedShow = computed(() => (props.show === undefined ? uncontrolledShow.value : props.show))
const hasTrigger = computed(() => Boolean(slots.trigger))
const hasHeader = computed(() => Boolean(slots.header))
const hasFooter = computed(() => Boolean(slots.footer))
const teleportTarget = computed(() => (props.to === false ? 'body' : props.to ?? 'body'))
const panelClasses = computed(() => [
  'zt-popover__panel',
  {
    'zt-popover__panel--ready': panelReady.value,
    'zt-popover__panel--raw': props.raw,
    'zt-popover__panel--with-arrow': props.showArrow
  }
])
const contentClasses = computed(() => [
  'zt-popover__content',
  {
    'zt-popover__content--card': !props.raw,
    'zt-popover__content--raw': props.raw,
    'zt-popover__content--fill': props.width !== undefined
  }
])
const bodyClasses = computed(() => [
  'zt-popover__body',
  {
    'zt-popover__body--scrollable': props.scrollable,
    'zt-popover__body--card': !props.raw
  }
])

watch(
  () => props.show,
  (value) => {
    if (value !== undefined) {
      uncontrolledShow.value = value
    }
  }
)

const ARROW_SIZE = 10
const ARROW_HALF = ARROW_SIZE / 2
const ARROW_EDGE_OFFSET = 16
const HOVER_CLOSE_DELAY = 100

let hoverCloseTimer = 0

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function updateArrowPosition(placement: PopoverPlacement, panelRect: DOMRect, triggerRect: DOMRect | null): void {
  if (!props.showArrow) {
    arrowStyle.value = {}
    return
  }

  const { side } = parsePlacement(placement)
  const anchorX = triggerRect ? triggerRect.left + triggerRect.width / 2 - panelRect.left : panelRect.width / 2
  const anchorY = triggerRect ? triggerRect.top + triggerRect.height / 2 - panelRect.top : panelRect.height / 2
  const clampedX = clamp(anchorX, ARROW_EDGE_OFFSET, Math.max(ARROW_EDGE_OFFSET, panelRect.width - ARROW_EDGE_OFFSET))
  const clampedY = clamp(anchorY, ARROW_EDGE_OFFSET, Math.max(ARROW_EDGE_OFFSET, panelRect.height - ARROW_EDGE_OFFSET))

  if (side === 'top') {
    arrowStyle.value = {
      left: `${clampedX}px`,
      bottom: `-${ARROW_HALF}px`,
      transform: 'translateX(-50%) rotate(45deg)'
    }
    return
  }

  if (side === 'bottom') {
    arrowStyle.value = {
      left: `${clampedX}px`,
      top: `-${ARROW_HALF}px`,
      transform: 'translateX(-50%) rotate(45deg)'
    }
    return
  }

  if (side === 'left') {
    arrowStyle.value = {
      top: `${clampedY}px`,
      right: `-${ARROW_HALF}px`,
      transform: 'translateY(-50%) rotate(45deg)'
    }
    return
  }

  arrowStyle.value = {
    top: `${clampedY}px`,
    left: `-${ARROW_HALF}px`,
    transform: 'translateY(-50%) rotate(45deg)'
  }
}

const { resolvedPlacement, panelReady, panelStyle, containsTarget, updatePosition } = useOverlayPosition({
  visible: mergedShow,
  triggerRef,
  panelRef,
  placement: computed(() => props.placement),
  overlap: computed(() => props.overlap),
  showArrow: computed(() => props.showArrow),
  width: computed(() => props.width),
  x: computed(() => props.x),
  y: computed(() => props.y),
  zIndex: computed(() => props.zIndex),
  onPositioned: ({ placement, panelRect, triggerRect }) => {
    updateArrowPosition(placement, panelRect, triggerRect)
  }
})

function clearHoverCloseTimer(): void {
  if (!hoverCloseTimer) {
    return
  }

  window.clearTimeout(hoverCloseTimer)
  hoverCloseTimer = 0
}

function scheduleHoverClose(): void {
  clearHoverCloseTimer()
  hoverCloseTimer = window.setTimeout(() => {
    hoverCloseTimer = 0
    setShow(false)
  }, HOVER_CLOSE_DELAY)
}

function setShow(next: boolean): void {
  if (mergedShow.value === next) {
    return
  }

  if (props.show === undefined) {
    uncontrolledShow.value = next
  }

  emit('update:show', next)
}

function show(): void {
  setShow(true)
}

function hide(): void {
  setShow(false)
}

function toggle(): void {
  setShow(!mergedShow.value)
}

function handleTriggerClick(): void {
  if (props.trigger !== 'click') {
    return
  }

  toggle()
}

function handleTriggerPointerEnter(): void {
  if (props.trigger !== 'hover') {
    return
  }

  clearHoverCloseTimer()
  show()
}

function handleTriggerPointerLeave(): void {
  if (props.trigger !== 'hover') {
    return
  }

  if (props.keepAliveOnHover) {
    scheduleHoverClose()
    return
  }

  hide()
}

function handlePanelPointerEnter(): void {
  if (props.trigger !== 'hover' || !props.keepAliveOnHover) {
    return
  }

  clearHoverCloseTimer()
}

function handlePanelPointerLeave(): void {
  if (props.trigger !== 'hover') {
    return
  }

  if (props.keepAliveOnHover) {
    scheduleHoverClose()
    return
  }

  hide()
}

function handleTriggerFocusIn(): void {
  if (props.trigger !== 'focus') {
    return
  }

  show()
}

function handleTriggerFocusOut(event: FocusEvent): void {
  if (props.trigger !== 'focus' || containsTarget(event.relatedTarget)) {
    return
  }

  hide()
}

function handlePanelFocusIn(): void {
  if (props.trigger !== 'focus') {
    return
  }

  clearHoverCloseTimer()
}

function handlePanelFocusOut(event: FocusEvent): void {
  if (props.trigger !== 'focus' || containsTarget(event.relatedTarget)) {
    return
  }

  hide()
}

function handleDocumentPointerDown(event: PointerEvent): void {
  if (!mergedShow.value || containsTarget(event.target)) {
    return
  }

  emit('clickoutside', event)

  if (props.trigger !== 'manual') {
    hide()
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (!mergedShow.value || event.key !== 'Escape' || props.trigger === 'manual') {
    return
  }

  hide()
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleKeydown)
  clearHoverCloseTimer()
})

defineExpose({
  show,
  hide,
  toggle,
  updatePosition
})
</script>

<template>
  <div class="zt-popover">
    <div
      v-if="hasTrigger"
      ref="triggerRef"
      class="zt-popover__trigger"
      @click="handleTriggerClick"
      @pointerenter="handleTriggerPointerEnter"
      @pointerleave="handleTriggerPointerLeave"
      @focusin="handleTriggerFocusIn"
      @focusout="handleTriggerFocusOut"
    >
      <slot name="trigger"></slot>
    </div>

    <Teleport :to="teleportTarget" :disabled="props.to === false">
      <div
        v-if="mergedShow"
        ref="panelRef"
        :class="panelClasses"
        :data-placement="resolvedPlacement"
        :style="panelStyle"
        @pointerenter="handlePanelPointerEnter"
        @pointerleave="handlePanelPointerLeave"
        @focusin="handlePanelFocusIn"
        @focusout="handlePanelFocusOut"
      >
        <div v-if="props.showArrow" class="zt-popover__arrow" :style="arrowStyle"></div>
        <div :class="contentClasses">
          <div
            v-if="hasHeader"
            class="zt-popover__header"
            :class="props.headerClass"
            :style="props.headerStyle"
          >
            <slot name="header"></slot>
          </div>

          <div :class="bodyClasses">
            <slot></slot>
          </div>

          <div
            v-if="hasFooter"
            class="zt-popover__footer"
            :class="props.footerClass"
            :style="props.footerStyle"
          >
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
.zt-popover {
  display: inline-flex;
  max-width: 100%;
}

.zt-popover__trigger {
  display: inline-flex;
  max-width: 100%;
}

.zt-popover__panel {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10000;
  display: inline-flex;
  max-width: calc(100vw - 16px);
  visibility: hidden;
  pointer-events: auto;
}

.zt-popover__panel--ready {
  visibility: visible;
}

.zt-popover__content {
  position: relative;
  min-width: 160px;
  max-width: min(360px, calc(100vw - 16px));
  color: var(--text-color);
}

.zt-popover__content--card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--control-border);
  border-radius: 10px;
  background: var(--dialog-bg, var(--bg-color));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.zt-popover__content--raw {
  min-width: 0;
  max-width: none;
}

.zt-popover__content--fill {
  width: 100%;
  max-width: 100%;
}

.zt-popover__header,
.zt-popover__footer {
  color: var(--text-secondary);
}

.zt-popover__content--card .zt-popover__header,
.zt-popover__content--card .zt-popover__footer {
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.5;
}

.zt-popover__content--card .zt-popover__header {
  border-bottom: 1px solid var(--control-border);
}

.zt-popover__content--card .zt-popover__footer {
  border-top: 1px solid var(--control-border);
}

.zt-popover__body {
  color: var(--text-color);
}

.zt-popover__body--card {
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.6;
}

.zt-popover__body--scrollable {
  max-height: 240px;
  overflow: auto;
}

.zt-popover__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid transparent;
  background: var(--dialog-bg, var(--bg-color));
  box-sizing: border-box;
  z-index: 2;
}

.zt-popover__panel[data-placement^='top'] .zt-popover__arrow {
  border-right-color: var(--control-border);
  border-bottom-color: var(--control-border);
}

.zt-popover__panel[data-placement^='bottom'] .zt-popover__arrow {
  border-top-color: var(--control-border);
  border-left-color: var(--control-border);
}

.zt-popover__panel[data-placement^='left'] .zt-popover__arrow {
  border-top-color: var(--control-border);
  border-right-color: var(--control-border);
}

.zt-popover__panel[data-placement^='right'] .zt-popover__arrow {
  border-left-color: var(--control-border);
  border-bottom-color: var(--control-border);
}

.zt-popover__content--card,
.zt-popover__content--raw {
  position: relative;
  z-index: 1;
}
</style>
