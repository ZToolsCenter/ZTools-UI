<script setup lang="ts">
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PropType, VNodeChild } from 'vue'
import { ZSelect } from '../Select'
import type { SelectModelValue, SelectOption } from '../Select'
import type { PaginationEmits, PaginationInfo, PaginationProps } from './Pagination'

const props = withDefaults(defineProps<PaginationProps>(), {
  defaultPage: 1,
  defaultPageSize: 10,
  pageCount: 1,
  pageSizes: () => [10],
  pageSlot: 'auto',
  showSizePicker: false,
  showQuickJumper: false,
  showQuickJumpDropdown: true,
  displayOrder: () => ['pages', 'size-picker', 'quick-jumper'],
  size: 'medium',
  simple: false,
  disabled: false
})

const emit = defineEmits<PaginationEmits>()

const RenderVNodeChild = defineComponent({
  name: 'RenderVNodeChild',
  props: {
    content: {
      type: null as unknown as PropType<VNodeChild>,
      default: null
    }
  },
  setup(renderProps) {
    return () => {
      if (renderProps.content == null || renderProps.content === false) {
        return null
      }

      return renderProps.content as VNodeChild
    }
  }
})

const MIN_LEADING_PAGE_COUNT = 3
const MIN_ADAPTIVE_PAGE_SLOT = MIN_LEADING_PAGE_COUNT + 2
const DEFAULT_AUTO_PAGE_SLOT = 9
const MEASURE_TOLERANCE = 4
const RECOVERY_BUFFER = 12
const DEFAULT_PAGE_ITEM_WIDTH = 36

const paginationRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null
let measureFrame: number | null = null
let measurePending = false

// --- Controlled / Uncontrolled state ---

const currentPage = ref(props.page ?? props.defaultPage)
const currentPageSize = ref(props.pageSize ?? props.defaultPageSize)

watch(
  () => props.page,
  (val) => {
    if (val !== undefined) {
      currentPage.value = val
    }
  }
)

watch(
  () => props.pageSize,
  (val) => {
    if (val !== undefined) {
      currentPageSize.value = val
    }
  }
)

// --- Derived state ---

const totalPageCount = computed(() => {
  if (props.itemCount !== undefined && props.itemCount > 0) {
    const count = Math.ceil(props.itemCount / currentPageSize.value)
    return count > 0 ? count : 1
  }

  return props.pageCount > 0 ? props.pageCount : 1
})

const maxPageSlot = computed(() => {
  if (props.pageSlot === 'auto' || props.pageSlot === undefined) {
    return DEFAULT_AUTO_PAGE_SLOT
  }

  const normalizedSlot = Math.floor(Number(props.pageSlot))
  return Number.isFinite(normalizedSlot) ? Math.max(1, normalizedSlot) : DEFAULT_AUTO_PAGE_SLOT
})

const isAutoPageSlot = computed(() => props.pageSlot === 'auto' || props.pageSlot === undefined)
const minAdaptivePageSlot = computed(() => Math.min(maxPageSlot.value, MIN_ADAPTIVE_PAGE_SLOT))
const adaptivePageSlot = ref(maxPageSlot.value)
const effectivePageSlot = computed(() => {
  if (props.simple || !isAutoPageSlot.value) return maxPageSlot.value

  return Math.min(maxPageSlot.value, Math.max(minAdaptivePageSlot.value, adaptivePageSlot.value))
})

const paginationInfo = computed<PaginationInfo>(() => {
  const startIndex = props.itemCount
    ? (currentPage.value - 1) * currentPageSize.value + 1
    : 0
  const endIndex = props.itemCount
    ? Math.min(currentPage.value * currentPageSize.value, props.itemCount)
    : 0

  return {
    page: currentPage.value,
    pageSize: currentPageSize.value,
    pageCount: totalPageCount.value,
    itemCount: props.itemCount ?? 0,
    startIndex,
    endIndex
  }
})

// --- Page items (with ellipsis logic) ---

interface PageItem {
  type: 'page' | 'ellipsis'
  value?: number
}

function createPageItem(value: number): PageItem {
  return {
    type: 'page',
    value
  }
}

