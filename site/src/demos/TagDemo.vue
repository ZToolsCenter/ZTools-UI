<script setup lang="ts">
import { ref } from 'vue'
import { Tag } from 'ztools-ui-components/common/Tag'

type TagDemoVariant = 'type' | 'size' | 'round' | 'closable' | 'disabled'

const props = withDefaults(
  defineProps<{
    variant?: TagDemoVariant
  }>(),
  {
    variant: 'type'
  }
)

const visible = ref(true)
</script>

<template>
  <div class="tag-demo">
    <template v-if="props.variant === 'type'">
      <div class="tag-demo__row">
        <Tag>默认标签</Tag>
        <Tag type="primary">主要标签</Tag>
        <Tag type="success">成功标签</Tag>
        <Tag type="warning">警告标签</Tag>
        <Tag type="danger">危险标签</Tag>
        <Tag type="info">信息标签</Tag>
      </div>
    </template>

    <template v-else-if="props.variant === 'size'">
      <div class="tag-demo__row tag-demo__row--align-end">
        <Tag size="small">小标签</Tag>
        <Tag size="medium" type="primary">中标签</Tag>
        <Tag size="large" type="success">大标签</Tag>
      </div>
    </template>

    <template v-else-if="props.variant === 'round'">
      <div class="tag-demo__row">
        <Tag round>圆角标签</Tag>
        <Tag round type="primary">主要标签</Tag>
        <Tag round type="success">成功标签</Tag>
      </div>
    </template>

    <template v-else-if="props.variant === 'closable'">
      <div class="tag-demo__column">
        <div class="tag-demo__row">
          <Tag v-if="visible" closable type="primary" @close="visible = false">可关闭标签</Tag>
          <Tag closable type="warning">警告标签</Tag>
        </div>
        <button v-if="!visible" class="tag-demo__reset" type="button" @click="visible = true">重新显示</button>
      </div>
    </template>

    <template v-else-if="props.variant === 'disabled'">
      <div class="tag-demo__row">
        <Tag disabled>默认禁用</Tag>
        <Tag type="primary" disabled>主要禁用</Tag>
        <Tag closable type="danger" disabled>关闭禁用</Tag>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tag-demo,
.tag-demo__column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tag-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-demo__row--align-end {
  align-items: flex-end;
}

.tag-demo__reset {
  align-self: flex-start;
  border: none;
  background: transparent;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 13px;
}
</style>
