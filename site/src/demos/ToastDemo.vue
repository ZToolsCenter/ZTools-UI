<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'ztools-ui-components/common/Toast'
import { ZToast } from 'ztools-ui-components/common/Toast'

const { toastState, success, error, warning, info } = useToast()
</script>

<template>
  <div class="demo-section">
    <p>轻提示组件，支持 useToast 组合式调用。</p>
    <div class="demo-box">
      <button class="btn" @click="success('操作成功')">Success</button>
      <button class="btn" @click="error('操作失败')">Error</button>
      <button class="btn" @click="warning('注意')">Warning</button>
      <button class="btn" @click="info('提示信息')">Info</button>
    </div>
    <ZToast
      :visible="toastState.visible"
      :message="toastState.message"
      :type="toastState.type"
      :duration="toastState.duration"
      @update:visible="toastState.visible = $event"
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
