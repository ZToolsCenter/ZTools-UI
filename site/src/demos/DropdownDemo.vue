<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from 'ztools-ui-components/common/Dropdown'

const selected = ref('blue')
const options = [
  { label: '蓝色 (Blue)', value: 'blue' },
  { label: '紫色 (Purple)', value: 'purple' },
  { label: '绿色 (Green)', value: 'green' },
  { label: '橙色 (Orange)', value: 'orange' },
  { label: '红色 (Red)', value: 'red' },
  { label: '粉色 (Pink)', value: 'pink' }
]
</script>

<template>
  <div class="demo-section">
    <p>下拉选择器，支持 v-model 双向绑定。</p>
    <div class="demo-box">
      <Dropdown v-model="selected" :options="options" placeholder="选择主题色" />
      <span class="demo-value">当前值: {{ selected }}</span>
    </div>
  </div>
</template>

<style scoped>
.demo-section p {
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}
.demo-box {
  display: flex;
  align-items: center;
  gap: 16px;
}
.demo-value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
