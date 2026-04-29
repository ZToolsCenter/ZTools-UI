<script setup lang="ts">
import { ref } from 'vue'
import { ZButton } from 'ztools-ui-components/common/Button'
import { ZPopover } from 'ztools-ui-components/common/Popover'
import type { PopoverPlacement } from 'ztools-ui-components/common/Popover'

type PopoverDemoVariant =
  | 'basic'
  | 'trigger'
  | 'placement'
  | 'header-footer'
  | 'controlled'
  | 'manual-position'
  | 'width-arrow-overlap'
  | 'raw-scrollable'

const props = withDefaults(
  defineProps<{
    variant?: PopoverDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const manualShow = ref(false)
const controlledShow = ref(false)
const controlledClickoutsideCount = ref(0)
const manualPositionShow = ref(false)
const manualX = ref(0)
const manualY = ref(0)

type PlacementGridCell = PopoverPlacement | 'center' | null

const placementGrid: PlacementGridCell[][] = [
  [null, 'top-start', 'top', 'top-end', null],
  [null, 'left-start', null, 'right-start', null],
  [null, 'left', 'center', 'right', null],
  [null, 'left-end', null, 'right-end', null],
  [null, 'bottom-start', 'bottom', 'bottom-end', null]
]

const scrollItems = Array.from({ length: 14 }, (_, index) => `滚动内容 ${index + 1}`)

function handleControlledUpdate(value: boolean): void {
  controlledShow.value = value
}

function handleControlledClickoutside(): void {
  controlledClickoutsideCount.value += 1
}

function toggleManualPosition(event?: MouseEvent): void {
  if (manualPositionShow.value) {
    manualPositionShow.value = false
    return
  }

  const trigger = event?.currentTarget as HTMLElement | null
  const rect = trigger?.getBoundingClientRect()

  if (rect) {
    manualX.value = Math.round(rect.left)
    manualY.value = Math.round(rect.bottom + 12)
  }

  manualPositionShow.value = true
}

function nudgeManualPosition(): void {
  manualX.value += 24
  manualY.value += 16
  manualPositionShow.value = true
}
</script>

<template>
  <div class="popover-demo">
    <template v-if="props.variant === 'basic'">
      <div class="popover-demo__column">
        <ZPopover show-arrow keep-alive-on-hover>
          <template #trigger>
            <ZButton type="primary">悬停查看</ZButton>
          </template>
          这是一个基础 Popover，可用于补充说明、轻量提示和上下文内容。
        </ZPopover>
        <span class="popover-demo__value">默认触发方式为 hover。</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'trigger'">
      <div class="popover-demo__grid popover-demo__grid--trigger">
        <ZPopover show-arrow keep-alive-on-hover>
          <template #trigger>
            <ZButton>hover</ZButton>
          </template>
          鼠标移入触发区域时打开。
        </ZPopover>

        <ZPopover trigger="click" show-arrow>
          <template #trigger>
            <ZButton>click</ZButton>
          </template>
          点击触发区域切换显示状态。
        </ZPopover>

        <ZPopover trigger="focus" show-arrow>
          <template #trigger>
            <ZButton>focus</ZButton>
          </template>
          聚焦 trigger 或其内部可聚焦元素时显示。
        </ZPopover>

        <ZPopover trigger="manual" :show="manualShow" show-arrow @update:show="manualShow = $event">
          <template #trigger>
            <ZButton @click="manualShow = !manualShow">manual</ZButton>
          </template>
          手动模式只响应外部 show 状态。
        </ZPopover>
      </div>
    </template>

    <template v-else-if="props.variant === 'placement'">
      <div class="popover-demo__placement-grid">
        <template v-for="(row, rowIndex) in placementGrid" :key="`row-${rowIndex}`">
          <template v-for="(placement, columnIndex) in row" :key="`${rowIndex}-${columnIndex}`">
            <div v-if="placement === null" class="popover-demo__placement-spacer" aria-hidden="true"></div>
            <div v-else-if="placement === 'center'" class="popover-demo__placement-center">Popover</div>
            <ZPopover v-else :placement="placement" show-arrow keep-alive-on-hover>
              <template #trigger>
                <ZButton size="small" class="popover-demo__placement-trigger">{{ placement }}</ZButton>
              </template>
              当前 placement: {{ placement }}
            </ZPopover>
          </template>
        </template>
      </div>
    </template>


    <template v-else-if="props.variant === 'header-footer'">
      <ZPopover
        trigger="click"
        show-arrow
        header-class="popover-demo__header-accent"
        :header-style="{ fontWeight: 600 }"
        :footer-style="{ color: 'var(--primary-color)' }"
      >
        <template #trigger>
          <ZButton>打开结构化内容</ZButton>
        </template>
        <template #header>
          标题区域
        </template>
        默认内容区支持任意插槽内容，也可以继续放表单、说明文字或操作入口。
        <template #footer>
          底部区域已应用 footer-style。
        </template>
      </ZPopover>
    </template>

    <template v-else-if="props.variant === 'controlled'">
      <div class="popover-demo__column">
        <ZPopover
          trigger="click"
          :show="controlledShow"
          show-arrow
          @update:show="handleControlledUpdate"
          @clickoutside="handleControlledClickoutside"
        >
          <template #trigger>
            <ZButton>{{ controlledShow ? '关闭' : '打开' }}受控浮层</ZButton>
          </template>
          当前显示状态由外部 show 控制，点击外部也会通过事件通知父组件。
          <template #footer>
            <button class="popover-demo__text-button" type="button" @click="controlledShow = false">关闭</button>
          </template>
        </ZPopover>
        <span class="popover-demo__value">
          show: {{ controlledShow ? 'true' : 'false' }} / clickoutside: {{ controlledClickoutsideCount }}
        </span>
      </div>
    </template>

    <template v-else-if="props.variant === 'manual-position'">
      <div class="popover-demo__column">
        <div class="popover-demo__row">
          <ZButton @click="toggleManualPosition($event)">
            {{ manualPositionShow ? '关闭' : '打开' }}手动定位
          </ZButton>
          <ZButton @click="nudgeManualPosition">移动位置</ZButton>
        </div>
        <span class="popover-demo__value">x: {{ manualX }} / y: {{ manualY }}</span>
        <ZPopover trigger="manual" :show="manualPositionShow" :x="manualX" :y="manualY" show-arrow>
          传入 x 和 y 后，会忽略 trigger 锚点并按视口坐标定位。
        </ZPopover>
      </div>
    </template>

    <template v-else-if="props.variant === 'width-arrow-overlap'">
      <div class="popover-demo__column popover-demo__column--stretch">
        <div class="popover-demo__row popover-demo__row--align-start">
          <ZPopover trigger="click" width="trigger" show-arrow>
            <template #trigger>
              <ZButton class="popover-demo__stretch-trigger">width="trigger"</ZButton>
            </template>
            面板宽度会与触发元素保持一致。
          </ZPopover>

          <ZPopover trigger="click" :width="280" show-arrow>
            <template #trigger>
              <ZButton>固定 280px</ZButton>
            </template>
            也可以直接传入数值宽度。
          </ZPopover>
        </div>

        <div class="popover-demo__inline-stage">
          <ZPopover trigger="click" overlap :to="false" show-arrow>
            <template #trigger>
              <ZButton>overlap + to=false</ZButton>
            </template>
            浮层会保留在当前位置渲染，并与触发元素边缘贴合。
          </ZPopover>
        </div>
      </div>
    </template>

    <template v-else-if="props.variant === 'raw-scrollable'">
      <div class="popover-demo__row popover-demo__row--align-start">
        <ZPopover trigger="click" raw>
          <template #trigger>
            <ZButton>Raw 模式</ZButton>
          </template>
          <div class="popover-demo__raw-card">
            <strong>自定义内容</strong>
            <p>raw 模式下只保留浮层行为，不附带默认卡片视觉。</p>
          </div>
        </ZPopover>

        <ZPopover trigger="click" scrollable show-arrow>
          <template #trigger>
            <ZButton>可滚动内容</ZButton>
          </template>
          <template #header>
            更新记录
          </template>
          <div v-for="item in scrollItems" :key="item" class="popover-demo__scroll-item">
            {{ item }}
          </div>
          <template #footer>
            滚动不影响 outside click 与浮层交互。
          </template>
        </ZPopover>
      </div>
    </template>
  </div>
</template>

<style scoped>
.popover-demo,
.popover-demo__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.popover-demo__column--stretch {
  width: 100%;
}

.popover-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.popover-demo__row--align-start {
  align-items: flex-start;
}

.popover-demo__grid {
  display: grid;
  gap: 12px;
}

.popover-demo__grid--trigger {
  grid-template-columns: repeat(auto-fit, minmax(120px, max-content));
}

.popover-demo__placement-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto minmax(0, 1fr);
  column-gap: 8px;
  row-gap: 10px;
  width: min(100%, 520px);
  margin-inline: auto;
  align-items: center;
}

.popover-demo__placement-grid :deep(.zt-popover) {
  display: flex;
  justify-content: center;
}

.popover-demo__placement-grid :deep(.zt-popover__trigger) {
  width: auto;
}

.popover-demo__placement-grid :deep(.zt-button__content) {
  white-space: nowrap;
}

.popover-demo__placement-spacer {
  min-width: 0;
  min-height: 40px;
}

.popover-demo__placement-center {
  min-width: 92px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--control-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--control-bg), var(--bg-color) 40%);
  color: var(--text-secondary);
  font-size: 12px;
}

