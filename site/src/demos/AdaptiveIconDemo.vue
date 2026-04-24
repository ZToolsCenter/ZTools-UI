<script setup lang="ts">
import { AdaptiveIcon } from 'ztools-ui-components/common/AdaptiveIcon'
</script>

<template>
  <div class="demo-section">
    <p>自适应图标组件，能根据明暗模式自动调整图标显示。依赖宿主图片分析 API。</p>
    <div class="demo-box">
      <div class="icon-item">
        <AdaptiveIcon src="https://vuejs.org/images/logo.png" style="width: 48px; height: 48px" />
        <span>Vue Logo</span>
      </div>
      <div class="icon-item">
        <AdaptiveIcon src="https://vuejs.org/images/logo.png" force-adaptive style="width: 48px; height: 48px" />
        <span>强制自适应</span>
      </div>
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
  gap: 24px;
  align-items: center;
}
.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
