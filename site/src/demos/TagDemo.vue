<script setup lang="ts">
import { ref } from 'vue'
import { ZTag } from 'ztools-ui-components/common/Tag'

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
        <ZTag>默认标签</ZTag>
        <ZTag type="primary">主要标签</ZTag>
        <ZTag type="success">成功标签</ZTag>
        <ZTag type="warning">警告标签</ZTag>
        <ZTag type="danger">危险标签</ZTag>
        <ZTag type="info">信息标签</ZTag>
      </div>
    </template>

    <template v-else-if="props.variant === 'size'">
      <div class="tag-demo__row tag-demo__row--align-end">
        <ZTag size="small">小标签</ZTag>
        <ZTag size="medium" type="primary">中标签</ZTag>
        <ZTag size="large" type="success">大标签</ZTag>
      </div>
    </template>

    <template v-else-if="props.variant === 'round'">
      <div class="tag-demo__row">
        <ZTag round>圆角标签</ZTag>
        <ZTag round type="primary">主要标签</ZTag>
        <ZTag round type="success">成功标签</ZTag>
      </div>
    </template>

    <template v-else-if="props.variant === 'closable'">
      <div class="tag-demo__column">
        <div class="tag-demo__row">
          <ZTag v-if="visible" closable type="primary" @close="visible = false">可关闭标签</ZTag>
          <ZTag closable type="warning">警告标签</ZTag>
        </div>
        <button v-if="!visible" class="tag-demo__reset" type="button" @click="visible = true">重新显示</button>
      </div>
    </template>

    <template v-else-if="props.variant === 'disabled'">
      <div class="tag-demo__row">
        <ZTag disabled>默认禁用</ZTag>
        <ZTag type="primary" disabled>主要禁用</ZTag>
        <ZTag closable type="danger" disabled>关闭禁用</ZTag>
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
