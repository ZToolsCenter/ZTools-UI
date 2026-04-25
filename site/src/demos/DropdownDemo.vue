<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from 'ztools-ui-components/common/Dropdown'
import type { DropdownValueType } from 'ztools-ui-components/common/Dropdown'

const selected = ref('blue')
const clearableSelected = ref('purple')
const multipleSelected = ref<DropdownValueType[]>(['blue', 'green', 'orange'])
const limitedSelected = ref<DropdownValueType[]>(['blue', 'purple', 'green', 'orange'])
const tagValues = ref<DropdownValueType[]>(['设计', '效率'])
const sizeValue = ref('medium')
const statusValue = ref('')
const scrollValue = ref('option-1')
const scrollCount = ref(0)

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
</script>

<template>
  <div class="demo-section">
    <p>下拉选择器支持单选、多选、可清空、尺寸、验证状态、滚动事件和 tag 输入模式。</p>

    <div class="demo-group">
      <h4>基础用法</h4>
      <div class="demo-box">
        <Dropdown v-model="selected" :options="options" placeholder="选择主题色" />
        <span class="demo-value">当前值: {{ selected }}</span>
      </div>
    </div>

    <div class="demo-group">
      <h4>多选与最大标签数量</h4>
      <div class="demo-box">
        <Dropdown v-model="multipleSelected" :options="options" multiple clearable placeholder="选择多个颜色" />
        <Dropdown
          v-model="limitedSelected"
          :options="options"
          multiple
          clearable
          :max-tag-count="2"
          placeholder="最多显示 2 个标签"
        />
      </div>
      <span class="demo-value">多选值: {{ multipleSelected.join(', ') }}</span>
    </div>

    <div class="demo-group">
      <h4>可清空</h4>
      <div class="demo-box">
        <Dropdown v-model="clearableSelected" :options="options" clearable placeholder="可清空选择" />
        <span class="demo-value">当前值: {{ clearableSelected || '未选择' }}</span>
      </div>
    </div>

    <div class="demo-group">
      <h4>尺寸</h4>
      <div class="demo-box demo-box-wrap demo-align-end">
        <Dropdown v-model="sizeValue" :options="sizeOptions" size="small" />
        <Dropdown v-model="sizeValue" :options="sizeOptions" size="medium" />
        <Dropdown v-model="sizeValue" :options="sizeOptions" size="large" />
      </div>
    </div>

    <div class="demo-group">
      <h4>验证状态</h4>
      <div class="demo-box demo-box-wrap demo-align-start">
        <Dropdown v-model="statusValue" :options="options" status="success" message="选择可用" placeholder="成功状态" />
        <Dropdown v-model="statusValue" :options="options" status="warning" message="建议确认后选择" placeholder="警告状态" />
        <Dropdown v-model="statusValue" :options="options" status="error" message="请选择一个选项" placeholder="错误状态" />
      </div>
    </div>

    <div class="demo-group">
      <h4>滚动事件</h4>
      <div class="demo-box">
        <Dropdown v-model="scrollValue" :options="longOptions" placeholder="滚动菜单" @scroll="handleScroll" />
        <span class="demo-value">滚动触发次数: {{ scrollCount }}</span>
      </div>
    </div>

    <div class="demo-group">
      <h4>Tag 输入模式</h4>
      <div class="demo-box">
        <Dropdown
          v-model="tagValues"
          :options="tagOptions"
          mode="tags"
          clearable
          placeholder="输入后按 Enter 创建标签"
        />
        <span class="demo-value">标签: {{ tagValues.join(', ') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.demo-section p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.demo-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-group h4 {
  margin: 0;
  color: var(--text-color);
  font-size: 14px;
}

.demo-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.demo-box-wrap {
  flex-wrap: wrap;
}

.demo-align-start {
  align-items: flex-start;
}

.demo-align-end {
  align-items: flex-end;
}

.demo-value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
