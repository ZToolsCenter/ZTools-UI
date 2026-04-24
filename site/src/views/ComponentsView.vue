<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import DocsShell from '../layouts/DocsShell.vue'
import type { SidebarItem } from '../layouts/DocsShell.vue'
import DemoBlock from '../components/DemoBlock.vue'
import ApiTable from '../components/ApiTable.vue'
import { getComponentDoc, getSidebarData } from '../content/components/meta'
import type { ComponentDemo } from '../content/components/meta'

const route = useRoute()
const componentId = computed(() => route.params.componentId as string)

// 获取当前组件文档
const componentDoc = computed(() => getComponentDoc(componentId.value))

// 侧边栏数据
const sidebarItems: SidebarItem[] = getSidebarData()

// 右侧目录数据（固定章节）
const tocItems = computed(() => {
  const doc = componentDoc.value
  if (!doc) return []

  const items = [
    { id: 'description', label: '说明', level: 2 },
    { id: 'demos', label: '演示', level: 2 }
  ]

  const { api } = doc
  if (api.props?.length) {
    items.push({ id: 'api-props', label: 'Props', level: 3 })
  }
  if (api.slots?.length) {
    items.push({ id: 'api-slots', label: 'Slots', level: 3 })
  }
  if (api.emits?.length) {
    items.push({ id: 'api-emits', label: 'Events', level: 3 })
  }

  if (items.length > 2) {
    items.splice(2, 0, { id: 'api', label: 'API', level: 2 })
  }

  return items
})

const tocActiveId = ref('')
const shellRef = ref<InstanceType<typeof DocsShell> | null>(null)
const scrollContainer = computed(() => shellRef.value?.mainRef ?? null)
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
let observer: IntersectionObserver | null = null

// 监听路由变化重置目录高亮
watch(componentId, () => {
  tocActiveId.value = ''
  nextTick(setupScrollObserver)
})

function setupScrollObserver() {
  observer?.disconnect()

  if (!scrollContainer.value || !tocItems.value.length) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          tocActiveId.value = entry.target.id
        }
      }
    },
    { root: scrollContainer.value, rootMargin: '0px 0px -60% 0px' }
  )

  for (const item of tocItems.value) {
    const target = scrollContainer.value.querySelector(`#${CSS.escape(item.id)}`)
    if (target) {
      observer.observe(target)
    }
  }
}

function scrollToTop() {
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

onBeforeRouteUpdate((to, from) => {
  if (to.name !== 'component-detail' || from.name !== 'component-detail') return
  if (to.params.componentId === from.params.componentId) return

  scrollToTop()
})

function handleTocClick(id: string) {
  tocActiveId.value = id
  const main = scrollContainer.value
  const el = main?.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null
  if (el && main) {
    main.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' })
  }
}

onMounted(() => {
  setupScrollObserver()
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <DocsShell
    ref="shellRef"
    :sidebar-items="sidebarItems"
    :toc-items="tocItems"
    :toc-active-id="tocActiveId"
    @toc-click="handleTocClick"
  >
    <!-- 组件不存在 -->
    <div v-if="!componentDoc" class="component-not-found">
      <h2>组件不存在</h2>
      <p>未找到 ID 为 <code>{{ componentId }}</code> 的组件文档</p>
    </div>

    <!-- 组件文档页 -->
    <article v-else class="component-doc">
      <!-- 标题 -->
      <header id="title" class="component-header">
        <h1 class="component-title">{{ componentDoc.zhName }}</h1>
        <p class="component-subtitle">{{ componentDoc.enName }}</p>
      </header>

      <!-- 说明 -->
      <section id="description" class="component-description">
        <p>{{ componentDoc.description }}</p>
      </section>

      <!-- 演示区 -->
      <section id="demos" class="component-demos">
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

      <!-- API -->
      <section id="api" class="component-api">
        <ApiTable
          :props="componentDoc.api.props"
          :slots="componentDoc.api.slots"
          :emits="componentDoc.api.emits"
        />
      </section>
    </article>
  </DocsShell>
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
  font-size: 28px;
  font-weight: 700;
  color: var(--site-text);
  margin: 0 0 4px;
}

.component-subtitle {
  font-size: 16px;
  color: var(--site-text-muted);
  margin: 0;
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

