<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PaginationProps, PaginationEmits, PaginationInfo } from './Pagination'

const props = withDefaults(defineProps<PaginationProps>(), {
  defaultPage: 1,
  defaultPageSize: 10,
  pageCount: 1,
  pageSizes: () => [10],
  pageSlot: 9,
  showSizePicker: false,
  showQuickJumper: false,
  showQuickJumpDropdown: true,
  displayOrder: () => ['pages', 'size-picker', 'quick-jumper'],
  size: 'medium',
  simple: false,
  disabled: false
})

const emit = defineEmits<PaginationEmits>()

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

const pageItems = computed<PageItem[]>(() => {
  const page = currentPage.value
  const pageCount = totalPageCount.value
  const slot = props.pageSlot

  if (pageCount <= slot) {
    return Array.from({ length: pageCount }, (_, i) => ({
      type: 'page' as const,
      value: i + 1
    }))
  }

  const items: PageItem[] = []
  const sidePages = Math.max(1, Math.floor((slot - 4) / 2))

  items.push({ type: 'page', value: 1 })

  let left = Math.max(2, page - sidePages)
  let right = Math.min(pageCount - 1, page + sidePages)

  if (page - sidePages <= 2) {
    right = Math.min(pageCount - 1, left + slot - 3)
  }
  if (page + sidePages >= pageCount - 1) {
    left = Math.max(2, right - slot + 3)
  }

  if (left > 2) {
    items.push({ type: 'ellipsis', value: Math.max(2, page - slot + 4) })
  }
  for (let i = left; i <= right; i++) {
    items.push({ type: 'page', value: i })
  }
  if (right < pageCount - 1) {
    items.push({ type: 'ellipsis', value: Math.min(pageCount - 1, page + slot - 4) })
  }

  items.push({ type: 'page', value: pageCount })

  return items
})

// --- Size picker options ---

