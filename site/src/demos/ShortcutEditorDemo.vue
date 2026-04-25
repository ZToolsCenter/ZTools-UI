<script setup lang="ts">
import { ZShortcutEditor } from 'ztools-ui-components/common/ShortcutEditor'

function handleSave(shortcut: string, target: string) {
  console.log('save shortcut', shortcut, target)
}
</script>

<template>
  <div class="demo-section">
    <p>快捷键编辑面板，内含 HotkeyInput 和目标指令输入，基于 DetailPanel 实现。</p>
    <div class="demo-box">
      <ZShortcutEditor prefill-target="示例指令" is-app-shortcut @back="() => {}" @save="handleSave" />
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
  position: relative;
  height: 400px;
  margin-top: 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
}
</style>
