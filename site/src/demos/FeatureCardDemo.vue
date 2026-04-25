<script setup lang="ts">
import { ZFeatureCard } from 'ztools-ui-components/common/FeatureCard'
import { ZCommandTag } from 'ztools-ui-components/common/CommandTag'
</script>

<template>
  <div class="demo-section">
    <p>功能卡片，展示插件的一个功能及其关联的指令标签。</p>
    <div class="demo-box" style="flex-direction: column; max-width: 400px;">
      <ZFeatureCard :feature="{ code: 'search', name: '搜索', explain: '全文搜索', icon: '🔍' }">
        <ZCommandTag :command="{ name: '关键词', type: 'text' }" />
        <ZCommandTag :command="{ name: '正则', type: 'regex' }" />
      </ZFeatureCard>
      <ZFeatureCard :feature="{ code: 'translate', name: '翻译', explain: '多语言翻译', icon: '🌐' }">
        <ZCommandTag :command="{ name: '文本', type: 'text' }" />
      </ZFeatureCard>
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
