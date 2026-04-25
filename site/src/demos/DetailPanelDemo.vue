<script setup lang="ts">
import { ref } from 'vue'
import { ZDetailPanel } from 'ztools-ui-components/common/DetailPanel'
import { ZShortcutEditor } from 'ztools-ui-components/common/ShortcutEditor'

const showEditor = ref(false)
</script>

<template>
  <div class="demo-section">
    <p>快捷键编辑面板，内含 HotkeyInput 和目标指令输入，基于 DetailPanel 实现。</p>
    <div class="demo-box">
      <button class="btn" @click="showEditor = true">打开编辑器</button>
    </div>
    <div style="position: relative; height: 400px; margin-top: 12px; border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden;">
      <ZDetailPanel title="快捷键管理" @back="showEditor = false">
        <div style="padding: 24px;">
          <p>DetailPanel 内容区域，可滚动。</p>
          <p style="margin-top: 8px;">点击返回按钮可关闭面板。</p>
        </div>
      </ZDetailPanel>
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
  gap: 8px;
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
