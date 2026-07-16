<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'

defineOptions({
  inheritAttrs: false
})

type InputValue = string | number
type InputType = 'text' | 'password' | 'number' | 'email' | 'url' | 'tel' | 'search' | 'textarea'
type InputSize = 'small' | 'medium' | 'large'
type InputStatus = 'success' | 'warning' | 'error'
type NativeInputElement = HTMLInputElement | HTMLTextAreaElement

interface Props {
  modelValue?: InputValue
  defaultModelValue?: InputValue
  type?: InputType
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  maxlength?: number
  size?: InputSize
  status?: InputStatus
  message?: string
  showWordLimit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultModelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  clearable: false,
  size: 'medium',
  message: '',
  showWordLimit: false
})

defineSlots<{
  prefix?: () => unknown
  suffix?: () => unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: InputValue): void
  (e: 'change', value: InputValue): void
  (e: 'input', value: InputValue): void
  (e: 'clear'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const attrs = useAttrs()
const uncontrolledValue = ref<InputValue>(props.modelValue ?? props.defaultModelValue)
const isComposing = ref(false)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      uncontrolledValue.value = value
    }
  }
)

const mergedValue = computed<InputValue>(() => (props.modelValue !== undefined ? props.modelValue : uncontrolledValue.value))
const isTextarea = computed(() => props.type === 'textarea')
const valueText = computed(() => `${mergedValue.value}`)
const valueLength = computed(() => valueText.value.length)
const showClear = computed(() => props.clearable && !props.disabled && !props.readonly && valueLength.value > 0)
const wordLimitText = computed(() => {
  const maxLength = typeof props.maxlength === 'number' ? ` / ${props.maxlength}` : ''
  return `${valueLength.value}${maxLength}`
})
const showFooter = computed(() => Boolean(props.message) || props.showWordLimit)

const inputClasses = computed(() => [
  'zt-input',
  `zt-input--${props.size}`,
  {
    'zt-input--textarea': isTextarea.value,
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'is-success': props.status === 'success',
    'is-warning': props.status === 'warning',
    'is-error': props.status === 'error',
    'has-clear': showClear.value
  }
])

/** 根据输入类型将 DOM 字符串值转换为组件对外暴露的值。 */
function normalizeValue(value: string): InputValue {
  if (props.type === 'number' && value !== '') {
    return Number(value)
  }

  return value
}

/** 从 input 或 textarea 事件中读取当前 DOM 值。 */
function getEventValue(event: Event): string {
  return (event.target as NativeInputElement).value
}

/** 同步受控/非受控值，并统一触发 v-model 更新。 */
function updateValue(value: InputValue): void {
  if (props.modelValue === undefined) {
    uncontrolledValue.value = value
  }

  emit('update:modelValue', value)
}

/** 处理常规输入；中文等 IME 组词过程中只保留 DOM 临时值，选词完成后再同步。 */
function handleInput(event: Event): void {
  if (isComposing.value || (event as InputEvent).isComposing) {
    return
  }

  const value = normalizeValue(getEventValue(event))
  updateValue(value)
  emit('input', value)
  // 受控模式下不再手动回写 DOM 值：模板里 :value="mergedValue" 已通过响应式
  // 更新保持 DOM 同步。手动赋值 String(...) 会导致光标被重置到文本末尾。
}

/** 标记 IME 组词开始，避免拼音输入阶段提前更新组件值。 */
function handleCompositionStart(): void {
  isComposing.value = true
}

/** IME 选词完成后，用最终 DOM 值补发一次输入更新。 */
function handleCompositionEnd(event: CompositionEvent): void {
  if (!isComposing.value) {
    return
  }

  isComposing.value = false
  handleInput(event)
}

/** 在原生 change 触发时向外派发规范化后的最终值。 */
function handleChange(event: Event): void {
  emit('change', normalizeValue(getEventValue(event)))
}

/** 清空当前值，并保持 change/clear 事件与用户点击行为一致。 */
function handleClear(): void {
  updateValue('')
  emit('change', '')
  emit('clear')
}

/** 透传原生 focus 事件，方便外层处理聚焦状态。 */
function handleFocus(event: FocusEvent): void {
  emit('focus', event)
}

/** 透传原生 blur 事件，方便外层处理失焦状态。 */
function handleBlur(event: FocusEvent): void {
  emit('blur', event)
}
</script>