function createEllipsisItem(leftPage: number, rightPage: number): PageItem {
  const minPage = Math.min(leftPage, rightPage)
  const maxPage = Math.max(leftPage, rightPage)
  const value = maxPage - minPage > 1
    ? Math.min(maxPage - 1, Math.max(minPage + 1, Math.floor((minPage + maxPage) / 2)))
    : undefined

  return {
    type: 'ellipsis',
    value
  }
}

function pushPageRange(items: PageItem[], start: number, end: number): void {
  for (let page = start; page <= end; page += 1) {
    items.push(createPageItem(page))
  }
}

function createCompactPageItems(page: number, pageCount: number, slot: number): PageItem[] {
  if (slot <= 1) {
    return [createPageItem(page)]
  }

  if (slot === 2) {
    return [createPageItem(1), createPageItem(pageCount)]
  }

  if (slot === 3) {
    if (page <= 2) {
      return [createPageItem(1), createPageItem(2), createPageItem(pageCount)]
    }

    if (page >= pageCount - 1) {
      return [createPageItem(1), createPageItem(pageCount - 1), createPageItem(pageCount)]
    }

    return [createPageItem(1), createEllipsisItem(1, pageCount), createPageItem(pageCount)]
  }

  if (slot === 4) {
    if (page <= 2) {
      return [createPageItem(1), createPageItem(2), createEllipsisItem(2, pageCount), createPageItem(pageCount)]
    }

    if (page >= pageCount - 1) {
      return [createPageItem(1), createEllipsisItem(1, pageCount - 1), createPageItem(pageCount - 1), createPageItem(pageCount)]
    }

    return [createPageItem(1), createPageItem(2), createEllipsisItem(2, pageCount), createPageItem(pageCount)]
  }

  return [
    createPageItem(1),
    createPageItem(2),
    createPageItem(3),
    createEllipsisItem(3, pageCount),
    createPageItem(pageCount)
  ]
}

function createStandardPageItems(page: number, pageCount: number, slot: number): PageItem[] {
  const items: PageItem[] = []

  if (page < slot - 2) {
    pushPageRange(items, 1, slot - 2)
    items.push(createEllipsisItem(slot - 2, pageCount))
    items.push(createPageItem(pageCount))
    return items
  }

  if (page > pageCount - slot + 3) {
    items.push(createPageItem(1))
    items.push(createEllipsisItem(1, pageCount - slot + 3))
    pushPageRange(items, pageCount - slot + 3, pageCount)
    return items
  }

  const middleCount = slot - 4
  const leftCount = Math.floor(middleCount / 2)
  const rightCount = middleCount - leftCount - 1

  let middleStart = page - leftCount
  let middleEnd = page + rightCount

  if (middleStart < 2) {
    middleEnd += 2 - middleStart
    middleStart = 2
  }

  if (middleEnd > pageCount - 1) {
    middleStart -= middleEnd - (pageCount - 1)
    middleEnd = pageCount - 1
  }

  items.push(createPageItem(1))
  items.push(createEllipsisItem(1, middleStart))
  pushPageRange(items, middleStart, middleEnd)
  items.push(createEllipsisItem(middleEnd, pageCount))
  items.push(createPageItem(pageCount))

  return items
}

const pageItems = computed<PageItem[]>(() => {
  const page = currentPage.value
  const pageCount = totalPageCount.value
  const slot = effectivePageSlot.value

  if (pageCount <= slot) {
    return Array.from({ length: pageCount }, (_, index) => createPageItem(index + 1))
  }

  if (slot <= MIN_ADAPTIVE_PAGE_SLOT) {
    return createCompactPageItems(page, pageCount, slot)
  }

  return createStandardPageItems(page, pageCount, slot)
})

// --- Size picker options ---

const pageSizeOptions = computed<SelectOption[]>(() => {
  return (props.pageSizes ?? [10]).map((item) => {
    if (typeof item === 'number') {
      return { label: `${item} 条/页`, value: item }
    }

    return { label: item.label, value: item.value }
  })
})

const quickJumpOptions = computed<SelectOption[]>(() => {
  return Array.from({ length: totalPageCount.value }, (_, index) => ({
    label: String(index + 1),
    value: index + 1
  }))
})

