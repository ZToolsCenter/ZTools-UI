<script setup lang="ts">
import { ref } from 'vue'
import { ZCheckbox } from 'ztools-ui-components/common/Checkbox'

type CheckboxDemoVariant = 'basic' | 'indeterminate' | 'disabled'

const props = withDefaults(
  defineProps<{
    variant?: CheckboxDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const checked = ref(true)
const indeterminate = ref(true)
</script>

<template>
  <div class="checkbox-demo">
    <template v-if="props.variant === 'basic'">
      <div class="checkbox-demo__column">
        <div class="checkbox-demo__row">
          <ZCheckbox v-model="checked">启用插件</ZCheckbox>
          <ZCheckbox :model-value="false">未选中</ZCheckbox>
        </div>
        <span class="checkbox-demo__value">当前值: {{ checked }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'indeterminate'">
      <div class="checkbox-demo__column">
        <ZCheckbox v-model="indeterminate" indeterminate>部分选中</ZCheckbox>
        <span class="checkbox-demo__value">用于树形或批量选择的半选状态</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'disabled'">
      <div class="checkbox-demo__row">
        <ZCheckbox :model-value="true" disabled>已选禁用</ZCheckbox>
        <ZCheckbox :model-value="false" disabled>未选禁用</ZCheckbox>
      </div>
    </template>
  </div>
</template>

<style scoped>
.checkbox-demo,
.checkbox-demo__column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.checkbox-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
