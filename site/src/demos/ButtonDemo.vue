<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'ztools-ui-components/common/Button'

type ButtonDemoVariant =
  | 'basic'
  | 'dashed'
  | 'size'
  | 'text'
  | 'label'
  | 'disabled'
  | 'icon'
  | 'event'
  | 'shape'
  | 'transparent'
  | 'loading'
  | 'group'

const props = withDefaults(
  defineProps<{
    variant?: ButtonDemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const loading = ref(false)
const clickCount = ref(0)
const lastAction = ref('未触发')

function handleLoading() {
  if (loading.value) return

  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 1200)
}

function handleAction(action: string) {
  clickCount.value += 1
  lastAction.value = action
}
</script>

<template>
  <div class="button-demo">
    <template v-if="props.variant === 'basic'">
      <div class="button-demo__row">
        <Button>默认按钮</Button>
        <Button type="primary">主要按钮</Button>
        <Button type="success">成功按钮</Button>
        <Button type="warning">警告按钮</Button>
        <Button type="danger">危险按钮</Button>
      </div>
      <Button block type="primary">块级按钮</Button>
    </template>

    <template v-else-if="props.variant === 'dashed'">
      <div class="button-demo__row">
        <Button class="button-demo__dashed">默认虚线</Button>
        <Button class="button-demo__dashed button-demo__dashed--primary">主要虚线</Button>
        <Button class="button-demo__dashed button-demo__dashed--danger">危险虚线</Button>
      </div>
    </template>

    <template v-else-if="props.variant === 'size'">
      <div class="button-demo__row button-demo__row--align-end">
        <Button size="small">Small</Button>
        <Button size="medium" type="primary">Medium</Button>
        <Button size="large" type="success">Large</Button>
      </div>
    </template>

    <template v-else-if="props.variant === 'text'">
      <div class="button-demo__row">
        <Button type="text">文字按钮</Button>
        <Button type="text">查看详情</Button>
        <Button type="text">移除</Button>
      </div>
    </template>

    <template v-else-if="props.variant === 'label'">
      <div class="button-demo__row">
        <Button type="primary">
          <span class="button-demo__compound">
            <span>发布</span>
            <span class="button-demo__pill button-demo__pill--light">Beta</span>
          </span>
        </Button>
        <Button>
          <span class="button-demo__compound">
            <span>消息</span>
            <span class="button-demo__pill">12</span>
          </span>
        </Button>
        <Button type="success">
          <span class="button-demo__compound">
            <span>同步</span>
            <span class="button-demo__pill button-demo__pill--success">已启用</span>
          </span>
        </Button>
      </div>
    </template>

    <template v-else-if="props.variant === 'disabled'">
      <div class="button-demo__row">
        <Button disabled>默认禁用</Button>
        <Button type="primary" disabled>主要禁用</Button>
        <Button type="text" disabled>文字禁用</Button>
      </div>
    </template>

    <template v-else-if="props.variant === 'icon'">
      <div class="button-demo__row">
        <Button type="primary">
          <template #icon>
            <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v8m0 0 3-3m-3 3L5 7m-2 5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
          下载
        </Button>
        <Button>
          <template #icon>
            <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M7 3h6M7 8h6M7 13h6M3 3h.01M3 8h.01M3 13h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </template>
          列表
        </Button>
        <Button type="success">
          <template #icon>
            <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m3.5 8 3 3 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
          已完成
        </Button>
      </div>
    </template>

    <template v-else-if="props.variant === 'event'">
      <div class="button-demo__column">
        <div class="button-demo__row">
          <Button @click="handleAction('保存')">保存</Button>
          <Button type="primary" @click="handleAction('发布')">发布</Button>
          <Button type="danger" @click="handleAction('删除')">删除</Button>
        </div>
        <div class="button-demo__status">
          <span>触发次数：{{ clickCount }}</span>
          <span>最后事件：{{ lastAction }}</span>
        </div>
      </div>
    </template>

    <template v-else-if="props.variant === 'shape'">
      <div class="button-demo__row">
        <Button class="button-demo__round" type="primary">圆角按钮</Button>
        <Button class="button-demo__round" type="success">胶囊按钮</Button>
        <Button class="button-demo__circle" type="primary" aria-label="添加">
          <template #icon>
            <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </template>
        </Button>
      </div>
    </template>

    <template v-else-if="props.variant === 'transparent'">
      <div class="button-demo__surface">
        <div class="button-demo__row">
          <Button class="button-demo__transparent">默认透明</Button>
          <Button class="button-demo__transparent button-demo__transparent--primary">主要透明</Button>
          <Button class="button-demo__transparent button-demo__transparent--danger">危险透明</Button>
        </div>
      </div>
    </template>

    <template v-else-if="props.variant === 'loading'">
      <div class="button-demo__row">
        <Button :loading="loading" type="primary" @click="handleLoading">提交</Button>
        <Button loading>同步中</Button>
      </div>
    </template>

    <template v-else-if="props.variant === 'group'">
      <div class="button-demo__group">
        <Button class="button-demo__group-item">上一步</Button>
        <Button class="button-demo__group-item button-demo__group-item--active">处理中</Button>
        <Button class="button-demo__group-item">下一步</Button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.button-demo,
.button-demo__column {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.button-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button-demo__row--align-end {
  align-items: flex-end;
}

.button-demo__status {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 12px 14px;
  border-radius: 8px;
  background: var(--hover-bg);
  color: var(--text-secondary);
  font-size: 13px;
}

.button-demo__compound {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.button-demo__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text-color), transparent 88%);
  color: inherit;
  font-size: 12px;
  line-height: 1;
}

