<script setup lang="ts">
import { ref } from 'vue'
import { Radio } from 'ztools-ui-components/common/Radio'

type RadioDemoVariant = 'basic' | 'disabled'

const props = withDefaults(
  defineProps<{
    variant?: RadioDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const value = ref('blue')
</script>

<template>
  <div class="radio-demo">
    <template v-if="props.variant === 'basic'">
      <div class="radio-demo__column">
        <div class="radio-demo__row">
          <Radio v-model="value" name="theme" value="blue">蓝色</Radio>
          <Radio v-model="value" name="theme" value="purple">紫色</Radio>
          <Radio v-model="value" name="theme" value="green">绿色</Radio>
        </div>
        <span class="radio-demo__value">当前值: {{ value }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'disabled'">
      <div class="radio-demo__row">
        <Radio model-value="blue" name="disabled-theme" value="blue" disabled>蓝色（禁用）</Radio>
        <Radio model-value="blue" name="disabled-theme" value="orange" disabled>橙色（禁用）</Radio>
      </div>
    </template>
  </div>
</template>

<style scoped>
.radio-demo,
.radio-demo__column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.radio-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