// --- Quick jumper ---

const jumpPage = ref<number | null>(null)

function handleJumpInput(event: Event): void {
  const target = event.target as HTMLInputElement
  jumpPage.value = target.value === '' ? null : Number(target.value)
}

function handleJump(): void {
  if (jumpPage.value === null) return

  const page = jumpPage.value
  jumpPage.value = null

  if (page >= 1 && page <= totalPageCount.value) {
    handlePageChange(page)
  }
}

// --- Event handlers ---

function handlePageChange(page: number): void {
  if (props.disabled) return
  if (page < 1 || page > totalPageCount.value) return
  if (page === currentPage.value) return

  if (props.page === undefined) {
    currentPage.value = page
  }

  emit('update:page', page)
}

function handlePageSizeChange(size: number): void {
  if (props.disabled) return
  if (size === currentPageSize.value) return

  if (props.pageSize === undefined) {
    currentPageSize.value = size
  }

  const newPageCount = props.itemCount
    ? Math.max(1, Math.ceil((props.itemCount ?? 0) / size))
    : props.pageCount
  const newPage = currentPage.value > newPageCount ? newPageCount : currentPage.value

  if (props.page === undefined) {
    currentPage.value = newPage
  }

  emit('update:pageSize', size)

  if (newPage !== currentPage.value) {
    emit('update:page', newPage)
  }
}

function handleEllipsisSelect(value: SelectModelValue): void {
  const page = Array.isArray(value) ? Number(value[0]) : Number(value)

  if (!Number.isFinite(page)) {
    return
  }

  handlePageChange(page)
}

// --- Adaptive measurement ---

function getAveragePageItemWidth(): number {
  const root = paginationRef.value
  const pagesElement = root?.querySelector<HTMLElement>('.zt-pagination__pages')

  if (!pagesElement) return DEFAULT_PAGE_ITEM_WIDTH

  const pageButtons = Array.from(
    pagesElement.querySelectorAll<HTMLElement>('.zt-pagination__btn--page, .zt-pagination__btn--ellipsis')
  )

  if (!pageButtons.length) return DEFAULT_PAGE_ITEM_WIDTH

  const totalWidth = pageButtons.reduce((sum, button) => sum + button.getBoundingClientRect().width, 0)
  const styles = window.getComputedStyle(pagesElement)
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0

  return totalWidth / pageButtons.length + gap
}

function setAdaptivePageSlot(nextSlot: number): void {
  const normalizedSlot = Math.min(
    maxPageSlot.value,
    Math.max(minAdaptivePageSlot.value, Math.floor(nextSlot))
  )

  if (normalizedSlot === adaptivePageSlot.value) return

  adaptivePageSlot.value = normalizedSlot
  scheduleMeasure()
}

function measureAdaptivePageSlot(): void {
  const root = paginationRef.value
  if (!root) return

  if (props.simple || !isAutoPageSlot.value) {
    adaptivePageSlot.value = maxPageSlot.value
    return
  }

  if (adaptivePageSlot.value > maxPageSlot.value || adaptivePageSlot.value < minAdaptivePageSlot.value) {
    adaptivePageSlot.value = Math.min(
      maxPageSlot.value,
      Math.max(minAdaptivePageSlot.value, adaptivePageSlot.value)
    )
  }

  const parentWidth = root.parentElement?.getBoundingClientRect().width ?? 0
  const rootWidth = root.getBoundingClientRect().width
  const availableWidth = parentWidth > 0 ? parentWidth : rootWidth

  if (availableWidth <= 0) return

  const contentWidth = Math.max(root.scrollWidth, rootWidth)
  const overflowWidth = contentWidth - availableWidth

  if (overflowWidth > MEASURE_TOLERANCE && adaptivePageSlot.value > minAdaptivePageSlot.value) {
    const averagePageItemWidth = getAveragePageItemWidth()
    const reduceBy = Math.max(1, Math.ceil(overflowWidth / averagePageItemWidth))
    setAdaptivePageSlot(adaptivePageSlot.value - reduceBy)
    return
  }

  const spareWidth = availableWidth - contentWidth

  if (spareWidth > RECOVERY_BUFFER && adaptivePageSlot.value < maxPageSlot.value) {
    const averagePageItemWidth = getAveragePageItemWidth()
    const expandBy = Math.floor((spareWidth - RECOVERY_BUFFER) / averagePageItemWidth)

    if (expandBy >= 1) {
      setAdaptivePageSlot(adaptivePageSlot.value + expandBy)
    }
  }
}

