import type { VNodeChild } from 'vue'

export type PaginationSize = 'small' | 'medium' | 'large'

export interface PaginationInfo {
  page: number
  pageSize: number
  pageCount: number
  itemCount: number
  startIndex: number
  endIndex: number
}

export interface PaginationSizeOption {
  label: string
  value: number
}

export interface PaginationRenderLabel {
  (info: PaginationInfo & {
    type: 'page' | 'prev' | 'next' | 'ellipsis'
    value?: number
  }): VNodeChild
}

export interface PaginationProps {
  page?: number
  defaultPage?: number
  pageSize?: number
  defaultPageSize?: number
  pageCount?: number
  itemCount?: number
  pageSizes?: Array<number | PaginationSizeOption>
  pageSlot?: number
  showSizePicker?: boolean
  showQuickJumper?: boolean
  showQuickJumpDropdown?: boolean
  displayOrder?: Array<'pages' | 'size-picker' | 'quick-jumper'>
  size?: PaginationSize
  simple?: boolean
  disabled?: boolean
  prefix?: (info: PaginationInfo) => VNodeChild
  suffix?: (info: PaginationInfo) => VNodeChild
  goto?: (info: PaginationInfo) => VNodeChild
  next?: (info: PaginationInfo) => VNodeChild
  prev?: (info: PaginationInfo) => VNodeChild
  label?: PaginationRenderLabel
  selectProps?: Record<string, any>
  scrollbarProps?: Record<string, any>
  to?: string | HTMLElement | false
}

export interface PaginationEmits {
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}