const pageSizeOptions = computed(() => {
  return (props.pageSizes ?? [10]).map((item) => {
    if (typeof item === 'number') {
      return { label: `${item} 条/页`, value: item }
    }
    return { label: item.label, value: item.value }
  })
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
  // Reset to first page when size changes
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

function handleEllipsisClick(value: number | undefined): void {
  if (value !== undefined) {
    handlePageChange(value)
  }
}

// --- Size class ---

const sizeClass = computed(() => `zt-pagination--${props.size}`)

const sizePickerClass = computed(() => {
  const map: Record<string, string> = {
    small: 'zt-pagination__size-select--small',
    medium: 'zt-pagination__size-select--medium',
    large: 'zt-pagination__size-select--large'
  }
  return map[props.size] || map.medium
})
</script>

<template>
  <div
    :class="[
      'zt-pagination',
      sizeClass,
      {
        'zt-pagination--disabled': disabled,
        'zt-pagination--simple': simple
      }
    ]"
  >
    <!-- Simple mode: prev + indicator + next -->
    <template v-if="simple">
      <button
        class="zt-pagination__btn zt-pagination__btn--prev"
        :disabled="disabled || currentPage <= 1"
        @click="handlePageChange(currentPage - 1)"
      >
        <component
          v-if="prev"
          :is="prev(paginationInfo)"
        />
        <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
          <path d="M10.5 3L5.5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
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
        <component
          v-if="next"
          :is="next(paginationInfo)"
        />
        <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
          <path d="M5.5 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </template>

    <!-- Full mode: render sections in display-order -->
    <template v-else>
      <template v-for="section in displayOrder" :key="section">
        <!-- Pages section -->
        <div v-if="section === 'pages'" class="zt-pagination__pages">
          <!-- Prefix -->
          <span v-if="prefix" class="zt-pagination__prefix">
            <component :is="prefix(paginationInfo)" />
          </span>

          <!-- Prev button -->
          <button
            class="zt-pagination__btn zt-pagination__btn--prev"
            :disabled="disabled || currentPage <= 1"
            @click="handlePageChange(currentPage - 1)"
          >
            <component
              v-if="prev"
              :is="prev(paginationInfo)"
            />
            <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
              <path d="M10.5 3L5.5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Page items -->
          <template v-for="item in pageItems" :key="item.type === 'ellipsis' ? `ellipsis-${item.value}` : `page-${item.value}`">
            <!-- Ellipsis -->
            <button
              v-if="item.type === 'ellipsis'"
              class="zt-pagination__btn zt-pagination__btn--ellipsis"
              :disabled="disabled"
              @click="handleEllipsisClick(item.value)"
              :title="item.value !== undefined ? `跳至第 ${item.value} 页` : undefined"
            >
              <component
                v-if="label"
                :is="label({ ...paginationInfo, type: 'ellipsis', value: item.value })"
              />
              <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
                <circle cx="3.5" cy="8" r="1.25" />
                <circle cx="8" cy="8" r="1.25" />
                <circle cx="12.5" cy="8" r="1.25" />
              </svg>
            </button>

            <!-- Page number -->
            <button
              v-else
              class="zt-pagination__btn zt-pagination__btn--page"
              :class="{ 'zt-pagination__btn--active': item.value === currentPage }"
              :disabled="disabled"
              @click="handlePageChange(item.value!)"
            >
              <component
                v-if="label"
                :is="label({ ...paginationInfo, type: 'page', value: item.value })"
              />
              <span v-else>{{ item.value }}</span>
            </button>
          </template>

          <!-- Next button -->
          <button
            class="zt-pagination__btn zt-pagination__btn--next"
            :disabled="disabled || currentPage >= totalPageCount"
            @click="handlePageChange(currentPage + 1)"
          >
            <component
              v-if="next"
              :is="next(paginationInfo)"
            />
            <svg v-else viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
              <path d="M5.5 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Suffix -->
          <span v-if="suffix" class="zt-pagination__suffix">
            <component :is="suffix(paginationInfo)" />
          </span>
        </div>

        <!-- Size picker section -->
        <div v-if="section === 'size-picker' && showSizePicker" class="zt-pagination__size-picker">
          <select
            :class="['zt-pagination__size-select', sizePickerClass]"
            :value="currentPageSize"
            :disabled="disabled"
            @change="handlePageSizeChange(Number(($event.target as HTMLSelectElement).value))"
          >
            <option
              v-for="option in pageSizeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Quick jumper section -->
        <div v-if="section === 'quick-jumper' && showQuickJumper" class="zt-pagination__quick-jumper">
          <component
            v-if="goto"
            :is="goto(paginationInfo)"
          />
          <span v-else class="zt-pagination__quick-jumper-label">跳至</span>

          <template v-if="showQuickJumpDropdown && totalPageCount <= 200">
            <select
              :class="['zt-pagination__size-select', sizePickerClass]"
              :value="currentPage"
              :disabled="disabled"
              @change="handlePageChange(Number(($event.target as HTMLSelectElement).value))"
            >
              <option
                v-for="p in totalPageCount"
                :key="p"
                :value="p"
              >
                {{ p }}
              </option>
            </select>
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
}

.zt-pagination--small {
  gap: 4px;
}

.zt-pagination--large {
  gap: 12px;
}

/* --- Pages section --- */
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

/* --- Buttons --- */
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

/* Ellipsis button */
.zt-pagination__btn--ellipsis {
  border-color: transparent;
  background: transparent;
  cursor: pointer;
}

.zt-pagination__btn--ellipsis:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: var(--control-border);
}

/* --- Simple mode --- */
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

/* --- Size picker --- */
.zt-pagination__size-picker {
  display: inline-flex;
  align-items: center;
}

.zt-pagination__size-select {
  height: 32px;
  padding: 0 24px 0 8px;
  border: 2px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  color: var(--text-color);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='12' height='12'%3E%3Cpath d='M4 6l4 4 4-4' stroke='gray' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 4px center;
}

.zt-pagination__size-select:hover:not(:disabled) {
  background-color: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-pagination__size-select:focus {
  box-shadow: 0 0 0 3px var(--primary-light-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-pagination__size-select:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zt-pagination__size-select--small {
  height: 26px;
  font-size: 11px;
  border-radius: 4px;
  padding: 0 20px 0 6px;
}

.zt-pagination__size-select--large {
  height: 38px;
  font-size: 15px;
  border-radius: 8px;
  padding: 0 28px 0 10px;
}

/* --- Quick jumper --- */
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

.zt-pagination__quick-jumper-label {
  color: var(--text-secondary);
}

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

/* Remove number input spinners */
.zt-pagination__quick-jumper-input::-webkit-outer-spin-button,
.zt-pagination__quick-jumper-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.zt-pagination__quick-jumper-input[type='number'] {
  -moz-appearance: textfield;
}

/* --- Disabled state --- */
.zt-pagination--disabled {
  pointer-events: none;
}
</style>
