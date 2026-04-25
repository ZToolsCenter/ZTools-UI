<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { SelectEmits, SelectOption, SelectProps, SelectValueType } from './Select'

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: '请选择',
  multiple: false,
  clearable: false,
  disabled: false,
  readonly: false,
  size: 'medium',
  message: '',
  mode: 'default'
})

const emit = defineEmits<SelectEmits>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement>()
const tagInputRef = ref<HTMLInputElement>()
const tagInputValue = ref('')

const isTagsMode = computed(() => props.mode === 'tags')
const isMultiple = computed(() => props.multiple || isTagsMode.value)
const isInteractive = computed(() => !props.disabled && !props.readonly)

const selectClasses = computed(() => [
  'z-select',
  `select--${props.size}`,
  {
    open: isOpen.value,
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'is-success': props.status === 'success',
    'is-warning': props.status === 'warning',
    'is-error': props.status === 'error',
    'is-multiple': isMultiple.value,
    'is-tags': isTagsMode.value,
    'has-clear': showClear.value
  }
])

const selectedValues = computed<SelectValueType[]>(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
  }

  if (props.modelValue === '' || props.modelValue === null || props.modelValue === undefined) {
    return []
  }

  return [props.modelValue]
})

const singleValue = computed(() => selectedValues.value[0])
const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === singleValue.value)
  return selected ? selected.label : props.placeholder
})

const selectedItems = computed(() =>
  selectedValues.value.map((value) => {
    const option = props.options.find((opt) => opt.value === value)
    return {
      label: option?.label ?? String(value),
      value
    }
  })
)

const visibleSelectedItems = computed(() => {
  if (typeof props.maxTagCount !== 'number' || props.maxTagCount < 0) {
    return selectedItems.value
  }

  return selectedItems.value.slice(0, props.maxTagCount)
})

const hiddenTagCount = computed(() => selectedItems.value.length - visibleSelectedItems.value.length)
const hasValue = computed(() => selectedValues.value.length > 0)
const showClear = computed(() => props.clearable && isInteractive.value && hasValue.value)

function setOpen(visible: boolean): void {
  if (isOpen.value === visible) return
  isOpen.value = visible
  emit('visible-change', visible)
}

function focusTagInput(): void {
  if (!isTagsMode.value) return
  nextTick(() => tagInputRef.value?.focus())
}

function toggleSelect(): void {
  if (!isInteractive.value) return

  if (isTagsMode.value) {
    setOpen(true)
    focusTagInput()
    return
  }

  setOpen(!isOpen.value)
}

function isSelected(value: SelectValueType): boolean {
  return selectedValues.value.includes(value)
}

function emitValue(value: SelectValueType | SelectValueType[]): void {
  emit('update:modelValue', value)
  emit('change', value)
}

function selectOption(option: SelectOption): void {
  if (!isInteractive.value || option.disabled) return

  if (isMultiple.value) {
    const nextValues = isSelected(option.value)
      ? selectedValues.value.filter((value) => value !== option.value)
      : [...selectedValues.value, option.value]
    emitValue(nextValues)
    focusTagInput()
    return
  }

  emitValue(option.value)
  setOpen(false)
}

function removeValue(value: SelectValueType): void {
  if (!isInteractive.value) return
  emitValue(selectedValues.value.filter((item) => item !== value))
  emit('tag-remove', value)
  focusTagInput()
}

function handleClear(): void {
  const emptyValue = isMultiple.value ? [] : ''
  emitValue(emptyValue)
  emit('clear')
  tagInputValue.value = ''
}

function handleMenuScroll(event: Event): void {
  emit('scroll', event)
}

