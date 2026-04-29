import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { CSSProperties, ComputedRef, Ref } from 'vue'
import type { PopoverPlacement, PopoverWidth } from '../Popover'

type OverlaySide = 'top' | 'right' | 'bottom' | 'left'
type OverlayAlign = 'start' | 'center' | 'end'
type ElementRef = Readonly<Ref<HTMLElement | null | undefined>> | ComputedRef<HTMLElement | null | undefined>
type ValueRef<T> = Readonly<Ref<T>> | ComputedRef<T>

interface PlacementParts {
  side: OverlaySide
  align: OverlayAlign
}

interface OverlayPositionedContext {
  placement: PopoverPlacement
  panelRect: DOMRect
  triggerRect: DOMRect | null
}

interface UseOverlayPositionOptions {
  visible: ValueRef<boolean>
  triggerRef: ElementRef
  panelRef: ElementRef
  placement: ValueRef<PopoverPlacement>
  anchorRef?: ElementRef
  autoAdjustPlacement?: ValueRef<boolean | undefined>
  overlap?: ValueRef<boolean | undefined>
  showArrow?: ValueRef<boolean | undefined>
  width?: ValueRef<PopoverWidth | undefined>
  x?: ValueRef<number | undefined>
  y?: ValueRef<number | undefined>
  zIndex?: ValueRef<number | undefined>
  gap?: number
  viewportPadding?: number
  onPositioned?: (context: OverlayPositionedContext) => void
}

const DEFAULT_PANEL_GAP = 8
const DEFAULT_VIEWPORT_PADDING = 8
const DEFAULT_ARROW_SIZE = 10
const DEFAULT_Z_INDEX = 10000
const ARROW_HALF = DEFAULT_ARROW_SIZE / 2

export function parsePlacement(placement: PopoverPlacement): PlacementParts {
  const [side, align] = placement.split('-') as [OverlaySide, OverlayAlign | undefined]

  return {
    side,
    align: align ?? 'center'
  }
}

export function createPlacement(side: OverlaySide, align: OverlayAlign): PopoverPlacement {
  return (align === 'center' ? side : `${side}-${align}`) as PopoverPlacement
}

