<script setup lang="ts">
import { h, ref } from 'vue'
import { ZButton } from 'ztools-ui-components/common/Button'
import { ZModal, ZModalProvider, useModal } from 'ztools-ui-components/common/Modal'
import type { ModalDraggable, ModalPreset, ModalReactive } from 'ztools-ui-components/common/Modal'

type ModalDemoVariant =
  | 'basic'
  | 'controlled'
  | 'uncontrolled'
  | 'mask'
  | 'display'
  | 'preset'
  | 'transform'
  | 'draggable'
  | 'service'

const props = withDefaults(
  defineProps<{
    variant?: ModalDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const basicShow = ref(false)
const controlledShow = ref(false)
const uncontrolledMounted = ref(false)
const noMaskShow = ref(false)
const noCloseMaskShow = ref(false)
const displayIfShow = ref(false)
const displayShowShow = ref(false)
const presetShow = ref(false)
const mouseOriginShow = ref(false)
const centerOriginShow = ref(false)
const boundedShow = ref(false)
const unboundedShow = ref(false)
const currentPreset = ref<ModalPreset>('dialog')
const unboundedDraggable = { bounds: 'none' } as ModalDraggable
const { create, destroyAll } = useModal()

function openPreset(preset: ModalPreset): void {
  currentPreset.value = preset
  presetShow.value = true
}

function openServiceModal(): void {
  let instance: ModalReactive

  instance = create({
    preset: 'dialog',
    draggable: true,
    render: () =>
      h('div', { class: 'modal-demo__shell' }, [
        h(
          'div',
          {
            class: 'modal-demo__header',
            'data-modal-drag-handle': ''
          },
          [
            h('div', { class: 'modal-demo__title' }, '服务式弹窗'),
            h('button', {
              class: 'modal-demo__close',
              type: 'button',
              'aria-label': '关闭',
              'data-modal-drag-ignore': '',
              onClick: () => instance.hide()
            })
          ]
        ),
        h('div', { class: 'modal-demo__body' }, [
          h('p', '通过 ZModalProvider + useModal().create({ render }) 可以在任意位置创建模态框。'),
          h('p', '这个示例没有依赖额外的内容包装组件。')
        ]),
        h('div', { class: 'modal-demo__footer' }, [
          h(
            ZButton,
            {
              onClick: () => instance.hide()
            },
            {
              default: () => '关闭'
            }
          ),
          h(
            ZButton,
            {
              type: 'primary',
              onClick: () => instance.destroy()
            },
            {
              default: () => '销毁'
            }
          )
        ])
      ])
  })
}
</script>

<template>
  <div class="modal-demo">
    <template v-if="props.variant === 'basic'">
      <div class="modal-demo__column">
        <ZButton type="primary" @click="basicShow = true">打开弹窗</ZButton>
        <span class="modal-demo__value">使用默认插槽自行组织 header、body 和 footer 结构。</span>
      </div>
      <ZModal v-model:show="basicShow" preset="dialog">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">基础弹窗</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="basicShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>Modal 负责显示状态、遮罩、焦点和动画。</p>
            <p>内容结构由默认插槽自行决定，不强制额外的内容子组件。</p>
          </div>
          <div class="modal-demo__footer">
            <ZButton @click="basicShow = false">取消</ZButton>
            <ZButton type="primary" @click="basicShow = false">确认</ZButton>
          </div>
        </div>
      </ZModal>
    </template>

    <template v-else-if="props.variant === 'controlled'">
      <div class="modal-demo__column">
        <div class="modal-demo__row">
          <ZButton type="primary" @click="controlledShow = true">打开受控弹窗</ZButton>
          <ZButton @click="controlledShow = false">外部关闭</ZButton>
        </div>
        <span class="modal-demo__value">show: {{ controlledShow }}</span>
      </div>
      <ZModal :show="controlledShow" @update:show="controlledShow = $event">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">受控模式</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="controlledShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>通过 show 和 update:show 完全由外部状态驱动。</p>
          </div>
        </div>
      </ZModal>
    </template>

    <template v-else-if="props.variant === 'uncontrolled'">
      <div class="modal-demo__column">
        <ZButton @click="uncontrolledMounted = true">打开非受控弹窗</ZButton>
        <span class="modal-demo__value">点击后挂载 default-show 的弹窗，关闭后自动卸载。</span>
      </div>
      <ZModal v-if="uncontrolledMounted" default-show @after-leave="uncontrolledMounted = false">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">非受控模式</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="uncontrolledMounted = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>使用 default-show 指定挂载后的初始显示状态。</p>
          </div>
        </div>
      </ZModal>
    </template>

    <template v-else-if="props.variant === 'mask'">
      <div class="modal-demo__row">
        <ZButton @click="noMaskShow = true">无遮罩</ZButton>
        <ZButton @click="noCloseMaskShow = true">遮罩不可关闭</ZButton>
      </div>
      <ZModal v-model:show="noMaskShow" :show-mask="false" preset="dialog">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">无遮罩</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="noMaskShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>showMask=false 时不会渲染遮罩，焦点也不会被有效限制在弹窗内。</p>
          </div>
        </div>
      </ZModal>
      <ZModal v-model:show="noCloseMaskShow" :mask-closable="false" preset="dialog">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">遮罩不可关闭</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="noCloseMaskShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>点击遮罩会触发 mask-click，但不会自动关闭。</p>
          </div>
          <div class="modal-demo__footer">
            <ZButton type="primary" @click="noCloseMaskShow = false">我知道了</ZButton>
          </div>
        </div>
      </ZModal>
    </template>

    <template v-else-if="props.variant === 'display'">
      <div class="modal-demo__row">
        <ZButton @click="displayIfShow = true">displayDirective=&quot;if&quot;</ZButton>
        <ZButton @click="displayShowShow = true">displayDirective=&quot;show&quot;</ZButton>
      </div>
      <ZModal v-model:show="displayIfShow" display-directive="if">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">v-if 渲染</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="displayIfShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>关闭后内容节点会卸载。</p>
          </div>
        </div>
      </ZModal>
      <ZModal v-model:show="displayShowShow" display-directive="show">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">v-show 渲染</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="displayShowShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>关闭后内容节点会保留，只切换显示状态。</p>
          </div>
        </div>
      </ZModal>
    </template>

    <template v-else-if="props.variant === 'preset'">
      <div class="modal-demo__row">
        <ZButton @click="openPreset('dialog')">dialog 预设</ZButton>
        <ZButton @click="openPreset('card')">card 预设</ZButton>
      </div>
      <ZModal v-model:show="presetShow" :preset="currentPreset">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">preset: {{ currentPreset }}</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="presetShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <div class="modal-demo__card">
              <strong>dialog</strong>
              <span>更适合确认、表单或短流程。</span>
            </div>
            <div class="modal-demo__card">
              <strong>card</strong>
              <span>更适合内容更多的说明、预览或操作面板。</span>
            </div>
          </div>
          <div class="modal-demo__footer">
            <ZButton type="primary" @click="presetShow = false">关闭</ZButton>
          </div>
        </div>
      </ZModal>
    </template>

    <template v-else-if="props.variant === 'transform'">
      <div class="modal-demo__row">
        <ZButton @click="mouseOriginShow = true">鼠标原点</ZButton>
        <ZButton @click="centerOriginShow = true">中心原点</ZButton>
      </div>
      <ZModal v-model:show="mouseOriginShow" transform-origin="mouse" preset="dialog">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">transform-origin: mouse</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="mouseOriginShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>从点击按钮的位置附近开始执行缩放动画。</p>
          </div>
        </div>
      </ZModal>
      <ZModal v-model:show="centerOriginShow" transform-origin="center" preset="dialog">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">transform-origin: center</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="centerOriginShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>始终从弹窗中心开始执行进入和离开动画。</p>
          </div>
        </div>
      </ZModal>
    </template>

    <template v-else-if="props.variant === 'draggable'">
      <div class="modal-demo__row">
        <ZButton @click="boundedShow = true">可拖拽</ZButton>
        <ZButton @click="unboundedShow = true">可超出视口</ZButton>
      </div>
      <ZModal v-model:show="boundedShow" draggable preset="card">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">有边界拖拽</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="boundedShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>拖拽 header 可以移动弹窗，默认会被限制在视口内。</p>
          </div>
        </div>
      </ZModal>
      <ZModal v-model:show="unboundedShow" :draggable="unboundedDraggable" preset="card">
        <div class="modal-demo__shell">
          <div class="modal-demo__header" data-modal-drag-handle>
            <div class="modal-demo__title">无边界拖拽</div>
            <button class="modal-demo__close" type="button" aria-label="关闭" data-modal-drag-ignore @click="unboundedShow = false">
            </button>
          </div>
          <div class="modal-demo__body">
            <p>当 bounds 为 none 时，可以将弹窗拖出视口范围。</p>
          </div>
        </div>
      </ZModal>
    </template>

    <template v-else-if="props.variant === 'service'">
      <div class="modal-demo__column">
        <div class="modal-demo__row">
          <ZButton type="primary" @click="openServiceModal">create({ render })</ZButton>
          <ZButton @click="destroyAll">destroyAll()</ZButton>
        </div>
        <span class="modal-demo__value">服务式调用需要在页面中放置一个 ZModalProvider。</span>
      </div>
      <ZModalProvider />
    </template>
  </div>
</template>

<style scoped>
.modal-demo,
.modal-demo__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.modal-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.modal-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}

.modal-demo__shell {
  display: flex;
  min-width: min(100vw - 48px, 320px);
  min-height: 0;
  flex-direction: column;
}

.modal-demo__header,
.modal-demo__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-color: var(--divider-color);
}

.modal-demo__header {
  border-bottom: 1px solid var(--divider-color);
}

.modal-demo__footer {
  justify-content: flex-end;
  border-top: 1px solid var(--divider-color);
}

.modal-demo__title {
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-demo__close {
  position: relative;
  display: inline-flex;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  font-size: 0;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.modal-demo__close::before,
.modal-demo__close::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 1.5px;
  background: currentColor;
  border-radius: 1px;
  transform-origin: center;
}

.modal-demo__close::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.modal-demo__close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.modal-demo__close:hover {
  border-color: var(--control-border);
  color: var(--text-color);
  background: var(--control-bg);
}

.modal-demo__body {
  display: grid;
  gap: 12px;
  padding: 18px;
}

.modal-demo__body p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.modal-demo__card {
  display: grid;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--control-border);
  border-radius: 10px;
  background: var(--control-bg);
}

.modal-demo__card span {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}
</style>