function scheduleMeasure(): void {
  if (measurePending) return

  measurePending = true

  nextTick(() => {
    if (!measurePending) return

    if (measureFrame !== null) {
      cancelAnimationFrame(measureFrame)
    }

    measureFrame = requestAnimationFrame(() => {
      measurePending = false
      measureFrame = null
      measureAdaptivePageSlot()
    })
  })
}

onMounted(() => {
  const root = paginationRef.value

  if (typeof ResizeObserver !== 'undefined' && root) {
    resizeObserver = new ResizeObserver(() => {
      scheduleMeasure()
    })
    resizeObserver.observe(root)

    if (root.parentElement) {
      resizeObserver.observe(root.parentElement)
    }
  } else {
    window.addEventListener('resize', scheduleMeasure)
  }

  scheduleMeasure()
})

watch(
  [maxPageSlot, minAdaptivePageSlot, isAutoPageSlot],
  () => {
    adaptivePageSlot.value = Math.min(
      maxPageSlot.value,
      Math.max(minAdaptivePageSlot.value, adaptivePageSlot.value)
    )
    scheduleMeasure()
  },
  { flush: 'post' }
)

watch(
  () => [
    props.pageSlot,
    props.size,
    props.simple,
    props.showSizePicker,
    props.showQuickJumper,
    props.showQuickJumpDropdown,
    props.displayOrder.join('|'),
    props.itemCount ?? -1,
    props.pageCount,
    currentPage.value,
    currentPageSize.value,
    totalPageCount.value,
    pageSizeOptions.value.map((item) => `${item.value}:${item.label}`).join('|')
  ],
  () => {
    scheduleMeasure()
  },
  { flush: 'post' }
)

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  window.removeEventListener('resize', scheduleMeasure)

  if (measureFrame !== null) {
    cancelAnimationFrame(measureFrame)
    measureFrame = null
  }

  measurePending = false
})

// --- Size class ---

const sizeClass = computed(() => `zt-pagination--${props.size}`)

const sizePickerClass = computed(() => {
  const map: Record<string, string> = {
    small: 'zt-pagination__select--small',
    medium: 'zt-pagination__select--medium',
    large: 'zt-pagination__select--large'
  }

  return map[props.size] || map.medium
})

const selectProps = computed(() => props.selectProps ?? {})

const quickJumpSelectProps = computed(() => {
  const baseProps = {
    size: props.size,
    disabled: props.disabled,
    placement: 'top-end' as const,
    to: props.to
  }

  return {
    ...baseProps,
    ...selectProps.value,
    class: undefined
  }
})

const ellipsisSelectProps = computed(() => {
  const { modelValue, options, disabled, class: className, ...rest } = quickJumpSelectProps.value as Record<string, unknown>

  void modelValue
  void options
  void disabled
  void className

  return rest
})

const sizePickerSelectProps = computed(() => quickJumpSelectProps.value)
</script>

