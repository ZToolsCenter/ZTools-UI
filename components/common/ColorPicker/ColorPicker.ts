import type { PopoverPlacement } from '../Popover'

export type ColorPickerSize = 'small' | 'medium' | 'large'
export type ColorPickerPlacement = PopoverPlacement

export interface ColorPickerProps {
  modelValue?: string
  defaultModelValue?: string
  disabled?: boolean
  showInput?: boolean
  showAlpha?: boolean
  placeholder?: string
  show?: boolean
  defaultShow?: boolean
  size?: ColorPickerSize
  placement?: ColorPickerPlacement
  autoAdjustPlacement?: boolean
}

export interface ColorPickerEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'update:show', value: boolean): void
}
