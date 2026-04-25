<script setup lang="ts">
import { ZCommandTag } from 'ztools-ui-components/common/CommandTag'
</script>

<template>
  <div class="demo-section">
    <p>指令标签，用于显示指令的匹配类型（文本、正则、文件等）。</p>
    <div class="demo-box" style="flex-wrap: wrap;">
      <ZCommandTag :command="{ name: '搜索', type: 'text' }" />
      <ZCommandTag :command="{ name: 'URL匹配', type: 'regex' }" />
      <ZCommandTag :command="{ name: '任意文本', type: 'over', match: { minLength: 1, maxLength: 500 } }" />
      <ZCommandTag :command="{ name: '图片', type: 'img' }" />
      <ZCommandTag :command="{ name: '文件', type: 'files', match: { extensions: ['.pdf', '.doc'], fileType: 'file' } }" />
      <ZCommandTag :command="{ name: '窗口', type: 'window' }" />
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
