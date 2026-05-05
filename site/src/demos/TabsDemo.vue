<script setup lang="ts">
import { ref } from 'vue'
import { ZTabPane, ZTabs } from 'ztools-ui-components/common/Tabs'

type DemoVariant =
  | 'basic'
  | 'type'
  | 'segment'
  | 'size'
  | 'placement'
  | 'card-closable-addable'
  | 'addable'
  | 'closable'
  | 'before-leave'
  | 'animated'
  | 'justify-content'
  | 'prefix-suffix'
  | 'disabled'
  | 'display-directive'

withDefaults(
  defineProps<{
    variant?: DemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const value1 = ref<string>('detail')
const value2 = ref<string>('a')
const value3 = ref<string>('a')
const value4 = ref<string>('a')
const value5 = ref<string>('day')
const value6 = ref<string>('a')

const cardValue = ref<string | number>(1)
const cardTabs = ref([
  { name: 1, tab: '标签 1', content: '这是标签 1 的内容' },
  { name: 2, tab: '标签 2', content: '这是标签 2 的内容' },
  { name: 3, tab: '标签 3', content: '这是标签 3 的内容' }
])
let nextTabId = 4

function handleAdd(): void {
  const id = nextTabId++
  cardTabs.value.push({ name: id, tab: `新标签 ${id}`, content: `动态添加的内容 ${id}` })
  cardValue.value = id
}

function handleClose(name: string | number): void {
  const index = cardTabs.value.findIndex((t) => t.name === name)
  if (index === -1) return
  cardTabs.value.splice(index, 1)
  if (cardValue.value === name) {
    cardValue.value = cardTabs.value[Math.min(index, cardTabs.value.length - 1)]?.name ?? 0
  }
}

const beforeLeaveValue = ref<string>('a')
function handleBeforeLeave(name: string | number, oldName: string | number | null): boolean {
  if (oldName === 'b' && name !== 'b') {
    return window.confirm(`确定要离开「标签 B」吗？`)
  }
  return true
}

const inputValue = ref('')
</script>

<template>
  <div class="tabs-demo">
    <template v-if="variant === 'basic'">
      <ZTabs v-model:value="value1">
        <ZTabPane name="detail" tab="详情">
          <p>详情页内容：通过 v-model:value 绑定当前激活标签。</p>
        </ZTabPane>
        <ZTabPane name="commands" tab="指令">
          <p>指令页内容：标签数据通过子组件嵌套声明。</p>
        </ZTabPane>
        <ZTabPane name="data" tab="数据">
          <p>数据页内容：每个标签可以承载任意 Vue 模板。</p>
        </ZTabPane>
      </ZTabs>
      <span class="tabs-demo__value">当前: {{ value1 }}</span>
    </template>

    <template v-else-if="variant === 'type'">
      <div class="tabs-demo__column">
        <span class="tabs-demo__label">bar（默认）</span>
        <ZTabs v-model:value="value2" type="bar">
          <ZTabPane name="a" tab="标签 A"><p>bar 类型：顶部一条跟随文字宽度的指示条。</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>切换标签时指示条会平滑滑动。</p></ZTabPane>
          <ZTabPane name="c" tab="标签 C"><p>这是标签 C 的内容。</p></ZTabPane>
        </ZTabs>
      </div>
      <div class="tabs-demo__column">
        <span class="tabs-demo__label">line</span>
        <ZTabs v-model:value="value3" type="line">
          <ZTabPane name="a" tab="标签 A"><p>line 类型：底部一条分隔线 + 当前 tab 下方主色指示条。</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>这是标签 B 的内容。</p></ZTabPane>
          <ZTabPane name="c" tab="标签 C"><p>这是标签 C 的内容。</p></ZTabPane>
        </ZTabs>
      </div>
      <div class="tabs-demo__column">
        <span class="tabs-demo__label">card</span>
        <ZTabs v-model:value="value4" type="card">
          <ZTabPane name="a" tab="标签 A"><p>card 类型：每个 tab 渲染为卡片。</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>这是标签 B 的内容。</p></ZTabPane>
          <ZTabPane name="c" tab="标签 C"><p>这是标签 C 的内容。</p></ZTabPane>
        </ZTabs>
      </div>
    </template>

    <template v-else-if="variant === 'segment'">
      <ZTabs v-model:value="value5" type="segment">
        <ZTabPane name="day" tab="日">
          <p>segment 类型：iOS 分段控制器风格，整个 nav 共用一个胶囊容器。</p>
        </ZTabPane>
        <ZTabPane name="week" tab="周"><p>周维度内容。</p></ZTabPane>
        <ZTabPane name="month" tab="月"><p>月维度内容。</p></ZTabPane>
        <ZTabPane name="year" tab="年"><p>年维度内容。</p></ZTabPane>
      </ZTabs>
    </template>

    <template v-else-if="variant === 'size'">
      <div class="tabs-demo__column tabs-demo__column--gap">
        <span class="tabs-demo__label">small</span>
        <ZTabs default-value="a" size="small">
          <ZTabPane name="a" tab="标签 A"><p>small 尺寸内容</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>small 尺寸内容</p></ZTabPane>
        </ZTabs>

        <span class="tabs-demo__label">medium（默认）</span>
        <ZTabs default-value="a" size="medium">
          <ZTabPane name="a" tab="标签 A"><p>medium 尺寸内容</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>medium 尺寸内容</p></ZTabPane>
        </ZTabs>

        <span class="tabs-demo__label">large</span>
        <ZTabs default-value="a" size="large">
          <ZTabPane name="a" tab="标签 A"><p>large 尺寸内容</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>large 尺寸内容</p></ZTabPane>
        </ZTabs>
      </div>
    </template>

    <template v-else-if="variant === 'placement'">
      <div class="tabs-demo__column tabs-demo__column--gap">
        <span class="tabs-demo__label">top（默认）</span>
        <ZTabs default-value="a" type="line" placement="top">
          <ZTabPane name="a" tab="标签 A"><p>顶部对齐</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>顶部对齐</p></ZTabPane>
        </ZTabs>

        <span class="tabs-demo__label">bottom</span>
        <ZTabs default-value="a" type="line" placement="bottom">
          <ZTabPane name="a" tab="标签 A"><p>底部对齐</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>底部对齐</p></ZTabPane>
        </ZTabs>

        <span class="tabs-demo__label">left</span>
        <ZTabs default-value="a" type="line" placement="left">
          <ZTabPane name="a" tab="标签 A"><p>左侧标签栏</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>左侧标签栏</p></ZTabPane>
          <ZTabPane name="c" tab="标签 C"><p>左侧标签栏</p></ZTabPane>
        </ZTabs>

        <span class="tabs-demo__label">right</span>
        <ZTabs default-value="a" type="line" placement="right">
          <ZTabPane name="a" tab="标签 A"><p>右侧标签栏</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>右侧标签栏</p></ZTabPane>
          <ZTabPane name="c" tab="标签 C"><p>右侧标签栏</p></ZTabPane>
        </ZTabs>
      </div>
    </template>

    <template v-else-if="variant === 'card-closable-addable'">
      <ZTabs
        v-model:value="cardValue"
        type="card"
        addable
        closable
        @add="handleAdd"
        @close="handleClose"
      >
        <ZTabPane
          v-for="tab in cardTabs"
          :key="tab.name"
          :name="tab.name"
          :tab="tab.tab"
        >
          <p>{{ tab.content }}</p>
        </ZTabPane>
      </ZTabs>
      <span class="tabs-demo__value">点击 + 新增标签，点击 × 关闭标签。当前: {{ cardValue }}</span>
    </template>

    <template v-else-if="variant === 'addable'">
      <ZTabs
        v-model:value="cardValue"
        type="card"
        :addable="{ disabled: cardTabs.length >= 5 }"
        @add="handleAdd"
      >
        <ZTabPane
          v-for="tab in cardTabs"
          :key="tab.name"
          :name="tab.name"
          :tab="tab.tab"
        >
          <p>{{ tab.content }}</p>
        </ZTabPane>
      </ZTabs>
      <span class="tabs-demo__value">最多 5 个标签，超过后 + 按钮被禁用。</span>
    </template>

    <template v-else-if="variant === 'closable'">
      <ZTabs
        v-model:value="cardValue"
        type="card"
        closable
        @close="handleClose"
      >
        <ZTabPane
          v-for="tab in cardTabs"
          :key="tab.name"
          :name="tab.name"
          :tab="tab.tab"
        >
          <p>{{ tab.content }}</p>
        </ZTabPane>
      </ZTabs>
    </template>

    <template v-else-if="variant === 'before-leave'">
      <ZTabs v-model:value="beforeLeaveValue" type="line" :on-before-leave="handleBeforeLeave">
        <ZTabPane name="a" tab="标签 A"><p>普通标签 A，可自由切换。</p></ZTabPane>
        <ZTabPane name="b" tab="标签 B（受保护）">
          <p>离开此标签前会弹出确认框，取消会阻止切换。</p>
        </ZTabPane>
        <ZTabPane name="c" tab="标签 C"><p>普通标签 C。</p></ZTabPane>
      </ZTabs>
    </template>

    <template v-else-if="variant === 'animated'">
      <ZTabs default-value="a" type="line" animated>
        <ZTabPane name="a" tab="标签 A"><p>切换时有横向滑入动画。</p></ZTabPane>
        <ZTabPane name="b" tab="标签 B"><p>这是标签 B 的内容。</p></ZTabPane>
        <ZTabPane name="c" tab="标签 C"><p>这是标签 C 的内容。</p></ZTabPane>
      </ZTabs>
    </template>

    <template v-else-if="variant === 'justify-content'">
      <div class="tabs-demo__column tabs-demo__column--gap">
        <span class="tabs-demo__label">space-between</span>
        <ZTabs default-value="a" type="line" justify-content="space-between">
          <ZTabPane name="a" tab="标签 A"><p>内容</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>内容</p></ZTabPane>
          <ZTabPane name="c" tab="标签 C"><p>内容</p></ZTabPane>
        </ZTabs>

        <span class="tabs-demo__label">center</span>
        <ZTabs default-value="a" type="line" justify-content="center">
          <ZTabPane name="a" tab="标签 A"><p>内容</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>内容</p></ZTabPane>
          <ZTabPane name="c" tab="标签 C"><p>内容</p></ZTabPane>
        </ZTabs>

        <span class="tabs-demo__label">end</span>
        <ZTabs default-value="a" type="line" justify-content="end">
          <ZTabPane name="a" tab="标签 A"><p>内容</p></ZTabPane>
          <ZTabPane name="b" tab="标签 B"><p>内容</p></ZTabPane>
          <ZTabPane name="c" tab="标签 C"><p>内容</p></ZTabPane>
        </ZTabs>
      </div>
    </template>

    <template v-else-if="variant === 'prefix-suffix'">
      <ZTabs v-model:value="value6" type="line">
        <template #prefix>
          <span class="tabs-demo__chip">📚</span>
        </template>
        <template #suffix>
          <button class="tabs-demo__action" type="button">操作</button>
        </template>
        <ZTabPane name="a" tab="标签 A"><p>nav 区可通过 prefix / suffix 插槽追加自定义内容。</p></ZTabPane>
        <ZTabPane name="b" tab="标签 B"><p>这是标签 B 的内容。</p></ZTabPane>
        <ZTabPane name="c" tab="标签 C"><p>这是标签 C 的内容。</p></ZTabPane>
      </ZTabs>
    </template>

    <template v-else-if="variant === 'disabled'">
      <ZTabs default-value="a" type="line">
        <ZTabPane name="a" tab="可用"><p>这是可用标签的内容。</p></ZTabPane>
        <ZTabPane name="b" tab="禁用" disabled><p>这个 tab 被禁用，无法点击切换。</p></ZTabPane>
        <ZTabPane name="c" tab="可用"><p>这是另一个可用标签。</p></ZTabPane>
      </ZTabs>
    </template>

    <template v-else-if="variant === 'display-directive'">
      <ZTabs default-value="a" type="line">
        <ZTabPane name="a" tab="if（默认）">
          <p>每次切换会重新渲染。</p>
        </ZTabPane>
        <ZTabPane name="b" tab="show" display-directive="show">
          <p>使用 v-show，输入框状态切换后会保留：</p>
          <input v-model="inputValue" class="tabs-demo__input" placeholder="输入内容后切换 tab" />
        </ZTabPane>
        <ZTabPane name="c" tab="show:lazy" display-directive="show:lazy">
          <p>首次显示后才会渲染，之后通过 display: none 切换。</p>
        </ZTabPane>
      </ZTabs>
    </template>
  </div>
</template>

<style scoped>
.tabs-demo {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  width: 100%;
  max-width: 100%;
}

.tabs-demo__column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  width: 100%;
}

.tabs-demo__column--gap {
  gap: 20px;
}

.tabs-demo__label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.tabs-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}

.tabs-demo__chip {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
}

.tabs-demo__action {
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid var(--control-border);
  border-radius: 4px;
  background: var(--control-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
}

.tabs-demo__action:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tabs-demo__input {
  margin-top: 8px;
  padding: 6px 10px;
  border: 1px solid var(--control-border);
  border-radius: 4px;
  background: var(--control-bg);
  color: var(--text-color);
  outline: none;
  font: inherit;
}
</style>
