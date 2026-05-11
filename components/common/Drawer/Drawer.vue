<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { useBodyScrollLock } from '../shared/useBodyScrollLock'
import { drawerInjectionKey } from './Drawer'
import type { DrawerEmits, DrawerProps, DrawerSize } from './Drawer'

defineOptions({ name: 'ZDrawer' })

const props = withDefaults(defineProps<DrawerProps>(), {
  show: undefined,
  defaultShow: false,
  placement: 'right',
  defaultWidth: 251,
  defaultHeight: 251,
  resizable: false,
  to: 'body',
  zIndex: 10000,
  showMask: true,
  maskClosable: true,
  closeOnEsc: true,
  blockScroll: true,
  autoFocus: true,
  trapFocus: true,
  displayDirective: 'if',
  nativeScrollbar: true
})

const emit = defineEmits<DrawerEmits>()

const panelRef = ref<HTMLElement | null>(null)
const uncontrolledShow = ref(props.show ?? props.defaultShow)
const rendered = ref(uncontrolledShow.value)
const dragSize = ref<number | null>(null)
let previousFocusedElement: HTMLElement | null = null
let resizing = false
let resizeStartPosition = 0
let resizeStartSize = 0
const bodyScrollLock = useBodyScrollLock()

const mergedShow = computed(() => (props.show === undefined ? uncontrolledShow.value : props.show))
const teleportTarget = computed(() => (props.to === false ? 'body' : props.to ?? 'body'))
const isHorizontal = computed(() => props.placement === 'left' || props.placement === 'right')
const shouldRender = computed(() => props.displayDirective === 'show' || rendered.value)
const shouldShowContent = computed(() => (props.displayDirective === 'show' ? mergedShow.value : true))
const effectiveTrapFocus = computed(() => props.trapFocus && props.showMask !== false)
const transitionName = computed(() => `zt-drawer-panel-${props.placement}`)
const drawerClasses = computed(() => [
  'zt-drawer',
  `zt-drawer--${props.placement}`,
  {
    'zt-drawer--hidden': !mergedShow.value,
    'zt-drawer--native-scrollbar': props.nativeScrollbar,
    'zt-drawer--custom-scrollbar': !props.nativeScrollbar
  },
  props.contentClass
])
const maskClasses = computed(() => [
  'zt-drawer__mask',
  {
    'zt-drawer__mask--transparent': props.showMask === 'transparent'
  }
])

const panelStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    zIndex: props.zIndex
  }
  const size = dragSize.value ?? normalizeSize(isHorizontal.value ? props.width ?? props.defaultWidth : props.height ?? props.defaultHeight)

  if (isHorizontal.value) {
    style.width = formatSize(size)
  } else {
    style.height = formatSize(size)
  }

  return style
})

const wrapperStyle = computed<CSSProperties>(() => ({
  zIndex: props.zIndex
}))

watch(
  () => props.show,
  (value) => {
    if (value !== undefined) {
      uncontrolledShow.value = value
    }
  }
)

watch(
  () => [props.width, props.height, props.placement] as const,
  () => {
    dragSize.value = null
  }
)

watch(
  mergedShow,
  (visible) => {
    if (visible) {
      rendered.value = true
      previousFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
      lockBodyScroll()
      nextTick(() => {
        if (props.autoFocus) {
          focusDrawer()
        }
      })
      return
    }

    unlockBodyScroll()
    restoreFocus()
  }
)

onMounted(() => {
  if (mergedShow.value) {
    rendered.value = true
    previousFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    lockBodyScroll()
    nextTick(() => {
      if (props.autoFocus) {
        focusDrawer()
      }
    })
  }
})

provide(drawerInjectionKey, {
  close: hide
})

function normalizeSize(value: DrawerSize | undefined): DrawerSize {
  return value ?? (isHorizontal.value ? props.defaultWidth : props.defaultHeight)
}

