<script setup lang="ts">
import { ref } from 'vue'
import { ZSlider } from 'ztools-ui-components/common/Slider'

type SliderDemoVariant = 'basic' | 'disabled-range'

const props = withDefaults(
  defineProps<{
    variant?: SliderDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const basicValue = ref(50)
const disabledRangeValue = ref(30)

function isRangeDisabled(value: number): boolean {
  return value >= 40 && value <= 60
}
</script>

<template>
  <div class="slider-demo">
    <template v-if="props.variant === 'basic'">
      <div class="slider-demo__column">
        <p class="slider-demo__description">滑块控件，支持 v-model 双向绑定、自定义范围和格式化。</p>
        <div class="slider-demo__box">
          <div class="slider-demo__control">
            <ZSlider v-model="basicValue" :min="0" :max="100" :step="1" />
          </div>
          <span class="slider-demo__value">当前值: {{ basicValue }}</span>
        </div>
      </div>
    </template>

    <template v-else-if="props.variant === 'disabled-range'">
      <div class="slider-demo__column">
        <p class="slider-demo__description">40 - 60 区间不可停留，拖动进入禁区时会保持进入前的值；默认底色为浅灰色，可通过 disabled-track-color 自定义。</p>
        <div class="slider-demo__box">
          <div class="slider-demo__control">
            <ZSlider
              v-model="disabledRangeValue"
              :min="0"
              :max="100"
              :step="1"
              :disabled-value="isRangeDisabled"
            />
          </div>
          <span class="slider-demo__value">默认浅灰: {{ disabledRangeValue }}</span>
        </div>
        <div class="slider-demo__box">
          <div class="slider-demo__control">
            <ZSlider
              v-model="disabledRangeValue"
              :min="0"
              :max="100"
              :step="1"
              :disabled-value="isRangeDisabled"
              disabled-track-color="rgba(255, 160, 122, 0.45)"
            />
          </div>
          <span class="slider-demo__value">自定义颜色: {{ disabledRangeValue }}</span>
        </div>
        <span class="slider-demo__hint">禁用区间: 40 - 60</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.slider-demo,
.slider-demo__column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider-demo__description {
  color: var(--text-secondary);
  font-size: 14px;
}

.slider-demo__box {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.slider-demo__control {
  width: 300px;
}

.slider-demo__value,
.slider-demo__hint {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
