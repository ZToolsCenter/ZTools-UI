import type { VNodeChild } from 'vue'

export type ModalDisplayDirective = 'if' | 'show'
export type ModalTeleportTarget = string | HTMLElement | false
export type ModalDraggable = boolean | { bounds?: 'none' }
export type ModalPreset = 'dialog' | 'card'
export type ModalTransformOrigin = 'mouse' | 'center'
export interface ModalCallbacks {
  onAfterEnter?: () => void
  onAfterLeave?: () => void
  onEsc?: () => void
  onMaskClick?: (event: MouseEvent) => void
  onUpdateShow?: (value: boolean) => void
}

export interface ModalProps {
  show?: boolean
  defaultShow?: boolean
  to?: ModalTeleportTarget
  zIndex?: number
  showMask?: boolean
  maskClosable?: boolean
  closeOnEsc?: boolean
  blockScroll?: boolean
  autoFocus?: boolean
  trapFocus?: boolean
  displayDirective?: ModalDisplayDirective
  draggable?: ModalDraggable
  preset?: ModalPreset
  transformOrigin?: ModalTransformOrigin
}

export interface ModalEmits {
  (e: 'update:show', value: boolean): void
  (e: 'after-enter'): void
  (e: 'after-leave'): void
  (e: 'mask-click', event: MouseEvent): void
  (e: 'esc'): void
}

export interface ModalProviderProps {
  to?: string | HTMLElement
}

export interface ModalOptions extends ModalProps, ModalCallbacks {
  render: () => VNodeChild
}

export interface ModalReactive extends ModalOptions {
  key: number
  show: boolean
  hide: () => void
  destroy: () => void
  update: (options: Partial<ModalOptions>) => void
}

