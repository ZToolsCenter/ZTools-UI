import type { PopoverTeleportTarget } from '../Popover'

export type ContextMenuPlacement = 'right-start' | 'left-start'

export interface ContextMenuBaseItem {
  key?: string
  icon?: string
  disabled?: boolean
  danger?: boolean
}

export interface ContextMenuActionItem extends ContextMenuBaseItem {
  type?: 'item'
  key: string
  label: string
  shortcut?: string
}

export interface ContextMenuSeparatorItem {
  type: 'separator'
  key?: string
}

export interface ContextMenuSubmenuItem extends ContextMenuBaseItem {
  type: 'submenu'
  key: string
  label: string
  children: ContextMenuItem[]
}

export type ContextMenuItem = ContextMenuActionItem | ContextMenuSeparatorItem | ContextMenuSubmenuItem

export interface ContextMenuProps {
  menuItems: ContextMenuItem[]
  show?: boolean
  defaultShow?: boolean
  x?: number
  y?: number
  disabled?: boolean
  to?: PopoverTeleportTarget
  zIndex?: number
}

export interface ContextMenuEmits {
  (e: 'update:show', value: boolean): void
  (e: 'visible-change', value: boolean): void
  (e: 'select', key: string): void
  (e: 'clickoutside', event: PointerEvent): void
}
