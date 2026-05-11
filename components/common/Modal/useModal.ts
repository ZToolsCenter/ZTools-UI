import { markRaw, reactive, ref } from 'vue'
import type { ModalOptions, ModalReactive, ModalTeleportTarget } from './Modal'

const modalList = ref<ModalReactive[]>([])
const providerTarget = ref<string | HTMLElement>('body')
const destroyedModalKeys = new Set<number>()
let modalKeySeed = 0

function normalizeTeleportTarget(target: ModalTeleportTarget | undefined): ModalTeleportTarget | undefined {
  if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) {
    return markRaw(target)
  }

  return target
}

function normalizeProviderTarget(target: string | HTMLElement): string | HTMLElement {
  if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) {
    return markRaw(target)
  }

  return target
}

function applyModalOptions(target: ModalReactive, options: Partial<ModalOptions>): void {
  if (options.render !== undefined) target.render = options.render
  if (options.defaultShow !== undefined) target.defaultShow = options.defaultShow
  if (options.to !== undefined) target.to = normalizeTeleportTarget(options.to)
  if (options.zIndex !== undefined) target.zIndex = options.zIndex
  if (options.showMask !== undefined) target.showMask = options.showMask
  if (options.maskClosable !== undefined) target.maskClosable = options.maskClosable
  if (options.closeOnEsc !== undefined) target.closeOnEsc = options.closeOnEsc
  if (options.blockScroll !== undefined) target.blockScroll = options.blockScroll
  if (options.autoFocus !== undefined) target.autoFocus = options.autoFocus
  if (options.trapFocus !== undefined) target.trapFocus = options.trapFocus
  if (options.displayDirective !== undefined) target.displayDirective = options.displayDirective
  if (options.draggable !== undefined) target.draggable = options.draggable
  if (options.preset !== undefined) target.preset = options.preset
  if (options.transformOrigin !== undefined) target.transformOrigin = options.transformOrigin
  if (options.onAfterEnter !== undefined) target.onAfterEnter = options.onAfterEnter
  if (options.onAfterLeave !== undefined) target.onAfterLeave = options.onAfterLeave
  if (options.onEsc !== undefined) target.onEsc = options.onEsc
  if (options.onMaskClick !== undefined) target.onMaskClick = options.onMaskClick
  if (options.onUpdateShow !== undefined) target.onUpdateShow = options.onUpdateShow
  if (options.show !== undefined) setModalShow(target, options.show)
}

function removeModal(key: number): void {
  modalList.value = modalList.value.filter((modal) => modal.key !== key)
  destroyedModalKeys.delete(key)
}

function setModalShow(modal: ModalReactive, value: boolean): void {
  if (modal.show === value) {
    return
  }

  modal.show = value
  modal.onUpdateShow?.(value)
}

function destroyModal(key: number): void {
  const modal = modalList.value.find((item) => item.key === key)

  if (!modal) {
    return
  }

  destroyedModalKeys.add(key)

  if (modal.show) {
    setModalShow(modal, false)
    return
  }

  removeModal(key)
}

export function useModal(): {
  create: (options: ModalOptions) => ModalReactive
  destroyAll: () => void
} {
  function create(options: ModalOptions): ModalReactive {
    const key = ++modalKeySeed
    const instance = reactive({
      key,
      show: options.show ?? options.defaultShow ?? true,
      defaultShow: options.defaultShow,
      to: normalizeTeleportTarget(options.to),
      zIndex: options.zIndex,
      showMask: options.showMask,
      maskClosable: options.maskClosable,
      closeOnEsc: options.closeOnEsc,
      blockScroll: options.blockScroll,
      autoFocus: options.autoFocus,
      trapFocus: options.trapFocus,
      displayDirective: options.displayDirective,
      draggable: options.draggable,
      preset: options.preset,
      transformOrigin: options.transformOrigin,
      render: options.render,
      onAfterEnter: options.onAfterEnter,
      onAfterLeave: options.onAfterLeave,
      onEsc: options.onEsc,
      onMaskClick: options.onMaskClick,
      onUpdateShow: options.onUpdateShow,
      hide: () => {
        setModalShow(instance, false)
      },
      destroy: () => {
        destroyModal(key)
      },
      update: (nextOptions: Partial<ModalOptions>) => {
        applyModalOptions(instance, nextOptions)
      }
    }) as ModalReactive

    destroyedModalKeys.delete(key)
    modalList.value = [...modalList.value, instance]
    return instance
  }

  function destroyAll(): void {
    modalList.value.slice().forEach((modal) => {
      destroyModal(modal.key)
    })
  }

  return {
    create,
    destroyAll
  }
}

export function useModalProviderState() {
  function isPendingDestroy(key: number): boolean {
    return destroyedModalKeys.has(key)
  }

  function setProviderTarget(target: string | HTMLElement): void {
    providerTarget.value = normalizeProviderTarget(target)
  }

  return {
    modals: modalList,
    providerTarget,
    removeModal,
    isPendingDestroy,
    setProviderTarget
  }
}
