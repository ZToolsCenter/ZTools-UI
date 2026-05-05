<script setup lang="ts">
import type { TabPaneProps } from './Tabs'

defineOptions({ name: 'ZTabPane' })

withDefaults(defineProps<TabPaneProps>(), {
  tab: undefined,
  disabled: false,
  closable: undefined,
  displayDirective: 'if',
  tabProps: undefined
})

defineSlots<{
  default?: () => unknown
  tab?: () => unknown
}>()
</script>

<template>
  <slot />
</template>
