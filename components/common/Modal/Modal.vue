<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import { useBodyScrollLock } from '../shared/useBodyScrollLock'
import type {
  ModalDisplayDirective,
  ModalDraggable,
  ModalEmits,
  ModalPreset,
  ModalProps,
  ModalTeleportTarget,
  ModalTransformOrigin
} from './Modal'

defineOptions({ name: 'ZModal' })

const props = defineProps({
  show: {
    type: Boolean as PropType<ModalProps['show']>,
    default: undefined
  },
  defaultShow: {
    type: Boolean,
    default: false
  },
  to: {
    type: [String, Object, Boolean] as PropType<ModalTeleportTarget>,
    default: 'body'
  },
  zIndex: {
    type: Number,
    default: 10000
  },
  showMask: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  blockScroll: {
    type: Boolean,
    default: true
  },
  autoFocus: {
    type: Boolean,
    default: true
  },
  trapFocus: {
    type: Boolean,
    default: true
  },
  displayDirective: {
    type: String as PropType<ModalDisplayDirective>,
    default: 'if'
  },
  draggable: {
    type: [Boolean, Object] as PropType<ModalDraggable>,
    default: false
  },
  preset: {
    type: String as PropType<ModalPreset | undefined>,
    default: undefined
  },
  transformOrigin: {
    type: String as PropType<ModalTransformOrigin>,
    default: 'mouse'
  }
})

const emit = defineEmits<ModalEmits>()

const panelRef = ref<HTMLElement | null>(null)
const uncontrolledShow = ref(props.show ?? props.defaultShow)
const rendered = ref(uncontrolledShow.value)
const dragOffset = ref({ x: 0, y: 0 })
const pointerOrigin = ref<{ x: number; y: number } | null>(null)
const resolvedTransformOrigin = ref('center center')
let previousFocusedElement: HTMLElement | null = null
const dragging = ref(false)
let dragPointerId: number | null = null
let dragStartPointer = { x: 0, y: 0 }
let dragStartOffset = { x: 0, y: 0 }
const bodyScrollLock = useBodyScrollLock()

const mergedShow = computed(() => (props.show === undefined ? uncontrolledShow.value : props.show))
const teleportTarget = computed(() => (props.to === false ? 'body' : props.to ?? 'body'))
const shouldRender = computed(() => props.displayDirective === 'show' || rendered.value)
const shouldShowContent = computed(() => (props.displayDirective === 'show' ? mergedShow.value : true))
const effectiveTrapFocus = computed(() => props.trapFocus && props.showMask)
const resolvedZIndex = computed(() => props.zIndex ?? 10000)
const modalClasses = computed(() => [
  'zt-modal',
  {
    'zt-modal--hidden': !mergedShow.value,
    'zt-modal--dialog': props.preset === 'dialog',
    'zt-modal--card': props.preset === 'card',
    'is-draggable': isDraggableEnabled(props.draggable),
    'is-dragging': dragging.value
  }
])

const panelStyle = computed<CSSProperties>(() => ({
  zIndex: resolvedZIndex.value + 1,
  '--zt-modal-translate-x': `${dragOffset.value.x}px`,
  '--zt-modal-translate-y': `${dragOffset.value.y}px`,
  transformOrigin: resolvedTransformOrigin.value
}))

const containerStyle = computed<CSSProperties>(() => ({
  zIndex: resolvedZIndex.value + 1
}))

const wrapperStyle = computed<CSSProperties>(() => ({
  zIndex: resolvedZIndex.value
}))

watch(
  () => props.show,
  (value) => {
    if (value !== undefined) {
      uncontrolledShow.value = value
    }
  }
)

