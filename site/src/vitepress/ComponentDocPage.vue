<script setup lang="ts">
import { computed } from 'vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import { getComponentDoc } from '../content/components/meta'
import type { ComponentDemo } from '../content/components/meta'

const props = defineProps<{
  componentId: string
}>()

const componentDoc = computed(() => getComponentDoc(props.componentId))
const demoColumns = computed<[ComponentDemo[], ComponentDemo[]]>(() => {
  const demos = componentDoc.value?.demos ?? []
  return demos.reduce<[ComponentDemo[], ComponentDemo[]]>(
    (columns, demo, index) => {
      columns[index % 2].push(demo)
      return columns
    },
    [[], []]
  )
})
</script>

<template>
  <div v-if="!componentDoc" class="component-not-found">
    <h2>组件不存在</h2>
    <p>未找到 ID 为 <code>{{ componentId }}</code> 的组件文档</p>
  </div>

  <article v-else class="component-doc">
    <header class="component-header">
      <h1 class="component-title">
        <span>{{ componentDoc.zhName }}</span>
        <span class="component-subtitle">{{ componentDoc.enName }}</span>
      </h1>
    </header>

    <section class="component-description">
      <p>{{ componentDoc.description }}</p>
    </section>

    <section class="component-demos">
      <h2 class="section-title">演示</h2>
      <div
        :class="[
          'component-demo-grid',
          { 'component-demo-grid--single': componentDoc.demos.length === 1 }
        ]"
      >
        <div
          v-for="(column, columnIndex) in demoColumns"
          :key="columnIndex"
          class="component-demo-column"
        >
          <DemoBlock
            v-for="(demo, index) in column"
            :key="`${columnIndex}-${index}`"
            :title="demo.title"
            :description="demo.description"
            :component="demo.component"
            :component-props="demo.componentProps"
            :source-code="demo.sourceCode"
          />
        </div>
      </div>
    </section>

    <section class="component-api">
      <ApiTable
        :props="componentDoc.api.props"
        :slots="componentDoc.api.slots"
        :emits="componentDoc.api.emits"
      />
    </section>
  </article>
</template>

<style scoped>
.component-not-found {
  padding: 40px;
  text-align: center;
}

.component-not-found h2 {
  font-size: 20px;
  color: var(--site-text);
  margin-bottom: 12px;
}

.component-not-found p {
  color: var(--site-text-muted);
}

.component-not-found code {
  background: var(--site-panel-muted-bg);
  border: 1px solid var(--site-border);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
}

.component-doc {
  width: 100%;
}

.component-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--site-divider);
}

.component-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: var(--site-text);
  margin: 0;
}

.component-subtitle {
  font-size: 16px;
  color: var(--site-text-muted);
  font-weight: 400;
}

.component-description {
  margin-bottom: 32px;
}

.component-description p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--site-text-muted);
  margin: 0;
}

.component-demos {
  margin-bottom: 32px;
}

.component-demo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 24px;
}

.component-demo-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.component-demo-grid--single {
  grid-template-columns: minmax(0, 1fr);
}

.component-demo-grid--single .component-demo-column:empty {
  display: none;
}

@media (max-width: 960px) {
  .component-demo-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .component-demo-column:empty {
    display: none;
  }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--site-text);
  margin: 0 0 16px;
}

.component-api {
  margin-top: 32px;
}

</style>
