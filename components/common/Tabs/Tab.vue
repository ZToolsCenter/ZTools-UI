<script setup lang="ts">
import type { TabProps } from './Tabs'

defineOptions({ name: 'ZTab' })

withDefaults(defineProps<TabProps>(), {
  disabled: false,
  closable: undefined
})

defineSlots<{
  default?: () => unknown
}>()
</script>

<template>
  <slot />
</template>