function commitTagInput(): void {
  if (!isInteractive.value || !isTagsMode.value) return

  const text = tagInputValue.value.trim()
  if (!text) return

  const matchedOption = props.options.find(
    (option) => !option.disabled && (option.label === text || String(option.value) === text)
  )
  const value = matchedOption?.value ?? text

  if (!selectedValues.value.includes(value)) {
    emitValue([...selectedValues.value, value])
    if (!matchedOption) {
      emit('tag-create', text)
    }
  }

  tagInputValue.value = ''
  setOpen(true)
}

function handleTagInputKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (!event.isComposing) {
      commitTagInput()
    }
    return
  }

  if (event.key === 'Backspace' && tagInputValue.value === '' && selectedValues.value.length > 0) {
    removeValue(selectedValues.value[selectedValues.value.length - 1])
  }
}

function handleTriggerKeydown(event: KeyboardEvent): void {
  if (!isInteractive.value) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleSelect()
  }

  if (event.key === 'Escape') {
    setOpen(false)
  }
}

function handleClickOutside(event: MouseEvent): void {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    setOpen(false)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="selectRef" :class="selectClasses">
    <div
      class="select-trigger"
      role="combobox"
      tabindex="0"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-disabled="disabled ? 'true' : undefined"
      :aria-invalid="status === 'error' ? 'true' : undefined"
      @click="toggleSelect"
      @keydown="handleTriggerKeydown"
    >
      <div class="select-selection">
        <span v-if="!isMultiple" class="select-value">{{ selectedLabel }}</span>
        <template v-else>
          <span v-if="!hasValue && !isTagsMode" class="select-placeholder">{{ placeholder }}</span>
          <span v-for="item in visibleSelectedItems" :key="item.value" class="select-tag">
            <span class="select-tag-label">{{ item.label }}</span>
            <button
              v-if="isInteractive"
              class="select-tag-close"
              type="button"
              aria-label="移除标签"
              @click.stop="removeValue(item.value)"
            >
              ×
            </button>
          </span>
          <span v-if="hiddenTagCount > 0" class="select-tag select-tag-more">
            +{{ hiddenTagCount }}
          </span>
          <input
            v-if="isTagsMode"
            ref="tagInputRef"
            v-model="tagInputValue"
            class="select-tag-input"
            type="text"
            :placeholder="hasValue ? '' : placeholder"
            :disabled="disabled"
            :readonly="readonly"
            @click.stop="setOpen(true)"
            @keydown.stop="handleTagInputKeydown"
          />
        </template>
      </div>

      <button
        v-if="showClear"
        class="select-clear"
        type="button"
        aria-label="清空选择"
        @click.stop="handleClear"
      >
        ×
      </button>

      <svg
        class="select-arrow"
        :class="{ rotate: isOpen }"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <Transition name="select-menu">
      <div
        v-if="isOpen"
        class="select-menu"
        role="listbox"
        :aria-multiselectable="isMultiple ? 'true' : undefined"
        @scroll="handleMenuScroll"
      >
        <div
          v-for="option in options"
          :key="option.value"
          class="select-item"
          :class="{ active: isSelected(option.value), disabled: option.disabled }"
          role="option"
          :aria-selected="isSelected(option.value)"
          :aria-disabled="option.disabled ? 'true' : undefined"
          @click="selectOption(option)"
        >
          <span class="select-item-label">{{ option.label }}</span>
          <svg
            v-if="isSelected(option.value)"
            class="select-item-check"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 4L6 11L3 8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </Transition>

    <div v-if="message" class="select-footer">
      <span class="select-message">{{ message }}</span>
    </div>
  </div>
</template>

<style scoped>
.z-select {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  min-width: 150px;
  color: var(--text-color);
}

.select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--control-bg);
  border: 2px solid var(--control-border);
  border-radius: 6px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  user-select: none;
  box-sizing: border-box;
}