export function flipSide(side: OverlaySide): OverlaySide {
  if (side === 'top') return 'bottom'
  if (side === 'bottom') return 'top'
  if (side === 'left') return 'right'
  return 'left'
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function createHiddenPanelStyle(zIndex: number): CSSProperties {
  return {
    position: 'fixed',
    left: '0px',
    top: '0px',
    zIndex,
    visibility: 'hidden'
  }
}

function getPanelGap(options: UseOverlayPositionOptions): number {
  if (options.overlap?.value) {
    return 0
  }

  const baseGap = options.gap ?? DEFAULT_PANEL_GAP
  return baseGap + (options.showArrow?.value ? ARROW_HALF : 0)
}

export function getPlacementPosition(
  placement: PopoverPlacement,
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight: number,
  gap: number
): { left: number; top: number } {
  const { side, align } = parsePlacement(placement)

  if (side === 'top' || side === 'bottom') {
    const top = side === 'top' ? triggerRect.top - gap - panelHeight : triggerRect.bottom + gap
    let left = triggerRect.left

    if (align === 'center') {
      left = triggerRect.left + (triggerRect.width - panelWidth) / 2
    } else if (align === 'end') {
      left = triggerRect.right - panelWidth
    }

    return { left, top }
  }

  const left = side === 'left' ? triggerRect.left - gap - panelWidth : triggerRect.right + gap
  let top = triggerRect.top

  if (align === 'center') {
    top = triggerRect.top + (triggerRect.height - panelHeight) / 2
  } else if (align === 'end') {
    top = triggerRect.bottom - panelHeight
  }

  return { left, top }
}

export function resolveAutoAdjustedPlacement(
  placement: PopoverPlacement,
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  gap: number,
  viewportPadding: number
): PopoverPlacement {
  let nextPlacement = placement
  const initial = parsePlacement(nextPlacement)

  if (initial.side === 'top' || initial.side === 'bottom') {
    const availableTop = triggerRect.top - gap - viewportPadding
    const availableBottom = viewportHeight - triggerRect.bottom - gap - viewportPadding
    const shouldFlipToBottom = initial.side === 'top' && panelHeight > availableTop && availableBottom > availableTop
    const shouldFlipToTop = initial.side === 'bottom' && panelHeight > availableBottom && availableTop > availableBottom

    if (shouldFlipToBottom || shouldFlipToTop) {
      nextPlacement = createPlacement(flipSide(initial.side), initial.align)
    }

    const position = getPlacementPosition(nextPlacement, triggerRect, panelWidth, panelHeight, gap)
    const resolved = parsePlacement(nextPlacement)
    const minLeft = viewportPadding
    const maxRight = viewportWidth - viewportPadding

    if (position.left + panelWidth > maxRight && resolved.align !== 'end') {
      nextPlacement = createPlacement(resolved.side, 'end')
    } else if (position.left < minLeft && resolved.align !== 'start') {
      nextPlacement = createPlacement(resolved.side, 'start')
    }

    return nextPlacement
  }

  const availableLeft = triggerRect.left - gap - viewportPadding
  const availableRight = viewportWidth - triggerRect.right - gap - viewportPadding
  const shouldFlipToRight = initial.side === 'left' && panelWidth > availableLeft && availableRight > availableLeft
  const shouldFlipToLeft = initial.side === 'right' && panelWidth > availableRight && availableLeft > availableRight

  if (shouldFlipToRight || shouldFlipToLeft) {
    nextPlacement = createPlacement(flipSide(initial.side), initial.align)
  }

  const position = getPlacementPosition(nextPlacement, triggerRect, panelWidth, panelHeight, gap)
  const resolved = parsePlacement(nextPlacement)
  const minTop = viewportPadding
  const maxBottom = viewportHeight - viewportPadding

  if (position.top + panelHeight > maxBottom && resolved.align !== 'end') {
    nextPlacement = createPlacement(resolved.side, 'end')
  } else if (position.top < minTop && resolved.align !== 'start') {
    nextPlacement = createPlacement(resolved.side, 'start')
  }

  return nextPlacement
}

function applyPanelWidth(panel: HTMLElement, width: PopoverWidth | undefined, triggerRect: DOMRect | null): string | undefined {
  if (width === 'trigger' && triggerRect) {
    const nextWidth = `${triggerRect.width}px`
    panel.style.width = nextWidth
    return nextWidth
  }

  if (typeof width === 'number') {
    const nextWidth = `${width}px`
    panel.style.width = nextWidth
    return nextWidth
  }

  panel.style.width = ''
  return undefined
}

export function useOverlayPosition(options: UseOverlayPositionOptions) {
  const resolvedPlacement = ref<PopoverPlacement>(options.placement.value)
  const panelReady = ref(false)
  const panelStyle = ref<CSSProperties>(createHiddenPanelStyle(options.zIndex?.value ?? DEFAULT_Z_INDEX))
  let panelPositionFrame = 0

  function getTriggerElement(): HTMLElement | null {
    return options.triggerRef.value ?? null
  }

  function getAnchorElement(): HTMLElement | null {
    return options.anchorRef?.value ?? getTriggerElement()
  }

  function containsTarget(target: EventTarget | null): boolean {
    const node = target as Node | null
    const trigger = getTriggerElement()
    const panel = options.panelRef.value ?? null

    return !!node && (trigger?.contains(node) || panel?.contains(node) || false)
  }

  function updatePosition(): void {
    const panel = options.panelRef.value

    if (!panel) {
      return
    }

    const triggerRect = getAnchorElement()?.getBoundingClientRect() ?? null
    const appliedWidth = applyPanelWidth(panel, options.width?.value, triggerRect)
    const panelRect = panel.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const panelWidth = panelRect.width
    const panelHeight = panelRect.height
    const viewportPadding = options.viewportPadding ?? DEFAULT_VIEWPORT_PADDING
    const gap = getPanelGap(options)
    const zIndex = options.zIndex?.value ?? DEFAULT_Z_INDEX
    let nextPlacement = options.placement.value
    let left = viewportPadding
    let top = viewportPadding

    if (typeof options.x?.value === 'number' && typeof options.y?.value === 'number') {
      left = clamp(options.x.value, viewportPadding, Math.max(viewportPadding, viewportWidth - panelWidth - viewportPadding))
      top = clamp(options.y.value, viewportPadding, Math.max(viewportPadding, viewportHeight - panelHeight - viewportPadding))
    } else if (triggerRect) {
      if (options.autoAdjustPlacement?.value !== false) {
        nextPlacement = resolveAutoAdjustedPlacement(
          options.placement.value,
          triggerRect,
          panelWidth,
          panelHeight,
          viewportWidth,
          viewportHeight,
          gap,
          viewportPadding
        )
      }

      const position = getPlacementPosition(nextPlacement, triggerRect, panelWidth, panelHeight, gap)
      left = clamp(position.left, viewportPadding, Math.max(viewportPadding, viewportWidth - panelWidth - viewportPadding))
      top = clamp(position.top, viewportPadding, Math.max(viewportPadding, viewportHeight - panelHeight - viewportPadding))
    }

    resolvedPlacement.value = nextPlacement
    panelReady.value = true

    panel.style.position = 'fixed'
    panel.style.left = `${left}px`
    panel.style.top = `${top}px`
    panel.style.zIndex = String(zIndex)
    panel.style.visibility = 'visible'

    if (appliedWidth === undefined) {
      panel.style.removeProperty('width')
    }

    panelStyle.value = {
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      zIndex,
      visibility: 'visible',
      width: appliedWidth
    }

    options.onPositioned?.({
      placement: nextPlacement,
      panelRect: panel.getBoundingClientRect(),
      triggerRect
    })
  }

  function scheduleUpdate(): void {
    if (!options.visible.value || panelPositionFrame) {
      return
    }

    panelPositionFrame = window.requestAnimationFrame(() => {
      panelPositionFrame = 0
      updatePosition()
    })
  }

  function cancelUpdate(): void {
    if (!panelPositionFrame) {
      return
    }

    window.cancelAnimationFrame(panelPositionFrame)
    panelPositionFrame = 0
  }

  function addListeners(): void {
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, true)
  }

  function removeListeners(): void {
    window.removeEventListener('resize', scheduleUpdate)
    window.removeEventListener('scroll', scheduleUpdate, true)
  }

  watch(
    options.visible,
    async (visible) => {
      if (!visible) {
        panelReady.value = false
        removeListeners()
        cancelUpdate()
        return
      }

      resolvedPlacement.value = options.placement.value
      panelReady.value = false
      panelStyle.value = createHiddenPanelStyle(options.zIndex?.value ?? DEFAULT_Z_INDEX)
      addListeners()
      await nextTick()
      updatePosition()
    },
    { immediate: true }
  )

  watch(
    () => [
      options.placement.value,
      options.autoAdjustPlacement?.value ?? true,
      options.overlap?.value ?? false,
      options.width?.value,
      options.x?.value,
      options.y?.value,
      options.zIndex?.value,
      options.showArrow?.value ?? false
    ] as const,
    () => {
      if (options.visible.value) {
        scheduleUpdate()
      }
    }
  )

  onBeforeUnmount(() => {
    removeListeners()
    cancelUpdate()
  })

  return {
    resolvedPlacement,
    panelReady,
    panelStyle,
    containsTarget,
    updatePosition,
    scheduleUpdate,
    cancelUpdate
  }
}
