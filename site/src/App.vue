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

<style>
html,
body,
#app {
  background: var(--site-bg);
  color: var(--site-text);
}

:root {
  --site-bg: #f8fafc;
  --site-panel-bg: #ffffff;
  --site-panel-muted-bg: #f1f5f9;
  --site-panel-hover-bg: #f8fafc;
  --site-code-bg: #f1f5f9;
  --site-border: #e2e8f0;
  --site-divider: #e5e7eb;
  --site-text: #0f172a;
  --site-text-muted: #475569;
}

html.dark {
  --site-bg: #111827;
  --site-panel-bg: #1f2937;
  --site-panel-muted-bg: #243244;
  --site-panel-hover-bg: #273449;
  --site-code-bg: #182235;
  --site-border: #374151;
  --site-divider: rgba(255, 255, 255, 0.1);
  --site-text: #f3f4f6;
  --site-text-muted: #cbd5e1;
}
</style>

<style scoped>
.docs-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--site-bg);
  color: var(--site-text);
}

.docs-body {
  flex: 1;
  overflow: hidden;
}
</style>
