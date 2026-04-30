export type PopoverTrigger = 'hover' | 'click' | 'focus' | 'manual'
export type PopoverPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end'

export type PopoverWidth = number | 'trigger'
export type PopoverTeleportTarget = string | HTMLElement | false
export type PopoverSegmentStyle = string | Record<string, string | number>

export interface PopoverProps {
  trigger?: PopoverTrigger
  show?: boolean
  defaultShow?: boolean
  placement?: PopoverPlacement
  overlap?: boolean
  raw?: boolean
  scrollable?: boolean
  showArrow?: boolean
  to?: PopoverTeleportTarget
  width?: PopoverWidth
  x?: number
  y?: number
  zIndex?: number
  keepAliveOnHover?: boolean
  headerClass?: string
  headerStyle?: PopoverSegmentStyle
  footerClass?: string
  footerStyle?: PopoverSegmentStyle
}

export interface PopoverEmits {
  (e: 'update:show', value: boolean): void
  (e: 'clickoutside', event: PointerEvent): void
}
