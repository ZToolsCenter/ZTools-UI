<script setup lang="ts">
import { ref } from 'vue'
import { ColorPicker } from 'ztools-ui-components/common/ColorPicker'

type ColorPickerDemoVariant = 'basic' | 'size' | 'without-input' | 'disabled'

const props = withDefaults(
  defineProps<{
    variant?: ColorPickerDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const color = ref('#0284c7')
const compactColor = ref('#16a34a')
</script>

<template>
  <div class="color-picker-demo">
    <template v-if="props.variant === 'basic'">
      <div class="color-picker-demo__row">
        <ColorPicker v-model="color" />
        <span class="color-picker-demo__value">当前颜色: {{ color }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'size'">
      <div class="color-picker-demo__row color-picker-demo__row--align-end">
        <ColorPicker v-model="color" size="small" />
        <ColorPicker v-model="color" size="medium" />
        <ColorPicker v-model="color" size="large" />
      </div>
    </template>

    <template v-else-if="props.variant === 'without-input'">
      <div class="color-picker-demo__row">
        <ColorPicker v-model="compactColor" :show-input="false" />
        <span class="color-picker-demo__value">当前颜色: {{ compactColor }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'disabled'">
      <div class="color-picker-demo__row">
        <ColorPicker model-value="#94a3b8" disabled />
        <ColorPicker model-value="#64748b" :show-input="false" disabled />
      </div>
    </template>
  </div>
</template>

<style scoped>
.color-picker-demo,
.color-picker-demo__row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.color-picker-demo__row--align-end {
  flex-direction: row;
  align-items: flex-end;
  flex-wrap: wrap;
}

.color-picker-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