function formatSize(value: DrawerSize): string {
  return typeof value === 'number' ? `${value}px` : value
}

function parseSize(value: DrawerSize | undefined, fallback: number): number {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

function clampSize(value: number): number {
  if (isHorizontal.value) {
    return clamp(value, props.minWidth, props.maxWidth)
  }

  return clamp(value, props.minHeight, props.maxHeight)
}

function clamp(value: number, min?: number, max?: number): number {
  let next = value

  if (min !== undefined) {
    next = Math.max(next, min)
  }

  if (max !== undefined) {
    next = Math.min(next, max)
  }

  return next
}

function getFocusableElements(): HTMLElement[] {
  const root = panelRef.value
  if (!root) {
    return []
  }

  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1 && isFocusable(element))
}

function isFocusable(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  return style.visibility !== 'hidden' && style.display !== 'none'
}

function focusDrawer(): void {
  const firstFocusable = getFocusableElements()[0]
  ;(firstFocusable ?? panelRef.value)?.focus({ preventScroll: true })
}

function restoreFocus(): void {
  if (previousFocusedElement && document.contains(previousFocusedElement)) {
    previousFocusedElement.focus({ preventScroll: true })
  }

  previousFocusedElement = null
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

function hide(): void {
  setShow(false)
}

function handleMaskClick(event: MouseEvent): void {
  emit('mask-click', event)

  if (props.maskClosable) {
    hide()
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (!mergedShow.value) {
    return
  }

  if (event.key === 'Escape' && props.closeOnEsc) {
    emit('esc')
    hide()
    return
  }

  if (event.key === 'Tab' && effectiveTrapFocus.value) {
    trapTab(event)
  }
}

function trapTab(event: KeyboardEvent): void {
  const focusableElements = getFocusableElements()

  if (!focusableElements.length) {
    event.preventDefault()
    panelRef.value?.focus({ preventScroll: true })
    return
  }

  const first = focusableElements[0]
  const last = focusableElements[focusableElements.length - 1]
  const active = document.activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus({ preventScroll: true })
    return
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus({ preventScroll: true })
  }
}

function handleAfterEnter(): void {
  emit('after-enter')
}

function handleAfterLeave(): void {
  if (props.displayDirective === 'if') {
    rendered.value = false
  }

  emit('after-leave')
}

function handleResizePointerDown(event: PointerEvent): void {
  if (!props.resizable) {
    return
  }

  event.preventDefault()
  resizing = true
  resizeStartPosition = isHorizontal.value ? event.clientX : event.clientY
  resizeStartSize = parseSize(
    dragSize.value ?? (isHorizontal.value ? props.width ?? props.defaultWidth : props.height ?? props.defaultHeight),
    isHorizontal.value ? 251 : 251
  )

  document.addEventListener('pointermove', handleResizePointerMove)
  document.addEventListener('pointerup', handleResizePointerUp)
}

function handleResizePointerMove(event: PointerEvent): void {
  if (!resizing) {
    return
  }

  const currentPosition = isHorizontal.value ? event.clientX : event.clientY
  const delta = currentPosition - resizeStartPosition
  const nextSize = clampSize(getNextDragSize(delta))

  dragSize.value = nextSize

  if (isHorizontal.value) {
    emit('update:width', nextSize)
  } else {
    emit('update:height', nextSize)
  }
}

function getNextDragSize(delta: number): number {
  const placement = props.placement

  if (placement === 'right' || placement === 'bottom') {
    return resizeStartSize - delta
  }

  return resizeStartSize + delta
}

function handleResizePointerUp(): void {
  resizing = false
  document.removeEventListener('pointermove', handleResizePointerMove)
  document.removeEventListener('pointerup', handleResizePointerUp)
}

function lockBodyScroll(): void {
  if (!props.blockScroll) {
    return
  }

  bodyScrollLock.lock()
}

function unlockBodyScroll(): void {
  bodyScrollLock.unlock()
}

onBeforeUnmount(() => {
  document.removeEventListener('pointermove', handleResizePointerMove)
  document.removeEventListener('pointerup', handleResizePointerUp)
  unlockBodyScroll()
})

defineExpose({
  hide,
  close: hide
})
</script>

<template>
  <Teleport :to="teleportTarget" :disabled="props.to === false">
    <div
      v-if="shouldRender"
      v-show="shouldShowContent"
      class="zt-drawer-wrapper"
      :style="wrapperStyle"
      @keydown="handleKeydown"
    >
      <Transition name="zt-drawer-mask" appear>
        <div
          v-if="mergedShow && props.showMask !== false"
          :class="maskClasses"
          :style="{ zIndex: props.zIndex }"
          @click="handleMaskClick"
        ></div>
      </Transition>

      <Transition :name="transitionName" appear @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
        <div
          v-if="props.displayDirective === 'show' || mergedShow"
          v-show="mergedShow"
          ref="panelRef"
          :class="drawerClasses"
          :data-placement="props.placement"
          :style="[panelStyle, props.contentStyle]"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
        >
          <slot></slot>
          <div
            v-if="props.resizable"
            class="zt-drawer__resize-handle"
            :class="`zt-drawer__resize-handle--${props.placement}`"
            @pointerdown="handleResizePointerDown"
          ></div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style>
.zt-drawer-wrapper {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.zt-drawer__mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: auto;
}

.zt-drawer__mask--transparent {
  background: transparent;
}

.zt-drawer {
  position: fixed;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  max-height: 100vh;
  color: var(--text-color);
  background: var(--dialog-bg, var(--bg-color));
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.22);
  pointer-events: auto;
  outline: none;
}