.popover-demo__placement-trigger {
  width: auto;
  min-width: 92px;
  min-height: 28px;
  justify-content: center;
  padding-inline: 10px;
  font-size: 12px;
  line-height: 1.4;
}

.popover-demo__placement-trigger:hover {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  color: var(--primary-color);
}

.popover-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}

.popover-demo__text-button {
  border: 1px solid var(--control-border);
  border-radius: 8px;
  background: var(--control-bg);
  color: var(--primary-color);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  padding: 8px 12px;
  font-size: 13px;
}

.popover-demo__stretch-trigger {
  width: 220px;
  justify-content: flex-start;
}

.popover-demo__text-button:hover {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.popover-demo__header-accent {
  color: var(--primary-color);
}

.popover-demo__inline-stage {
  display: inline-flex;
  align-self: flex-start;
  padding: 2px;
  position: relative;
  overflow: visible;
}

.popover-demo__raw-card {
  width: 240px;
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color), white 84%), var(--bg-color));
  color: var(--text-color);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.popover-demo__raw-card p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.popover-demo__scroll-item + .popover-demo__scroll-item {
  margin-top: 8px;
}

@media (max-width: 640px) {
  .popover-demo__placement-grid {
    width: 100%;
    column-gap: 6px;
    row-gap: 8px;
  }

  .popover-demo__placement-center,
  .popover-demo__placement-trigger {
    min-width: 0;
  }
}

@media (max-width: 560px) {
  .popover-demo__placement-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .popover-demo__placement-spacer {
    display: none;
  }
}

@media (max-width: 480px) {
  .popover-demo__placement-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 360px) {
  .popover-demo__placement-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

