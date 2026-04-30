<script setup lang="ts">
import { ref } from 'vue'
import { ZPagination } from 'ztools-ui-components/common/Pagination'
import type { PaginationInfo } from 'ztools-ui-components/common/Pagination'

type DemoVariant =
  | 'basic'
  | 'simple'
  | 'size-picker'
  | 'quick-jumper'
  | 'disabled'
  | 'size'
  | 'custom'
  | 'display-order'

const props = withDefaults(
  defineProps<{
    variant?: DemoVariant
  }>(),
  {
    variant: 'basic'
  }
)

const page1 = ref(1)
const page2 = ref(3)
const page3 = ref(5)
const page4 = ref(2)
const page5 = ref(4)
const page6 = ref(1)
const page7 = ref(6)
const pageSize1 = ref(10)
const pageSize2 = ref(20)

const renderPrefix = (info: PaginationInfo) => `共 ${info.itemCount} 条`
const renderSuffix = (info: PaginationInfo) => `${info.startIndex}-${info.endIndex}`
const renderGoto = () => '前往'
const renderPrev = () => '上一页'
const renderNext = () => '下一页'
</script>

<template>
  <div class="pagination-demo">
    <template v-if="variant === 'basic'">
      <div class="pagination-demo__column">
        <ZPagination
          :page="page1"
          :item-count="200"
          @update:page="page1 = $event"
        />
        <span class="pagination-demo__value">点击 ... 会打开页码下拉，选择后跳转。当前页: {{ page1 }}</span>
      </div>
    </template>

    <template v-else-if="variant === 'simple'">
      <ZPagination
        simple
        :page="page2"
        :item-count="200"
        @update:page="page2 = $event"
      />
      <span class="pagination-demo__value">当前页: {{ page2 }}</span>
    </template>

    <template v-else-if="variant === 'size-picker'">
      <div class="pagination-demo__column">
        <span class="pagination-demo__label">选择每页条数</span>
        <ZPagination
          show-size-picker
          :page="page3"
          :page-size="pageSize1"
          :page-sizes="[5, 10, 20, 50]"
          :item-count="200"
          @update:page="page3 = $event"
          @update:page-size="pageSize1 = $event"
        />
        <span class="pagination-demo__value">当前页: {{ page3 }}，每页 {{ pageSize1 }} 条</span>
      </div>
      <div class="pagination-demo__column">
        <span class="pagination-demo__label">自定义标签</span>
        <ZPagination
          show-size-picker
          :page="page4"
          :page-size="pageSize2"
          :page-sizes="[
            { label: '少 / 10', value: 10 },
            { label: '中 / 20', value: 20 },
            { label: '多 / 50', value: 50 }
          ]"
          :item-count="200"
          @update:page="page4 = $event"
          @update:page-size="pageSize2 = $event"
        />
        <span class="pagination-demo__value">每页 {{ pageSize2 }} 条</span>
      </div>
    </template>

    <template v-else-if="variant === 'quick-jumper'">
      <div class="pagination-demo__column">
        <span class="pagination-demo__label">输入框模式</span>
        <ZPagination
          show-quick-jumper
          :show-quick-jump-dropdown="false"
          :page="page5"
          :item-count="200"
          @update:page="page5 = $event"
        />
      </div>
      <div class="pagination-demo__column">
        <span class="pagination-demo__label">下拉菜单模式（默认）</span>
        <ZPagination
          show-quick-jumper
          :page="page6"
          :item-count="200"
          @update:page="page6 = $event"
        />
        <span class="pagination-demo__value">通过前往下拉或 ... 下拉选择页码后才会触发跳转。</span>
      </div>
    </template>

    <template v-else-if="variant === 'disabled'">
      <ZPagination
        disabled
        :page="3"
        :item-count="200"
      />
    </template>

    <template v-else-if="variant === 'size'">
      <div class="pagination-demo__column pagination-demo__column--gap">
        <ZPagination size="small" :page="2" :item-count="100" />
        <ZPagination size="medium" :page="2" :item-count="100" />
        <ZPagination size="large" :page="2" :item-count="100" />
      </div>
    </template>

    <template v-else-if="variant === 'custom'">
      <div class="pagination-demo__column">
        <span class="pagination-demo__label">结果列表</span>
        <ZPagination
          show-quick-jumper
          :page="page7"
          :page-size="10"
          :page-slot="3"
          :item-count="278"
          :prefix="renderPrefix"
          :suffix="renderSuffix"
          :goto="renderGoto"
          :prev="renderPrev"
          :next="renderNext"
          @update:page="page7 = $event"
        />
        <span class="pagination-demo__value">紧凑页码中的 ... 会先展开下拉，再由用户选择目标页。</span>
      </div>
    </template>

    <template v-else-if="variant === 'display-order'">
      <div class="pagination-demo__column pagination-demo__column--gap">
        <span class="pagination-demo__label">默认: pages → size-picker → quick-jumper</span>
        <ZPagination
          show-size-picker
          show-quick-jumper
          :page="1"
          :item-count="200"
        />

        <span class="pagination-demo__label">自定义: quick-jumper → pages → size-picker</span>
        <ZPagination
          show-size-picker
          show-quick-jumper
          :display-order="['quick-jumper', 'pages', 'size-picker']"
          :page="1"
          :item-count="200"
        />

        <span class="pagination-demo__label">仅页码</span>
        <ZPagination
          show-size-picker
          show-quick-jumper
          :display-order="['pages']"
          :page="1"
          :item-count="200"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.pagination-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  max-width: 100%;
}

.pagination-demo__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  max-width: 100%;
}

.pagination-demo__column--gap {
  gap: 16px;
}

.pagination-demo__label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.pagination-demo__value {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
