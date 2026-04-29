import type { PopoverPlacement } from '../Popover'

export type ColorPickerSize = 'small' | 'medium' | 'large'
export type ColorPickerPlacement = PopoverPlacement

export interface ColorPickerProps {
  modelValue: string
  disabled?: boolean
  showInput?: boolean
  showAlpha?: boolean
  placeholder?: string
  size?: ColorPickerSize
  placement?: ColorPickerPlacement
  autoAdjustPlacement?: boolean
}

export interface ColorPickerEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