.select-trigger:hover {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.z-select.open .select-trigger,
.select-trigger:focus-visible {
  background: var(--active-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.z-select.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.z-select.is-disabled .select-trigger {
  cursor: not-allowed;
}

.z-select.is-readonly .select-trigger {
  cursor: default;
}

.z-select.is-success {
  --select-status-color: var(--success-color);
  --select-status-bg: var(--success-light-bg);
}

.z-select.is-warning {
  --select-status-color: var(--warning-color);
  --select-status-bg: var(--warning-light-bg);
}

.z-select.is-error {
  --select-status-color: var(--danger-color);
  --select-status-bg: var(--danger-light-bg);
}

.z-select.is-success .select-trigger,
.z-select.is-success .select-trigger:hover,
.z-select.is-warning .select-trigger,
.z-select.is-warning .select-trigger:hover,
.z-select.is-error .select-trigger,
.z-select.is-error .select-trigger:hover {
  border-color: color-mix(in srgb, var(--select-status-color), black 15%);
}

.z-select.is-success.open .select-trigger,
.z-select.is-success .select-trigger:focus-visible,
.z-select.is-warning.open .select-trigger,
.z-select.is-warning .select-trigger:focus-visible,
.z-select.is-error.open .select-trigger,
.z-select.is-error .select-trigger:focus-visible {
  box-shadow: 0 0 0 3px var(--select-status-bg);
}

.select--small .select-trigger {
  min-height: 28px;
  padding: 3px 10px;
  font-size: 12px;
}

.select--medium .select-trigger {
  min-height: 34px;
  padding: 5px 12px;
  font-size: 14px;
}

.select--large .select-trigger {
  min-height: 40px;
  padding: 8px 14px;
  font-size: 15px;
}

.select-selection {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 0;
}

.select-value,
.select-placeholder {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-placeholder {
  color: var(--placeholder-color);
}

.select-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 3px 7px;
  border: 1px solid color-mix(in srgb, var(--primary-color), transparent 65%);
  border-radius: 4px;
  background: var(--primary-light-bg);
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.select-tag-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select-tag-more {
  color: var(--text-secondary);
  border-color: color-mix(in srgb, var(--text-secondary), transparent 70%);
  background: color-mix(in srgb, var(--text-secondary), transparent 88%);
}

.select-tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 2px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: currentColor;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.75;
  transition: all 0.2s;
}

.select-tag-close:hover {
  background: color-mix(in srgb, currentColor, transparent 85%);
  opacity: 1;
}

.select-tag-input {
  flex: 1;
  min-width: 72px;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1.5;
}

.select-tag-input::placeholder {
  color: var(--placeholder-color);
}

.select-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.select-clear:hover {
  background: var(--hover-bg);
  color: var(--primary-color);
}

.select-arrow {
  flex-shrink: 0;
  color: var(--text-secondary);
  transition: transform 0.2s;
}

.select-arrow.rotate {
  transform: rotate(180deg);
}

.select-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid var(--control-border);
  border-radius: 6px;
  backdrop-filter: blur(100px) saturate(200%) brightness(110%);
  -webkit-backdrop-filter: blur(100px) saturate(200%) brightness(110%);
  overflow: hidden;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

:global(html.dark) .select-menu {
  background: rgba(48, 48, 48, 0.98);
}

.select-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 16px;
  color: var(--text-color);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.select-item:hover {
  background: var(--hover-bg);
}

.select-item.active {
  background: var(--active-bg);
  color: var(--primary-color);
  font-weight: 500;
}

.select-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-item.disabled:hover {
  background: transparent;
}

.select-item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-item-check {
  flex-shrink: 0;
  color: var(--primary-color);
}

.select-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 18px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.select-message {
  flex: 1;
  min-width: 0;
}

.z-select.is-success .select-message {
  color: var(--success-color);
}

.z-select.is-warning .select-message {
  color: var(--warning-color);
}

.z-select.is-error .select-message {
  color: var(--danger-color);
}

.select-menu-enter-active {
  animation: select-in 0.15s ease-out;
}

.select-menu-leave-active {
  animation: select-out 0.1s ease-in;
}

@keyframes select-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes select-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-4px);
  }
}
</style>
