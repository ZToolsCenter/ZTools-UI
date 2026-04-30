<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import { getComponentDoc } from '../content/components/meta'
import type { ComponentDemo } from '../content/components/meta'

const props = defineProps<{
  componentId: string
}>()

const { site } = useData()

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

// 使用 VitePress 的 markdown 渲染器
function renderMarkdown(content: string): string {
  const md = (site.value as any).markdown?.md
  if (md && typeof md.render === 'function') {
    return md.render(content)
  }
  // 降级处理：基本的 markdown 转换
  return content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/```vue\n([\s\S]+?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\n/g, '<br>')
}
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

    <section v-if="componentDoc.sections?.length" class="component-sections">
      <article
        v-for="(section, index) in componentDoc.sections"
        :key="index"
        class="component-section"
      >
        <h3 class="section-title">{{ section.title }}</h3>
        <div class="section-content" v-html="renderMarkdown(section.content)"></div>
      </article>
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

.component-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.component-section {
  padding: 20px;
  border: 1px solid var(--site-border);
  border-radius: 12px;
  background: var(--site-panel-bg);
}

.component-section .section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--site-text);
  margin: 0 0 12px;
}

.component-section .section-content {
  font-size: 14px;
  line-height: 1.7;
  color: var(--site-text-muted);
}

.component-section .section-content :deep(strong) {
  color: var(--site-text);
  font-weight: 600;
}

.component-section .section-content :deep(code) {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--site-panel-muted-bg);
  border: 1px solid var(--site-border);
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  color: var(--site-text);
}

.component-section .section-content :deep(pre) {
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--site-panel-muted-bg);
  border: 1px solid var(--site-border);
  overflow-x: auto;
  margin: 12px 0;
}

.component-section .section-content :deep(pre code) {
  padding: 0;
  border: none;
  background: transparent;
  font-size: 13px;
  line-height: 1.6;
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
