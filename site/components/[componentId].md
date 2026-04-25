---
outline: false
aside: false
---

<script setup lang="ts">
import { useData } from 'vitepress'
import ComponentDocPage from '../src/vitepress/ComponentDocPage.vue'

const { params } = useData()
</script>

<ClientOnly>
  <ComponentDocPage :component-id="params.componentId" />
</ClientOnly>
