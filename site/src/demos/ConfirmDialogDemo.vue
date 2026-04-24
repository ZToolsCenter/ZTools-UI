<script setup lang="ts">
import { ref } from 'vue'
import { ConfirmDialog } from 'ztools-ui-components/common/ConfirmDialog'

const visible = ref(false)
const dialogType = ref<'info' | 'warning' | 'danger'>('info')

function open(type: 'info' | 'warning' | 'danger') {
  dialogType.value = type
  visible.value = true
}
</script>

<template>
  <div class="demo-section">
    <p>确认弹窗，支持 info / warning / danger 三种样式。</p>
    <div class="demo-box">
      <button class="btn" @click="open('info')">Info 确认</button>
      <button class="btn" @click="open('warning')">Warning 确认</button>
      <button class="btn" @click="open('danger')">Danger 确认</button>
    </div>
    <ConfirmDialog
      v-model:visible="visible"
      title="操作确认"
      message="你确定要执行此操作吗？此操作无法撤销。"
      :type="dialogType"
    />
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
  gap: 8px;
  flex-wrap: wrap;
}
.btn {
  padding: 6px 16px;
  border: 2px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  color: var(--text-color);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
}
</style>
