<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'ztools-ui-components/common/Slider'

const value = ref(50)
</script>

<template>
  <div class="demo-section">
    <p>滑块控件，支持 v-model 双向绑定、自定义范围和格式化。</p>
    <div class="demo-box">
      <div style="width: 300px">
        <Slider v-model="value" :min="0" :max="100" :step="1" />
      </div>
      <span class="demo-value">当前值: {{ value }}</span>
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