<template>
  <div
    ref="paginationRef"
    :class="[
      'zt-pagination',
      sizeClass,
      {
        'zt-pagination--disabled': disabled,
        'zt-pagination--simple': simple
      }
    ]"
  >
    <template v-if="simple">
      <button
        class="zt-pagination__btn zt-pagination__btn--prev"
        :disabled="disabled || currentPage <= 1"
        @click="handlePageChange(currentPage - 1)"
      >
        <RenderVNodeChild v-if="prev" :content="prev(paginationInfo)" />
        <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
          <path d="M10.5 3L5.5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <span class="zt-pagination__simple-indicator">
        {{ currentPage }} / {{ totalPageCount }}
      </span>

      <button
        class="zt-pagination__btn zt-pagination__btn--next"
        :disabled="disabled || currentPage >= totalPageCount"
        @click="handlePageChange(currentPage + 1)"
      >
        <RenderVNodeChild v-if="next" :content="next(paginationInfo)" />
        <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
          <path d="M5.5 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </template>

    <template v-else>
      <template v-for="section in displayOrder" :key="section">
        <div v-if="section === 'pages'" class="zt-pagination__pages">
          <span v-if="prefix" class="zt-pagination__prefix">
            <RenderVNodeChild :content="prefix(paginationInfo)" />
          </span>

          <button
            class="zt-pagination__btn zt-pagination__btn--prev"
            :disabled="disabled || currentPage <= 1"
            @click="handlePageChange(currentPage - 1)"
          >
            <RenderVNodeChild v-if="prev" :content="prev(paginationInfo)" />
            <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
              <path d="M10.5 3L5.5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <template
            v-for="item in pageItems"
            :key="item.type === 'ellipsis' ? `ellipsis-${item.value}` : `page-${item.value}`"
          >
            <ZSelect
              v-if="item.type === 'ellipsis'"
              v-bind="ellipsisSelectProps"
              :class="['zt-pagination__ellipsis-select', sizePickerClass]"
              :model-value="currentPage"
              :options="quickJumpOptions"
              :disabled="disabled"
              @update:model-value="handleEllipsisSelect"
            >
              <template #trigger="{ triggerProps, setTriggerRef, visible, disabled: triggerDisabled }">
                <button
                  :ref="setTriggerRef"
                  v-bind="triggerProps"
                  type="button"
                  class="zt-pagination__btn zt-pagination__btn--ellipsis"
                  :class="{ 'zt-pagination__btn--ellipsis-open': visible }"
                  :disabled="triggerDisabled"
                  title="选择要前往的页面"
                >
                  <RenderVNodeChild
                    v-if="label"
                    :content="label({ ...paginationInfo, type: 'ellipsis', value: item.value })"
                  />
                  <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
                    <circle cx="3.5" cy="8" r="1.25" />
                    <circle cx="8" cy="8" r="1.25" />
                    <circle cx="12.5" cy="8" r="1.25" />
                  </svg>
                </button>
              </template>
            </ZSelect>

            <button
              v-else
              class="zt-pagination__btn zt-pagination__btn--page"
              :class="{ 'zt-pagination__btn--active': item.value === currentPage }"
              :disabled="disabled"
              @click="handlePageChange(item.value!)"
            >
              <RenderVNodeChild
                v-if="label"
                :content="label({ ...paginationInfo, type: 'page', value: item.value })"
              />
              <span v-else>{{ item.value }}</span>
            </button>
          </template>

          <button
            class="zt-pagination__btn zt-pagination__btn--next"
            :disabled="disabled || currentPage >= totalPageCount"
            @click="handlePageChange(currentPage + 1)"
          >
            <RenderVNodeChild v-if="next" :content="next(paginationInfo)" />
            <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
              <path d="M5.5 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <span v-if="suffix" class="zt-pagination__suffix">
            <RenderVNodeChild :content="suffix(paginationInfo)" />
          </span>
        </div>

        <div v-if="section === 'size-picker' && showSizePicker" class="zt-pagination__size-picker">
          <ZSelect
            v-bind="sizePickerSelectProps"
            :class="['zt-pagination__select', sizePickerClass]"
            :model-value="currentPageSize"
            :options="pageSizeOptions"
            @update:model-value="handlePageSizeChange(Number($event))"
          />
        </div>

        <div v-if="section === 'quick-jumper' && showQuickJumper" class="zt-pagination__quick-jumper">
          <RenderVNodeChild v-if="goto" :content="goto(paginationInfo)" />
          <span v-else class="zt-pagination__quick-jumper-label">跳至</span>

          <template v-if="showQuickJumpDropdown && totalPageCount <= 200">
            <ZSelect
              v-bind="quickJumpSelectProps"
              :class="['zt-pagination__select', sizePickerClass]"
              :model-value="currentPage"
              :options="quickJumpOptions"
              @update:model-value="handlePageChange(Number($event))"
            />
          </template>
          <template v-else>
            <input
              class="zt-pagination__quick-jumper-input"
              type="text"
              :value="jumpPage ?? ''"
              :disabled="disabled"
              :placeholder="String(currentPage)"
              @input="handleJumpInput"
              @keyup.enter="handleJump"
            />
          </template>

          <span v-if="!goto" class="zt-pagination__quick-jumper-suffix">页</span>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.zt-pagination {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  max-width: 100%;
  box-sizing: border-box;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.zt-pagination--small {
  gap: 4px;
}

.zt-pagination--large {
  gap: 12px;
}

.zt-pagination__pages {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.zt-pagination--small .zt-pagination__pages {
  gap: 2px;
}

.zt-pagination--large .zt-pagination__pages {
  gap: 6px;
}

.zt-pagination__prefix,
.zt-pagination__suffix {
  display: inline-flex;
  align-items: center;
}

.zt-pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: 2px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  line-height: 1;
}

.zt-pagination--small .zt-pagination__btn {
  min-width: 26px;
  height: 26px;
  font-size: 12px;
  border-radius: 4px;
}

.zt-pagination--large .zt-pagination__btn {
  min-width: 38px;
  height: 38px;
  font-size: 16px;
  border-radius: 8px;
}

.zt-pagination__btn:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  color: var(--primary-color);
}