watch(mergedShow, (visible) => {
  if (visible) {
    rendered.value = true
    previousFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    updateTransformOrigin()
    lockBodyScroll()
    nextTick(() => {
      if (props.autoFocus) {
        focusModal()
      }
    })
    return
  }

  unlockBodyScroll()
  stopDragging()
  restoreFocus()
})

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown, true)

  if (mergedShow.value) {
    rendered.value = true
    previousFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    updateTransformOrigin()
    lockBodyScroll()
    nextTick(() => {
      if (props.autoFocus) {
        focusModal()
      }
    })
  }
})

function lockBodyScroll(): void {
  if (!props.blockScroll) {
    return
  }

  bodyScrollLock.lock()
}

function unlockBodyScroll(): void {
  bodyScrollLock.unlock()
}

function isDraggableEnabled(value: ModalDraggable): boolean {
  return value !== false
}

function canDragBeyondViewport(value: ModalDraggable): boolean {
  return typeof value === 'object' && value?.bounds === 'none'
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

function focusModal(): void {
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

function close(): void {
  hide()
}

function hide(): void {
  setShow(false)
}

function handleMaskClick(event: MouseEvent): void {
  emit('mask-click', event)

  if (props.maskClosable && props.showMask) {
    hide()
  }
}

function handleDocumentPointerDown(event: PointerEvent): void {
  pointerOrigin.value = {
    x: event.clientX,
    y: event.clientY
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (!mergedShow.value) {
    return
  }

  if (event.key === 'Escape') {
    emit('esc')

    if (props.closeOnEsc) {
      hide()
    }
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

function updateTransformOrigin(): void {
  if (props.transformOrigin === 'center') {
    resolvedTransformOrigin.value = 'center center'
    return
  }

  nextTick(() => {
    const panel = panelRef.value
    const origin = pointerOrigin.value

    if (!panel || !origin) {
      resolvedTransformOrigin.value = 'center center'
      return
    }

    const rect = panel.getBoundingClientRect()
    const x = clamp(origin.x - rect.left, 0, rect.width)
    const y = clamp(origin.y - rect.top, 0, rect.height)
    resolvedTransformOrigin.value = `${x}px ${y}px`
  })
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function resetDragOffset(): void {
  dragOffset.value = { x: 0, y: 0 }
}

function canStartDragFromTarget(target: HTMLElement): boolean {
  const panel = panelRef.value
  if (!panel) {
    return false
  }

  if (target.closest('[data-modal-drag-ignore]')) {
    return false
  }

  const hasExplicitHandle = panel.querySelector('[data-modal-drag-handle]')
  if (hasExplicitHandle) {
    return Boolean(target.closest('[data-modal-drag-handle]'))
  }

  return !target.closest(
    'button, a, input, textarea, select, option, label, summary, [role="button"], [role="link"], [contenteditable=""], [contenteditable="true"]'
  )
}

function handlePanelPointerDown(event: PointerEvent): void {
  if (!mergedShow.value || !isDraggableEnabled(props.draggable) || event.button !== 0) {
    return
  }

  const target = event.target as HTMLElement | null
  if (!target || !canStartDragFromTarget(target)) {
    return
  }

  event.preventDefault()
  dragging.value = true
  dragPointerId = event.pointerId
  dragStartPointer = { x: event.clientX, y: event.clientY }
  dragStartOffset = { ...dragOffset.value }
  panelRef.value?.setPointerCapture?.(event.pointerId)
  document.addEventListener('pointermove', handlePanelPointerMove)
  document.addEventListener('pointerup', handlePanelPointerUp)
}

function handlePanelPointerMove(event: PointerEvent): void {
  if (!dragging.value || event.pointerId !== dragPointerId) {
    return
  }

  const panel = panelRef.value
  if (!panel) {
    return
  }

  const deltaX = event.clientX - dragStartPointer.x
  const deltaY = event.clientY - dragStartPointer.y
  let nextX = dragStartOffset.x + deltaX
  let nextY = dragStartOffset.y + deltaY

  if (!canDragBeyondViewport(props.draggable)) {
    const rect = panel.getBoundingClientRect()
    const minX = -rect.left
    const maxX = window.innerWidth - rect.right
    const minY = -rect.top
    const maxY = window.innerHeight - rect.bottom
    nextX = clamp(nextX, dragOffset.value.x + minX, dragOffset.value.x + maxX)
    nextY = clamp(nextY, dragOffset.value.y + minY, dragOffset.value.y + maxY)
  }

  dragOffset.value = { x: nextX, y: nextY }
}

function handlePanelPointerUp(event: PointerEvent): void {
  if (event.pointerId !== dragPointerId) {
    return
  }

  panelRef.value?.releasePointerCapture?.(event.pointerId)
  stopDragging()
}

function stopDragging(): void {
  dragging.value = false
  dragPointerId = null
  document.removeEventListener('pointermove', handlePanelPointerMove)
  document.removeEventListener('pointerup', handlePanelPointerUp)
}

function handleAfterEnter(): void {
  emit('after-enter')
}

function handleAfterLeave(): void {
  resetDragOffset()

  if (props.displayDirective === 'if') {
    rendered.value = false
  }

  emit('after-leave')
}

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
  stopDragging()
  unlockBodyScroll()
})

defineExpose({
  hide,
  close
})
</script>

<template>
  <Teleport :to="teleportTarget" :disabled="props.to === false">
    <div
      v-if="shouldRender"
      v-show="shouldShowContent"
      class="zt-modal-wrapper"
      :style="wrapperStyle"
      @keydown="handleKeydown"
    >
      <Transition name="zt-modal-mask" appear>
        <div
          v-if="mergedShow && props.showMask"
          class="zt-modal__mask"
          :style="{ zIndex: resolvedZIndex }"
          @click="handleMaskClick"
        ></div>
      </Transition>

      <Transition name="zt-modal-panel" appear @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
        <div
          v-if="props.displayDirective === 'show' || mergedShow"
          v-show="mergedShow"
          class="zt-modal__container"
          :style="containerStyle"
        >
          <div
            ref="panelRef"
            :class="modalClasses"
            :style="panelStyle"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            @pointerdown="handlePanelPointerDown"
          >
            <slot></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style>
.zt-modal-wrapper {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.zt-modal__mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: auto;
}

.zt-modal__container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  pointer-events: none;
}

.zt-modal {
  position: relative;
  display: flex;
  transform: translate3d(
      var(--zt-modal-translate-x, 0px),
      calc(var(--zt-modal-translate-y, 0px) + var(--zt-modal-enter-offset-y, 0px)),
      0
    )
    scale(var(--zt-modal-scale, 1));
  will-change: transform, opacity;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--control-border);
  border-radius: 14px;
  color: var(--text-color);
  background: var(--dialog-bg, var(--bg-color));
  box-shadow: 0 18px 56px rgba(0, 0, 0, 0.24);
  pointer-events: auto;
  outline: none;
}

.zt-modal.is-draggable [data-modal-drag-handle] {
  cursor: move;
  user-select: none;
}

.zt-modal.is-dragging,
.zt-modal.is-dragging * {
  cursor: move !important;
  user-select: none;
}

.zt-modal-mask-enter-active,
.zt-modal-mask-leave-active {
  transition: opacity 0.18s ease;
}

.zt-modal-mask-enter-from,
.zt-modal-mask-leave-to {
  opacity: 0;
}

.zt-modal-panel-enter-active,
.zt-modal-panel-leave-active {
  transition: opacity 0.2s ease;
}

.zt-modal-panel-enter-active .zt-modal,
.zt-modal-panel-leave-active .zt-modal {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.zt-modal-panel-enter-from,
.zt-modal-panel-leave-to {
  opacity: 0;
}

.zt-modal-panel-enter-from .zt-modal,
.zt-modal-panel-leave-to .zt-modal {
  opacity: 0;
  --zt-modal-enter-offset-y: 8px;
  --zt-modal-scale: 0.96;
}
</style>
