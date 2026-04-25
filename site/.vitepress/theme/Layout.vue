<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useData } from 'vitepress'
import { watch } from 'vue'

const { Layout } = DefaultTheme
const { isDark } = useData()

if (inBrowser) {
  watch(
    isDark,
    (value) => {
      window.__setDocsTheme?.(value)
    },
    { immediate: true }
  )
}
</script>

<template>
  <Layout />
</template>
