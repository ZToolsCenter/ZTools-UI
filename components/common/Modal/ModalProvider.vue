<script setup lang="ts">
import { computed, defineComponent, onBeforeUnmount, watch } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import type { ModalDraggable, ModalProviderProps, ModalReactive } from './Modal'
import ZModal from './Modal.vue'
import { useModalProviderState } from './useModal'

defineOptions({ name: 'ZModalProvider' })

const props = withDefaults(defineProps<ModalProviderProps>(), {
  to: 'body'
})

const { modals, providerTarget, removeModal, isPendingDestroy, setProviderTarget } = useModalProviderState()

const RenderVNodeChild = defineComponent({
  name: 'RenderModalVNodeChild',
  props: {
    content: {
      type: null as unknown as PropType<VNodeChild>,
      default: null
    }
  },
  setup(renderProps) {
    return () => {
      if (renderProps.content == null || renderProps.content === false) {
        return null
      }

      return renderProps.content as VNodeChild
    }
  }
})

const modalList = computed(() => modals.value)
const defaultTeleportTarget = computed(() => providerTarget.value)

watch(
  () => props.to,
  (value) => {
    setProviderTarget(value)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  setProviderTarget('body')
})

function resolveTeleportTarget(modal: ModalReactive): string | HTMLElement | false {
  if (modal.to !== undefined) {
    return modal.to
  }

  return defaultTeleportTarget.value
}

function resolveDraggable(modal: ModalReactive): ModalDraggable {
  return modal.draggable ?? false
}

function handleUpdateShow(modal: ModalReactive, value: boolean): void {
  modal.show = value
  modal.onUpdateShow?.(value)
}

function handleAfterEnter(modal: ModalReactive): void {
  modal.onAfterEnter?.()
}

function handleAfterLeave(modal: ModalReactive): void {
  modal.onAfterLeave?.()

  if (isPendingDestroy(modal.key)) {
    removeModal(modal.key)
  }
}

function handleEsc(modal: ModalReactive): void {
  modal.onEsc?.()
}

function handleMaskClick(modal: ModalReactive, event: MouseEvent): void {
  modal.onMaskClick?.(event)
}
</script>

<template>
  <template v-for="modal in modalList" :key="modal.key">
    <ZModal
      :show="modal.show"
      :to="resolveTeleportTarget(modal)"
      :z-index="modal.zIndex"
      :show-mask="modal.showMask"
      :mask-closable="modal.maskClosable"
      :close-on-esc="modal.closeOnEsc"
      :block-scroll="modal.blockScroll"
      :auto-focus="modal.autoFocus"
      :trap-focus="modal.trapFocus"
      :display-directive="modal.displayDirective"
      :draggable="resolveDraggable(modal)"
      :preset="modal.preset"
      :transform-origin="modal.transformOrigin"
      @update:show="handleUpdateShow(modal, $event)"
      @after-enter="handleAfterEnter(modal)"
      @after-leave="handleAfterLeave(modal)"
      @esc="handleEsc(modal)"
      @mask-click="handleMaskClick(modal, $event)"
    >
      <RenderVNodeChild :content="modal.render()" />
    </ZModal>
  </template>
</template>
