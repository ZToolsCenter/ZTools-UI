export type DropdownValueType = string | number
export type DropdownModelValue = DropdownValueType | DropdownValueType[]
export type DropdownSize = 'small' | 'medium' | 'large'
export type DropdownStatus = 'success' | 'warning' | 'error'
export type DropdownMode = 'default' | 'tags'

export interface DropdownOption {
  label: string
  value: DropdownValueType
  disabled?: boolean
}

export interface DropdownProps {
  modelValue: DropdownModelValue
  options: DropdownOption[]
  placeholder?: string
  multiple?: boolean
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: DropdownSize
  status?: DropdownStatus
  message?: string
  maxTagCount?: number
  mode?: DropdownMode
}

export interface DropdownEmits {
  (e: 'update:modelValue', value: DropdownModelValue): void
  (e: 'change', value: DropdownModelValue): void
  (e: 'clear'): void
  (e: 'scroll', event: Event): void
  (e: 'visible-change', visible: boolean): void
  (e: 'tag-create', value: string): void
  (e: 'tag-remove', value: DropdownValueType): void
}
