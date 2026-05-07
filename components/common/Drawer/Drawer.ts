import type { CSSProperties, InjectionKey } from 'vue'

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left'
export type DrawerDisplayDirective = 'if' | 'show'
export type DrawerTeleportTarget = string | HTMLElement | false
export type DrawerSize = number | string
export type DrawerStyle = string | CSSProperties
export type DrawerShowMask = boolean | 'transparent'
export type DrawerScrollbarProps = Record<string, unknown>

export interface DrawerProps {
  show?: boolean
  defaultShow?: boolean
  placement?: DrawerPlacement
  width?: DrawerSize
  height?: DrawerSize
  defaultWidth?: DrawerSize
  defaultHeight?: DrawerSize
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  resizable?: boolean
  to?: DrawerTeleportTarget
  zIndex?: number
  showMask?: DrawerShowMask
  maskClosable?: boolean
  closeOnEsc?: boolean
  blockScroll?: boolean
  autoFocus?: boolean
  trapFocus?: boolean
  displayDirective?: DrawerDisplayDirective
  contentClass?: string
  contentStyle?: DrawerStyle
  nativeScrollbar?: boolean
  scrollbarProps?: DrawerScrollbarProps
}

export interface DrawerEmits {
  (e: 'update:show', value: boolean): void
  (e: 'update:width', value: number): void
  (e: 'update:height', value: number): void
  (e: 'after-enter'): void
  (e: 'after-leave'): void
  (e: 'mask-click', event: MouseEvent): void
  (e: 'esc'): void
}

export interface DrawerContentProps {
  title?: string
  closable?: boolean
  headerClass?: string
  headerStyle?: DrawerStyle
  footerClass?: string
  footerStyle?: DrawerStyle
  bodyClass?: string
  bodyStyle?: DrawerStyle
  bodyContentClass?: string
  bodyContentStyle?: DrawerStyle
  nativeScrollbar?: boolean
  scrollbarProps?: DrawerScrollbarProps
}

export interface DrawerContext {
  close: () => void
}

export const drawerInjectionKey: InjectionKey<DrawerContext> = Symbol('z-drawer-context')
