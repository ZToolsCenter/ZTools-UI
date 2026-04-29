<script setup lang="ts">
import { ref } from 'vue'
import { ZColorPicker } from 'ztools-ui-components/common/ColorPicker'

type ColorPickerDemoVariant = 'basic' | 'size' | 'without-input' | 'alpha' | 'placement' | 'disabled'

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
const alphaColor = ref('#8b5cf680')
const placementColor = ref('#f97316')
</script>

<template>
  <div class="color-picker-demo">
    <template v-if="props.variant === 'basic'">
      <div class="color-picker-demo__row">
        <ZColorPicker v-model="color" />
        <span class="color-picker-demo__value">当前颜色: {{ color }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'size'">
      <div class="color-picker-demo__row">
        <ZColorPicker v-model="color" size="small" />
        <ZColorPicker v-model="color" size="medium" />
        <ZColorPicker v-model="color" size="large" />
      </div>
    </template>

    <template v-else-if="props.variant === 'without-input'">
      <div class="color-picker-demo__row">
        <ZColorPicker v-model="compactColor" :show-input="false" />
        <span class="color-picker-demo__value">当前颜色: {{ compactColor }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'alpha'">
      <div class="color-picker-demo__row">
        <ZColorPicker v-model="alphaColor" show-alpha />
        <span class="color-picker-demo__value">当前颜色: {{ alphaColor }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'placement'">
      <div class="color-picker-demo__column">
        <span class="color-picker-demo__value">placement 与 Popover 保持一致，默认会在视口边缘自动纠正位置。</span>
        <div class="color-picker-demo__grid">
          <div class="color-picker-demo__placement-item">
            <span>top-start</span>
            <ZColorPicker v-model="placementColor" placement="top-start" :show-input="false" />
          </div>
          <div class="color-picker-demo__placement-item">
            <span>top</span>
            <ZColorPicker v-model="placementColor" placement="top" :show-input="false" />
          </div>
          <div class="color-picker-demo__placement-item">
            <span>top-end</span>
            <ZColorPicker v-model="placementColor" placement="top-end" :show-input="false" />
          </div>
          <div class="color-picker-demo__placement-item">
            <span>bottom-start</span>
            <ZColorPicker v-model="placementColor" placement="bottom-start" :show-input="false" />
          </div>
          <div class="color-picker-demo__placement-item">
            <span>bottom</span>
            <ZColorPicker v-model="placementColor" placement="bottom" :show-input="false" />
          </div>
          <div class="color-picker-demo__placement-item">
            <span>bottom-end</span>
            <ZColorPicker v-model="placementColor" placement="bottom-end" :show-input="false" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="props.variant === 'disabled'">
      <div class="color-picker-demo__row">
        <ZColorPicker model-value="#94a3b8" disabled />
        <ZColorPicker model-value="#64748b" :show-input="false" disabled />
      </div>
    </template>
  </div>
</template>

<style scoped>
.color-picker-demo,
.color-picker-demo__column,
.color-picker-demo__row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.color-picker-demo__row {
  flex-direction: row;
  flex-wrap: wrap;
}

.color-picker-demo__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 12px;
}

.color-picker-demo__placement-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--control-border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
}

.color-picker-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