<template>
  <div :class="inputClasses">
    <div class="zt-input__control">
      <span v-if="$slots.prefix" class="zt-input__prefix">
        <slot name="prefix"></slot>
      </span>
      <textarea
        v-if="isTextarea"
        v-bind="attrs"
        class="zt-input__inner zt-input__textarea"
        :value="mergedValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :aria-invalid="status === 'error' ? 'true' : undefined"
        @input="handleInput"
        @change="handleChange"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <input
        v-else
        v-bind="attrs"
        class="zt-input__inner"
        :value="mergedValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :aria-invalid="status === 'error' ? 'true' : undefined"
        @input="handleInput"
        @change="handleChange"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button
        v-if="showClear"
        class="zt-input__clear"
        type="button"
        aria-label="清空输入"
        @click="handleClear"
      >
        ×
      </button>
      <span v-if="$slots.suffix" class="zt-input__suffix">
        <slot name="suffix"></slot>
      </span>
    </div>
    <div v-if="showFooter" class="zt-input__footer">
      <span v-if="message" class="zt-input__message">{{ message }}</span>
      <span v-if="showWordLimit" class="zt-input__word-limit">{{ wordLimitText }}</span>
    </div>
  </div>
</template>

<style scoped>
.zt-input {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  color: var(--text-color);
}

.zt-input__control {
  display: inline-flex;
  align-items: center;
  width: 100%;
  border: 2px solid var(--control-border);
  border-radius: 6px;
  background: var(--control-bg);
  transition: all 0.2s;
  box-sizing: border-box;
}

.zt-input:hover:not(.is-disabled) .zt-input__control {
  background: var(--hover-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
}

.zt-input:focus-within .zt-input__control {
  background: var(--active-bg);
  border-color: color-mix(in srgb, var(--primary-color), black 15%);
  box-shadow: 0 0 0 3px var(--primary-light-bg);
}

.zt-input.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.zt-input.is-success {
  --zt-input-status-color: var(--success-color);
  --zt-input-status-bg: var(--success-light-bg);
}

.zt-input.is-warning {
  --zt-input-status-color: var(--warning-color);
  --zt-input-status-bg: var(--warning-light-bg);
}

.zt-input.is-error {
  --zt-input-status-color: var(--danger-color);
  --zt-input-status-bg: var(--danger-light-bg);
}

.zt-input.is-success .zt-input__control,
.zt-input.is-success:hover:not(.is-disabled) .zt-input__control,
.zt-input.is-warning .zt-input__control,
.zt-input.is-warning:hover:not(.is-disabled) .zt-input__control,
.zt-input.is-error .zt-input__control,
.zt-input.is-error:hover:not(.is-disabled) .zt-input__control {
  border-color: color-mix(in srgb, var(--zt-input-status-color), black 15%);
}

.zt-input.is-success:focus-within .zt-input__control,
.zt-input.is-warning:focus-within .zt-input__control,
.zt-input.is-error:focus-within .zt-input__control {
  box-shadow: 0 0 0 3px var(--zt-input-status-bg);
}

.zt-input__inner {
  flex: 1;
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1.5;
}

.zt-input__textarea {
  min-height: 72px;
  resize: vertical;
}

.zt-input__inner::placeholder {
  color: var(--placeholder-color);
}

.zt-input__inner:disabled {
  cursor: not-allowed;
}

.zt-input--small .zt-input__control {
  min-height: 28px;
  padding: 3px 10px;
  font-size: 12px;
}

.zt-input--medium .zt-input__control {
  min-height: 34px;
  padding: 5px 12px;
  font-size: 14px;
}

.zt-input--large .zt-input__control {
  min-height: 40px;
  padding: 8px 14px;
  font-size: 15px;
}

.zt-input--small.zt-input--textarea .zt-input__control {
  min-height: 64px;
}

.zt-input--medium.zt-input--textarea .zt-input__control {
  min-height: 82px;
}

.zt-input--large.zt-input--textarea .zt-input__control {
  min-height: 96px;
}

.zt-input--textarea .zt-input__control {
  align-items: flex-start;
}

.zt-input--textarea .zt-input__prefix,
.zt-input--textarea .zt-input__suffix,
.zt-input--textarea .zt-input__clear {
  margin-top: 2px;
}

.zt-input__prefix,
.zt-input__suffix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--text-secondary);
}

.zt-input__prefix {
  margin-right: 8px;
}

.zt-input__suffix {
  margin-left: 8px;
}

.zt-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-left: 8px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.zt-input__clear:hover {
  background: var(--hover-bg);
  color: var(--primary-color);
}

.zt-input__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 18px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.zt-input__message {
  flex: 1;
  min-width: 0;
}

.zt-input__word-limit {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--text-secondary);
}

.zt-input.is-success .zt-input__message {
  color: var(--success-color);
}

.zt-input.is-warning .zt-input__message {
  color: var(--warning-color);
}

.zt-input.is-error .zt-input__message {
  color: var(--danger-color);
}
</style>
