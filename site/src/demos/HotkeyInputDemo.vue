<script setup lang="ts">
import { ref } from 'vue'
import { ZHotkeyInput } from 'ztools-ui-components/common/HotkeyInput'

const shortcut = ref('')
</script>

<template>
  <div class="demo-section">
    <p>快捷键录制输入框。点击后按下组合键即可录制。</p>
    <div class="demo-box">
      <ZHotkeyInput v-model="shortcut" platform="win32" />
      <span class="demo-value">当前值: {{ shortcut || '未设置' }}</span>
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
