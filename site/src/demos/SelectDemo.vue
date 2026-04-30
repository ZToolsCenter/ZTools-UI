<script setup lang="ts">
import { ref } from 'vue'
import { ZSelect } from 'ztools-ui-components/common/Select'
import type { SelectModelValue, SelectSingleModelValue, SelectValueType } from 'ztools-ui-components/common/Select'

type SelectDemoVariant =
  | 'basic'
  | 'multiple'
  | 'clearable'
  | 'size'
  | 'status'
  | 'scroll'
  | 'tags'
  | 'custom-trigger'
  | 'placement'

const props = withDefaults(
  defineProps<{
    variant?: SelectDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const selected = ref<SelectSingleModelValue>('blue')
const multipleSelected = ref<SelectValueType[]>(['blue', 'green', 'orange'])
const limitedSelected = ref<SelectValueType[]>(['blue', 'purple', 'green', 'orange'])
const tagValues = ref<SelectValueType[]>(['设计', '效率'])
const customTriggerValue = ref<SelectSingleModelValue>('green')
const scrollValue = ref<SelectSingleModelValue>('option-1')
const scrollCount = ref(0)
const placementStartValue = ref<SelectSingleModelValue>('blue')
const placementCenterValue = ref<SelectSingleModelValue>('purple')
const placementEndValue = ref<SelectSingleModelValue>('green')
const placementBottomStartValue = ref<SelectSingleModelValue>('pink')
const autoAdjustValue = ref<SelectSingleModelValue>('orange')
const fixedPlacementValue = ref<SelectSingleModelValue>('red')

const options = [
  { label: '蓝色 (Blue)', value: 'blue' },
  { label: '紫色 (Purple)', value: 'purple' },
  { label: '绿色 (Green)', value: 'green' },
  { label: '橙色 (Orange)', value: 'orange' },
  { label: '红色 (Red)', value: 'red' },
  { label: '粉色 (Pink)', value: 'pink' }
]

const sizeOptions = [
  { label: '小尺寸', value: 'small' },
  { label: '默认尺寸', value: 'medium' },
  { label: '大尺寸', value: 'large' }
]

const tagOptions = [
  { label: '设计', value: '设计' },
  { label: '开发', value: '开发' },
  { label: '效率', value: '效率' },
  { label: '自动化', value: '自动化' }
]

const longOptions = Array.from({ length: 24 }, (_, index) => ({
  label: `选项 ${index + 1}`,
  value: `option-${index + 1}`
}))

function handleScroll(): void {
  scrollCount.value += 1
}

function formatSingleValue(value: SelectSingleModelValue): string {
  return value === null || value === '' ? '未选择' : String(value)
}
</script>

<template>
  <div class="select-demo">
    <template v-if="props.variant === 'basic'">
      <div class="select-demo__column">
        <ZSelect v-model="selected" :options="options" placeholder="选择主题色" />
        <span class="select-demo__value">当前值: {{ formatSingleValue(selected) }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'multiple'">
      <div class="select-demo__column">
        <ZSelect v-model="multipleSelected" :options="options" multiple clearable placeholder="选择多个颜色" />
        <ZSelect
          v-model="limitedSelected"
          :options="options"
          multiple
          clearable
          :max-tag-count="2"
          placeholder="最多显示 2 个标签"
        />
        <span class="select-demo__value">多选值: {{ multipleSelected.join(', ') }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'clearable'">
      <div class="select-demo__column">
        <ZSelect v-model="selected" :options="options" clearable placeholder="可清空选择" />
        <span class="select-demo__value">当前值: {{ formatSingleValue(selected) }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'size'">
      <div class="select-demo__row select-demo__row--align-end">
        <ZSelect v-model="selected" :options="sizeOptions" size="small" />
        <ZSelect v-model="selected" :options="sizeOptions" size="medium" />
        <ZSelect v-model="selected" :options="sizeOptions" size="large" />
      </div>
    </template>

    <template v-else-if="props.variant === 'status'">
      <div class="select-demo__row select-demo__row--align-start">
        <ZSelect v-model="selected" :options="options" status="success" message="选择可用" placeholder="成功状态" />
        <ZSelect v-model="selected" :options="options" status="warning" message="建议确认后选择" placeholder="警告状态" />
        <ZSelect v-model="selected" :options="options" status="error" message="请选择一个选项" placeholder="错误状态" />
      </div>
    </template>

    <template v-else-if="props.variant === 'scroll'">
      <div class="select-demo__column">
        <ZSelect v-model="scrollValue" :options="longOptions" placeholder="滚动菜单" @scroll="handleScroll" />
        <span class="select-demo__value">滚动触发次数: {{ scrollCount }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'tags'">
      <div class="select-demo__column">
        <ZSelect
          v-model="tagValues"
          :options="tagOptions"
          mode="tags"
          clearable
          placeholder="输入后按 Enter 创建标签"
        />
        <span class="select-demo__value">标签: {{ tagValues.join(', ') }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'custom-trigger'">
      <div class="select-demo__column">
        <ZSelect v-model="customTriggerValue" :options="options" placeholder="选择主题色">
          <template #trigger="{ triggerProps, setTriggerRef, visible, selectedLabel }">
            <button
              :ref="setTriggerRef"
              v-bind="triggerProps"
              type="button"
              class="select-demo__custom-trigger"
              :class="{ 'select-demo__custom-trigger--open': visible }"
            >
              <span class="select-demo__custom-trigger-label">{{ selectedLabel }}</span>
              <span class="select-demo__custom-trigger-arrow" aria-hidden="true">{{ visible ? '▴' : '▾' }}</span>
            </button>
          </template>
        </ZSelect>
        <span class="select-demo__value">当前值: {{ formatSingleValue(customTriggerValue) }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'placement'">
      <div class="select-demo__column select-demo__column--stretch">
        <div class="select-demo__placement-grid">
          <div class="select-demo__placement-item">
            <span class="select-demo__caption">top-start</span>
            <ZSelect v-model="placementStartValue" :options="options" placement="top-start" placeholder="顶部起点" />
          </div>
          <div class="select-demo__placement-item">
            <span class="select-demo__caption">bottom</span>
            <ZSelect v-model="placementCenterValue" :options="options" placement="bottom" placeholder="底部居中" />
          </div>
          <div class="select-demo__placement-item">
            <span class="select-demo__caption">top-end</span>
            <ZSelect v-model="placementEndValue" :options="options" placement="top-end" placeholder="顶部终点" />
          </div>
          <div class="select-demo__placement-item">
            <span class="select-demo__caption">bottom-start</span>
            <ZSelect
              v-model="placementBottomStartValue"
              :options="options"
              placement="bottom-start"
              placeholder="底部起点"
            />
          </div>
        </div>

        <div class="select-demo__placement-edge">
          <span class="select-demo__caption">靠近右侧时，right-start 会按需翻转或保持原方向</span>
          <div class="select-demo__placement-edge-row">
            <div class="select-demo__placement-item select-demo__placement-item--edge">
              <span class="select-demo__caption">autoAdjustPlacement=true</span>
              <ZSelect v-model="autoAdjustValue" :options="options" placement="right-start" placeholder="自动纠正" />
            </div>
            <div class="select-demo__placement-item select-demo__placement-item--edge">
              <span class="select-demo__caption">autoAdjustPlacement=false</span>
              <ZSelect
                v-model="fixedPlacementValue"
                :options="options"
                placement="right-start"
                :auto-adjust-placement="false"
                placeholder="保持原方向"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.select-demo,
.select-demo__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.select-demo__column--stretch {
  width: 100%;
  align-items: stretch;
}

.select-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.select-demo__row--align-start {
  align-items: flex-start;
}

.select-demo__row--align-end {
  align-items: flex-end;
}

.select-demo__custom-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
  min-height: 38px;
  padding: 0 14px;
  border: 2px solid var(--control-border);
  border-radius: 10px;
  background: linear-gradient(135deg, var(--control-bg), color-mix(in srgb, var(--primary-light-bg), var(--control-bg) 55%));
  color: var(--text-color);
  font: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.select-demo__custom-trigger:hover {
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  color: var(--primary-color);
}

.select-demo__custom-trigger:focus-visible,
.select-demo__custom-trigger--open {
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  box-shadow: 0 0 0 3px var(--primary-light-bg);
  color: var(--primary-color);
}

.select-demo__custom-trigger-label {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.select-demo__custom-trigger-arrow {
  color: var(--text-secondary);
  font-size: 12px;
}

.select-demo__placement-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 12px;
}

.select-demo__placement-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--control-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--control-bg), transparent 10%);
}

.select-demo__placement-item--edge {
  width: min(220px, 100%);
}

.select-demo__placement-edge {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.select-demo__placement-edge-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 12px;
  justify-content: end;
  width: 100%;
}

.select-demo__caption,
.select-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