.zt-pagination__btn:active:not(:disabled) {
  background: var(--active-bg);
}

.zt-pagination__btn:focus-visible {
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.zt-pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zt-pagination__btn--active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--text-on-primary);
}

.zt-pagination__btn--active:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  color: var(--text-on-primary);
}

.zt-pagination__ellipsis-select {
  min-width: 0;
}

.zt-pagination__btn--ellipsis {
  border-color: transparent;
  background: transparent;
  cursor: pointer;
}

.zt-pagination__btn--ellipsis:hover:not(:disabled),
.zt-pagination__btn--ellipsis-open {
  background: var(--active-bg);
  border-color: var(--control-border);
  color: var(--primary-color);
}

.zt-pagination__simple-indicator {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--text-color);
}

.zt-pagination--small .zt-pagination__simple-indicator {
  font-size: 12px;
  padding: 0 6px;
}

.zt-pagination--large .zt-pagination__simple-indicator {
  font-size: 16px;
  padding: 0 10px;
}

.zt-pagination__size-picker {
  display: inline-flex;
  align-items: center;
}

.zt-pagination__select {
  min-width: 0;
}

.zt-pagination__select :deep(.select-trigger) {
  min-height: 32px;
  padding: 0 12px;
  font-size: 13px;
}

.zt-pagination__select--small :deep(.select-trigger) {
  min-height: 26px;
  padding: 0 10px;
  font-size: 11px;
  border-radius: 4px;
}

.zt-pagination__select--large :deep(.select-trigger) {
  min-height: 38px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 8px;
}

.zt-pagination__quick-jumper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-color);
  white-space: nowrap;
}

.zt-pagination--small .zt-pagination__quick-jumper {
  gap: 4px;
  font-size: 11px;
}

.zt-pagination--large .zt-pagination__quick-jumper {
  gap: 8px;
  font-size: 15px;
}

.zt-pagination__quick-jumper-label,
.zt-pagination__quick-jumper-suffix {
  color: var(--text-secondary);
}

.zt-pagination__quick-jumper-input {
  width: 48px;
  height: 32px;
  padding: 0 6px;
  border: 2px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  color: var(--text-color);
  font-size: 13px;
  text-align: center;
  outline: none;
  transition: all 0.2s;
}

.zt-pagination--small .zt-pagination__quick-jumper-input {
  width: 40px;
  height: 26px;
  font-size: 11px;
  border-radius: 4px;
}

.zt-pagination--large .zt-pagination__quick-jumper-input {
  width: 56px;
  height: 38px;
  font-size: 15px;
  border-radius: 8px;
}

.zt-pagination__quick-jumper-input:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-pagination__quick-jumper-input:focus {
  background: var(--active-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.zt-pagination__quick-jumper-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zt-pagination__quick-jumper-input::-webkit-outer-spin-button,
.zt-pagination__quick-jumper-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.zt-pagination__quick-jumper-input[type='number'] {
  -moz-appearance: textfield;
}

.zt-pagination--disabled {
  pointer-events: none;
}
</style>
