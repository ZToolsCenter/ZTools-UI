<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
</script>

<template>
  <div class="docs-app">
    <SiteHeader />
    <div class="docs-body">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.docs-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.docs-body {
  flex: 1;
  overflow: hidden;
}
</style>
