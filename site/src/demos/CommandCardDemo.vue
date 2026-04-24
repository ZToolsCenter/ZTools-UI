<script setup lang="ts">
import { CommandCard } from 'ztools-ui-components/common/CommandCard'
</script>

<template>
  <div class="demo-section">
    <p>指令卡片组件，展示单个命令的图标、名称和元信息。</p>
    <div class="demo-box" style="flex-direction: column; max-width: 400px;">
      <CommandCard :command="{ name: '翻译', icon: '🌐', subType: 'app', path: '/usr/bin/translate' }" />
      <CommandCard :command="{ name: '微信', icon: '💬', subType: 'app', path: 'C:\\WeChat\\wechat.exe' }" />
      <CommandCard :command="{ name: '系统设置', icon: '⚙️', subType: 'system-setting', category: '网络', settingUri: 'ms-settings:network' }" />
      <CommandCard :command="{ name: '自定义命令', subType: 'text' }" />
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
</style>
