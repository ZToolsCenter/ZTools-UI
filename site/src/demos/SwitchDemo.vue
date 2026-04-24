<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from 'ztools-ui-components/common/Switch'

type SwitchDemoVariant = 'basic' | 'text' | 'size' | 'disabled'

const props = withDefaults(
  defineProps<{
    variant?: SwitchDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const enabled = ref(true)
const textEnabled = ref(true)
</script>

<template>
  <div class="switch-demo">
    <template v-if="props.variant === 'basic'">
      <div class="switch-demo__row">
        <Switch v-model="enabled" />
        <span class="switch-demo__value">当前值: {{ enabled }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'text'">
      <div class="switch-demo__row">
        <Switch v-model="textEnabled" active-text="开启" inactive-text="关闭" />
        <span class="switch-demo__value">当前值: {{ textEnabled }}</span>
      </div>
    </template>

    <template v-else-if="props.variant === 'size'">
      <div class="switch-demo__row">
        <Switch :model-value="false" size="small" />
        <Switch :model-value="true" size="medium" />
        <Switch :model-value="true" size="large" />
      </div>
    </template>

    <template v-else-if="props.variant === 'disabled'">
      <div class="switch-demo__row">
        <Switch :model-value="true" disabled />
        <Switch :model-value="false" disabled />
        <Switch :model-value="true" active-text="开启" inactive-text="关闭" disabled />
      </div>
    </template>
  </div>
</template>

<style scoped>
.switch-demo,
.switch-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.switch-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
