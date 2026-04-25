export type SelectValueType = string | number
export type SelectModelValue = SelectValueType | SelectValueType[]
export type SelectSize = 'small' | 'medium' | 'large'
export type SelectStatus = 'success' | 'warning' | 'error'
export type SelectMode = 'default' | 'tags'

export interface SelectOption {
  label: string
  value: SelectValueType
  disabled?: boolean
}

export interface SelectProps {
  modelValue: SelectModelValue
  options: SelectOption[]
  placeholder?: string
  multiple?: boolean
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: SelectSize
  status?: SelectStatus
  message?: string
  maxTagCount?: number
  mode?: SelectMode
}

export interface SelectEmits {
  (e: 'update:modelValue', value: SelectModelValue): void
  (e: 'change', value: SelectModelValue): void
  (e: 'clear'): void
  (e: 'scroll', event: Event): void
  (e: 'visible-change', visible: boolean): void
  (e: 'tag-create', value: string): void
  (e: 'tag-remove', value: SelectValueType): void
}