.button-demo__pill--light {
  background: rgba(255, 255, 255, 0.2);
}

.button-demo__pill--success {
  background: rgba(255, 255, 255, 0.18);
}

.button-demo__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.button-demo__dashed {
  background: transparent;
  border-style: dashed;
}

.button-demo__dashed:hover:not(:disabled) {
  background: var(--hover-bg);
}

.button-demo__dashed--primary {
  color: var(--primary-color);
  border-color: color-mix(in srgb, var(--primary-color), black 10%);
}

.button-demo__dashed--danger {
  color: var(--danger-color);
  border-color: color-mix(in srgb, var(--danger-color), black 10%);
}

.button-demo__round {
  border-radius: 999px;
  padding-inline: 18px;
}

.button-demo__circle {
  width: 34px;
  min-width: 34px;
  padding: 0;
  border-radius: 999px;
}

.button-demo__surface {
  padding: 16px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--primary-light-bg), var(--card-bg) 45%),
    color-mix(in srgb, var(--hover-bg), var(--card-bg) 30%)
  );
}

.button-demo__transparent {
  background: transparent;
  color: var(--text-color);
}

.button-demo__transparent:hover:not(:disabled) {
  background: color-mix(in srgb, var(--card-bg), transparent 20%);
}

.button-demo__transparent--primary {
  color: var(--primary-color);
  border-color: color-mix(in srgb, var(--primary-color), black 10%);
}

.button-demo__transparent--danger {
  color: var(--danger-color);
  border-color: color-mix(in srgb, var(--danger-color), black 10%);
}

.button-demo__group {
  display: inline-flex;
  flex-wrap: wrap;
}

.button-demo__group-item {
  position: relative;
  border-radius: 0;
}

.button-demo__group-item + .button-demo__group-item {
  margin-left: -2px;
}

.button-demo__group-item:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.button-demo__group-item:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.button-demo__group-item:hover:not(:disabled),
.button-demo__group-item:focus-visible {
  z-index: 1;
}

.button-demo__group-item--active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--text-on-primary);
}

.button-demo__group-item--active:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  color: var(--text-on-primary);
}
</style>
