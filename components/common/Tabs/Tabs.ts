import type { CSSProperties, InjectionKey, Ref, VNodeChild } from 'vue'

export type TabsValueType = string | number
export type TabsType = 'bar' | 'line' | 'card' | 'segment'
export type TabsSize = 'small' | 'medium' | 'large'
export type TabsPlacement = 'top' | 'bottom' | 'left' | 'right'
export type TabsTrigger = 'click' | 'hover'
export type TabsJustifyContent =
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'start'
  | 'center'
  | 'end'
export type TabPaneDisplayDirective = 'if' | 'show' | 'show:lazy'
export type TabsAddable = boolean | { disabled?: boolean }

export type TabsBeforeLeave = (
  name: TabsValueType,
  oldName: TabsValueType | null
) => boolean | Promise<boolean>

export interface TabsProps {
  value?: TabsValueType
  defaultValue?: TabsValueType
  type?: TabsType
  size?: TabsSize
  placement?: TabsPlacement
  trigger?: TabsTrigger
  animated?: boolean
  addable?: TabsAddable
  closable?: boolean
  barWidth?: number
  tabsPadding?: number
  justifyContent?: TabsJustifyContent
  paneClass?: string
  paneStyle?: string | CSSProperties
  paneWrapperClass?: string
  paneWrapperStyle?: string | CSSProperties
  tabClass?: string
  tabStyle?: string | CSSProperties
  addTabClass?: string
  addTabStyle?: string | CSSProperties
  onBeforeLeave?: TabsBeforeLeave
}

export interface TabsEmits {
  (e: 'update:value', value: TabsValueType): void
  (e: 'add'): void
  (e: 'close', name: TabsValueType): void
}

export interface TabPaneProps {
  name: TabsValueType
  tab?: string | (() => VNodeChild)
  disabled?: boolean
  closable?: boolean
  displayDirective?: TabPaneDisplayDirective
  tabProps?: Record<string, unknown>
}

export interface TabProps {
  name: TabsValueType
  disabled?: boolean
  closable?: boolean
}

export interface TabsContext {
  mergedValue: Readonly<Ref<TabsValueType | null>>
  type: Readonly<Ref<TabsType>>
  size: Readonly<Ref<TabsSize>>
  trigger: Readonly<Ref<TabsTrigger>>
  closable: Readonly<Ref<boolean>>
  selectTab: (name: TabsValueType) => void
  closeTab: (name: TabsValueType) => void
}

export const tabsInjectionKey: InjectionKey<TabsContext> = Symbol('z-tabs-context')