.zt-drawer--right {
  top: 0;
  right: 0;
  bottom: 0;
}

.zt-drawer--left {
  top: 0;
  bottom: 0;
  left: 0;
}

.zt-drawer--top {
  top: 0;
  right: 0;
  left: 0;
}

.zt-drawer--bottom {
  right: 0;
  bottom: 0;
  left: 0;
}

.zt-drawer--native-scrollbar {
  overflow: auto;
}

.zt-drawer--custom-scrollbar {
  overflow: hidden;
}

.zt-drawer__resize-handle {
  position: absolute;
  z-index: 2;
  background: transparent;
  touch-action: none;
}

.zt-drawer__resize-handle--right {
  top: 0;
  bottom: 0;
  left: -4px;
  width: 8px;
  cursor: ew-resize;
}

.zt-drawer__resize-handle--left {
  top: 0;
  right: -4px;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
}

.zt-drawer__resize-handle--top {
  right: 0;
  bottom: -4px;
  left: 0;
  height: 8px;
  cursor: ns-resize;
}

.zt-drawer__resize-handle--bottom {
  top: -4px;
  right: 0;
  left: 0;
  height: 8px;
  cursor: ns-resize;
}

.zt-drawer-mask-enter-active,
.zt-drawer-mask-leave-active {
  transition: opacity 0.18s ease;
}

.zt-drawer-mask-enter-from,
.zt-drawer-mask-leave-to {
  opacity: 0;
}

.zt-drawer-panel-right-enter-active,
.zt-drawer-panel-right-leave-active,
.zt-drawer-panel-left-enter-active,
.zt-drawer-panel-left-leave-active,
.zt-drawer-panel-top-enter-active,
.zt-drawer-panel-top-leave-active,
.zt-drawer-panel-bottom-enter-active,
.zt-drawer-panel-bottom-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.zt-drawer-panel-right-enter-from,
.zt-drawer-panel-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.zt-drawer-panel-left-enter-from,
.zt-drawer-panel-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.zt-drawer-panel-top-enter-from,
.zt-drawer-panel-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.zt-drawer-panel-bottom-enter-from,
.zt-drawer-panel-bottom-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
