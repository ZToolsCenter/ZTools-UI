<script setup lang="ts">
import {
  computed,
  Fragment,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch
} from 'vue'
import type { CSSProperties, VNode, VNodeChild } from 'vue'
import type {
  TabPaneProps,
  TabProps,
  TabsEmits,
  TabsProps,
  TabsValueType
} from './Tabs'

defineOptions({ name: 'ZTabs' })

const props = withDefaults(defineProps<TabsProps>(), {
  value: undefined,
  defaultValue: undefined,
  type: 'bar',
  size: 'medium',
  placement: 'top',
  trigger: 'click',
  animated: false,
  closable: false,
  barWidth: undefined,
  tabsPadding: 0,
  justifyContent: undefined,
  paneClass: undefined,
  paneStyle: undefined,
  paneWrapperClass: undefined,
  paneWrapperStyle: undefined,
  tabClass: undefined,
  tabStyle: undefined,
  addTabClass: undefined,
  addTabStyle: undefined,
  onBeforeLeave: undefined
})

const emit = defineEmits<TabsEmits>()

const slots = defineSlots<{
  default?: () => VNodeChild
  prefix?: () => VNodeChild
  suffix?: () => VNodeChild
}>()

void slots

const runtimeSlots = useSlots()

interface PaneEntry {
  kind: 'pane' | 'tab'
  name: TabsValueType
  tab?: string | (() => VNodeChild)
  disabled: boolean
  closable?: boolean
  displayDirective: 'if' | 'show' | 'show:lazy'
  tabProps?: Record<string, unknown>
  vnode: VNode
}

function flattenVNodes(children: VNodeChild | undefined | null): VNode[] {
  const result: VNode[] = []

  if (children == null || children === false || children === true) {
    return result
  }

  if (Array.isArray(children)) {
    for (const child of children) {
      result.push(...flattenVNodes(child as VNodeChild))
    }
    return result
  }

  const vnode = children as VNode

  if (typeof vnode !== 'object' || vnode === null) {
    return result
  }

  if (vnode.type === Fragment) {
    return flattenVNodes(vnode.children as VNodeChild)
  }

  result.push(vnode)
  return result
}

function getComponentName(vnode: VNode): string | undefined {
  const type = vnode.type as { name?: string; __name?: string } | undefined

  if (!type || typeof type === 'string') {
    return undefined
  }

  return type.name ?? type.__name
}

/**
 * 模板里 `<ZTabPane disabled>` 的简写在 vnode.props 中是空字符串 ""，
 * !!"" 为 false 会让禁用判断失效。这里做一次显式的布尔强转：
 *  - 缺省 / null / false / 0 / "false" => false
 *  - 其它（含 true / "" / "true" / 任意字符串）=> true
 */
function coerceBoolean(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (value === false || value === 0 || value === 'false') return false
  return true
}

const panes = computed<PaneEntry[]>(() => {
  const defaultSlot = runtimeSlots.default?.()
  const vnodes = flattenVNodes(defaultSlot as VNodeChild)
  const list: PaneEntry[] = []

  for (const vnode of vnodes) {
    const name = getComponentName(vnode)

    if (name !== 'ZTabPane' && name !== 'ZTab') {
      continue
    }

    const vnodeProps = (vnode.props ?? {}) as TabPaneProps & TabProps & { name: TabsValueType }

    if (vnodeProps.name === undefined || vnodeProps.name === null) {
      continue
    }

    list.push({
      kind: name === 'ZTabPane' ? 'pane' : 'tab',
      name: vnodeProps.name,
      tab: (vnodeProps as TabPaneProps).tab,
      disabled: coerceBoolean(vnodeProps.disabled),
      closable:
        vnodeProps.closable === undefined ? undefined : coerceBoolean(vnodeProps.closable),
      displayDirective: (vnodeProps as TabPaneProps).displayDirective ?? 'if',
      tabProps: (vnodeProps as TabPaneProps).tabProps,
      vnode
    })
  }

  return list
})

const firstPaneName = computed<TabsValueType | null>(() => panes.value[0]?.name ?? null)

const uncontrolledValue = ref<TabsValueType | null>(
  props.value !== undefined
    ? props.value
    : props.defaultValue !== undefined
      ? props.defaultValue
      : null
)

watch(
  () => props.value,
  (val) => {
    if (val !== undefined) {
      uncontrolledValue.value = val
    }
  }
)

watch(panes, (next) => {
  if (props.value !== undefined) return
  const current = uncontrolledValue.value

  if (current === null && next.length > 0) {
    uncontrolledValue.value = next[0].name
    return
  }

  if (current !== null && !next.some((p) => p.name === current)) {
    uncontrolledValue.value = next[0]?.name ?? null
  }
})

const mergedValue = computed<TabsValueType | null>(() => {
  if (props.value !== undefined) return props.value
  if (uncontrolledValue.value !== null) return uncontrolledValue.value
  return firstPaneName.value
})

async function selectTab(name: TabsValueType): Promise<void> {
  const oldName = mergedValue.value
  if (name === oldName) return

  const target = panes.value.find((p) => p.name === name)
  if (!target || target.disabled) return

  if (props.onBeforeLeave) {
    try {
      const result = await props.onBeforeLeave(name, oldName)
      if (result === false) return
    } catch {
      return
    }
  }

  if (props.value === undefined) {
    uncontrolledValue.value = name
  }

  // Track lazy-shown panes
  if (target.displayDirective === 'show:lazy') {
    lazyShownNames.value.add(name)
  }

  emit('update:value', name)
}

function closeTab(name: TabsValueType): void {
  emit('close', name)
}

function handleAdd(): void {
  if (addableDisabled.value) return
  emit('add')
}

const hoverTimer = ref<number | null>(null)

function clearHoverTimer(): void {
  if (hoverTimer.value !== null) {
    window.clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
}

function handleTabClick(pane: PaneEntry): void {
  if (pane.disabled) return
  if (props.trigger === 'click') {
    void selectTab(pane.name)
  }
}

function handleTabMouseEnter(pane: PaneEntry): void {
  if (props.trigger !== 'hover') return
  if (pane.disabled) return
  clearHoverTimer()
  hoverTimer.value = window.setTimeout(() => {
    void selectTab(pane.name)
  }, 100)
}

function handleTabMouseLeave(): void {
  if (props.trigger !== 'hover') return
  clearHoverTimer()
}

const lazyShownNames = ref<Set<TabsValueType>>(new Set())

watch(
  mergedValue,
  (val) => {
    if (val === null) return
    const target = panes.value.find((p) => p.name === val)
    if (target?.displayDirective === 'show:lazy') {
      lazyShownNames.value.add(val)
    }
  },
  { immediate: true }
)

const isVertical = computed(
  () => props.placement === 'left' || props.placement === 'right'
)

const addableDisabled = computed(() => {
  if (typeof props.addable === 'object' && props.addable !== null) {
    return !!props.addable.disabled
  }
  return false
})

const showAddTab = computed(() => {
  if (props.type !== 'card') return false
  if (typeof props.addable === 'object' && props.addable !== null) return true
  return !!props.addable
})

const showBar = computed(() => props.type === 'bar' || props.type === 'line')

const showSegmentIndicator = computed(() => props.type === 'segment')

const tabsClasses = computed(() => [
  'z-tabs',
  `tabs--${props.size}`,
  `tabs--${props.type}`,
  `tabs--${props.placement}`,
  {
    'is-vertical': isVertical.value,
    'is-animated': props.animated && !isVertical.value
  }
])

const navStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (props.tabsPadding) {
    if (isVertical.value) {
      style.paddingTop = `${props.tabsPadding}px`
      style.paddingBottom = `${props.tabsPadding}px`
    } else {
      style.paddingLeft = `${props.tabsPadding}px`
      style.paddingRight = `${props.tabsPadding}px`
    }
  }
  if (props.justifyContent && (props.type === 'line' || props.type === 'bar')) {
    style.justifyContent = props.justifyContent
  }
  return style
})

const navRef = ref<HTMLElement | null>(null)
const navListRef = ref<HTMLElement | null>(null)
const tabRefs = ref<Map<TabsValueType, HTMLElement>>(new Map())

function setTabRef(name: TabsValueType, el: HTMLElement | null): void {
  if (el) {
    tabRefs.value.set(name, el)
  } else {
    tabRefs.value.delete(name)
  }
}

const barStyle = ref<CSSProperties>({})
const segmentStyle = ref<CSSProperties>({})

function syncBarPosition(): void {
  if (!showBar.value) return

  // bar 的定位容器是 .tabs-nav__list（position: relative），
  // 必须以 navList 为基准计算 offset，否则在加了 prefix/suffix 后会整体偏移。
  const navList = navListRef.value
  const value = mergedValue.value
  if (!navList || value === null) {
    barStyle.value = { opacity: 0 }
    return
  }

  const tabEl = tabRefs.value.get(value)
  if (!tabEl) {
    barStyle.value = { opacity: 0 }
    return
  }

  const navRect = navList.getBoundingClientRect()
  const tabRect = tabEl.getBoundingClientRect()

  if (isVertical.value) {
    const top = tabRect.top - navRect.top + navList.scrollTop
    const height = tabRect.height
    barStyle.value = {
      top: `${top}px`,
      height: `${height}px`,
      opacity: 1
    }
  } else if (props.type === 'bar') {
    // bar 类型：宽度跟随文字宽度（取 .tabs-tab__label 宽度）
    const label = tabEl.querySelector<HTMLElement>('.tabs-tab__label')
    const labelRect = label?.getBoundingClientRect() ?? tabRect
    const left =
      typeof props.barWidth === 'number'
        ? labelRect.left - navRect.left + navList.scrollLeft + (labelRect.width - props.barWidth) / 2
        : labelRect.left - navRect.left + navList.scrollLeft
    const width = typeof props.barWidth === 'number' ? props.barWidth : labelRect.width

    barStyle.value = {
      left: `${left}px`,
      width: `${width}px`,
      opacity: 1
    }
  } else {
    // line 类型：宽度等于整个 tab 宽度
    const left = tabRect.left - navRect.left + navList.scrollLeft
    barStyle.value = {
      left: `${left}px`,
      width: `${tabRect.width}px`,
      opacity: 1
    }
  }
}

let resizeObserver: ResizeObserver | null = null

function syncSegmentPosition(): void {
  if (!showSegmentIndicator.value) return

  // 与 bar 同样以 .tabs-nav__list 作为定位基准
  const navList = navListRef.value
  const value = mergedValue.value
  if (!navList || value === null) {
    segmentStyle.value = { opacity: 0 }
    return
  }

  const tabEl = tabRefs.value.get(value)
  if (!tabEl) {
    segmentStyle.value = { opacity: 0 }
    return
  }

  const navRect = navList.getBoundingClientRect()
  const tabRect = tabEl.getBoundingClientRect()

  // segment 在 navList 上有 1px 边框，position:absolute 是相对 padding edge，
  // 而 getBoundingClientRect 拿到的是 border edge，需要减去 border 宽度做补偿，
  // 否则指示器会有 1px 偏移
  const borderLeft = navList.clientLeft
  const borderTop = navList.clientTop

  segmentStyle.value = {
    left: `${tabRect.left - navRect.left - borderLeft + navList.scrollLeft}px`,
    top: `${tabRect.top - navRect.top - borderTop + navList.scrollTop}px`,
    width: `${tabRect.width}px`,
    height: `${tabRect.height}px`,
    opacity: 1
  }
}

function scheduleSyncBar(): void {
  nextTick(() => {
    syncBarPosition()
    syncSegmentPosition()
  })
}

watch(
  [mergedValue, () => props.type, () => props.placement, () => props.barWidth, () => props.size],
  () => {
    scheduleSyncBar()
  },
  { flush: 'post' }
)

watch(panes, () => {
  scheduleSyncBar()
})

onMounted(() => {
  scheduleSyncBar()

  const observed = navListRef.value ?? navRef.value
  if (typeof ResizeObserver !== 'undefined' && observed) {
    resizeObserver = new ResizeObserver(() => {
      scheduleSyncBar()
    })
    resizeObserver.observe(observed)
    if (navRef.value && navRef.value !== observed) {
      resizeObserver.observe(navRef.value)
    }
  } else {
    window.addEventListener('resize', scheduleSyncBar)
  }
})

onBeforeUnmount(() => {
  clearHoverTimer()
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  window.removeEventListener('resize', scheduleSyncBar)
})

defineExpose({
  syncBarPosition,
  syncSegmentPosition
})

const TabLabel = (entry: PaneEntry): VNodeChild => {
  // 1. Slot named "tab" on the pane
  const vnodeChildren = entry.vnode.children as
    | { tab?: () => VNodeChild; default?: () => VNodeChild }
    | null
    | VNodeChild

  if (vnodeChildren && typeof vnodeChildren === 'object' && !Array.isArray(vnodeChildren)) {
    const tabSlot = (vnodeChildren as { tab?: () => VNodeChild }).tab
    if (typeof tabSlot === 'function') {
      return tabSlot()
    }
  }

  // 2. ZTab default slot
  if (entry.kind === 'tab' && vnodeChildren && typeof vnodeChildren === 'object' && !Array.isArray(vnodeChildren)) {
    const defaultSlot = (vnodeChildren as { default?: () => VNodeChild }).default
    if (typeof defaultSlot === 'function') {
      return defaultSlot()
    }
  }

  // 3. tab prop (string or render function)
  if (typeof entry.tab === 'function') {
    return entry.tab()
  }

  if (entry.tab !== undefined && entry.tab !== null) {
    return String(entry.tab)
  }

  // 4. Fallback: name
  return String(entry.name)
}

const TabLabelComponent = (props: { entry: PaneEntry }) => h('span', { class: 'tabs-tab__label' }, [TabLabel(props.entry)])
TabLabelComponent.props = ['entry']

function renderPaneContent(entry: PaneEntry): VNodeChild {
  const vnodeChildren = entry.vnode.children as
    | { default?: () => VNodeChild }
    | VNodeChild

  if (vnodeChildren == null) return null

  if (typeof vnodeChildren === 'object' && !Array.isArray(vnodeChildren)) {
    const defaultSlot = (vnodeChildren as { default?: () => VNodeChild }).default
    if (typeof defaultSlot === 'function') {
      return defaultSlot()
    }
  }

  return vnodeChildren as VNodeChild
}

function isPaneClosable(entry: PaneEntry): boolean {
  if (props.type !== 'card') return false
  if (entry.closable !== undefined) return entry.closable
  return props.closable
}

function isPaneActive(entry: PaneEntry): boolean {
  return entry.name === mergedValue.value
}

function shouldRenderPane(entry: PaneEntry): boolean {
  if (entry.kind !== 'pane') return false

  switch (entry.displayDirective) {
    case 'show':
      return true
    case 'show:lazy':
      return lazyShownNames.value.has(entry.name) || isPaneActive(entry)
    case 'if':
    default:
      return isPaneActive(entry)
  }
}

function paneVisibleStyle(entry: PaneEntry): CSSProperties | undefined {
  if (entry.displayDirective === 'show' || entry.displayDirective === 'show:lazy') {
    return isPaneActive(entry) ? undefined : { display: 'none' }
  }
  return undefined
}
</script>

<template>
  <div :class="tabsClasses">
    <div
      ref="navRef"
      class="tabs-nav"
      :style="navStyle"
      role="tablist"
      :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
    >
      <div v-if="runtimeSlots.prefix" class="tabs-nav__prefix">
        <slot name="prefix" />
      </div>

      <div ref="navListRef" class="tabs-nav__list">
        <span
          v-if="showSegmentIndicator"
          class="tabs-segment-indicator"
          :style="segmentStyle"
          aria-hidden="true"
        />
        <button
          v-for="entry in panes"
          :key="String(entry.name)"
          :ref="(el) => setTabRef(entry.name, el as HTMLElement | null)"
          v-bind="entry.tabProps"
          type="button"
          role="tab"
          class="tabs-tab"
          :class="[
            tabClass,
            {
              active: isPaneActive(entry),
              'is-disabled': entry.disabled
            }
          ]"
          :style="tabStyle"
          :aria-selected="isPaneActive(entry)"
          :aria-disabled="entry.disabled ? 'true' : undefined"
          :tabindex="entry.disabled ? -1 : 0"
          :disabled="entry.disabled"
          @click="handleTabClick(entry)"
          @mouseenter="handleTabMouseEnter(entry)"
          @mouseleave="handleTabMouseLeave"
        >
          <TabLabelComponent :entry="entry" />
          <button
            v-if="isPaneClosable(entry) && !entry.disabled"
            type="button"
            class="tabs-tab__close"
            aria-label="关闭标签"
            @click.stop="closeTab(entry.name)"
          />
        </button>

        <button
          v-if="showAddTab"
          type="button"
          class="tabs-tab tabs-tab--add"
          :class="[addTabClass, { 'is-disabled': addableDisabled }]"
          :style="addTabStyle"
          :disabled="addableDisabled"
          aria-label="添加标签"
          @click="handleAdd"
        >
          +
        </button>

        <span v-if="showBar" class="tabs-bar" :style="barStyle" aria-hidden="true" />
      </div>

      <div v-if="runtimeSlots.suffix" class="tabs-nav__suffix">
        <slot name="suffix" />
      </div>
    </div>

    <div
      class="tabs-pane-wrapper"
      :class="paneWrapperClass"
      :style="paneWrapperStyle"
    >
      <template v-for="entry in panes" :key="String(entry.name)">
        <div
          v-if="entry.kind === 'pane' && shouldRenderPane(entry)"
          class="tabs-pane"
          :class="[paneClass, { 'is-active': isPaneActive(entry) }]"
          :style="[paneStyle as any, paneVisibleStyle(entry) as any]"
          role="tabpanel"
        >
          <component :is="{ render: () => renderPaneContent(entry) }" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.z-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: var(--text-color);
  font-size: 14px;
}

.z-tabs.is-vertical {
  flex-direction: row;
}

.z-tabs.tabs--bottom {
  flex-direction: column-reverse;
}

.z-tabs.tabs--right {
  flex-direction: row-reverse;
}

/* Nav container */
.tabs-nav {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0;
}

.z-tabs.is-vertical .tabs-nav {
  flex-direction: column;
  align-items: stretch;
}

.tabs-nav__prefix,
.tabs-nav__suffix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 8px;
  color: var(--text-secondary);
}

.tabs-nav__list {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  gap: 4px;
  min-width: 0;
}

.z-tabs.is-vertical .tabs-nav__list {
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

/* Tab item base */
.tabs-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font: inherit;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
  outline: none;
  white-space: nowrap;
  user-select: none;
}

.tabs-tab:hover:not(.is-disabled) {
  color: var(--text-color);
}

.tabs-tab.active {
  color: var(--primary-color);
}

.tabs-tab:focus-visible {
  box-shadow: 0 0 0 3px var(--primary-light-bg);
  border-radius: 4px;
}

.tabs-tab.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.tabs--small .tabs-tab {
  padding: 6px 12px;
  font-size: 12px;
}

.tabs--medium .tabs-tab {
  padding: 8px 16px;
  font-size: 14px;
}

.tabs--large .tabs-tab {
  padding: 10px 20px;
  font-size: 15px;
}

.tabs-tab__label {
  display: inline-flex;
  align-items: center;
}

.tabs-tab__close {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 2px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  opacity: 0.6;
  transition: background 0.2s, opacity 0.2s;
  flex-shrink: 0;
}

/* 用两条对角线绘制 × 比直接用 "×" 字符更稳定，且天然居中 */
.tabs-tab__close::before,
.tabs-tab__close::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 9px;
  height: 1.5px;
  background: currentColor;
  border-radius: 1px;
  transform-origin: center;
}

.tabs-tab__close::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.tabs-tab__close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.tabs-tab__close:hover {
  background: color-mix(in srgb, currentColor, transparent 80%);
  opacity: 1;
}

/* Add tab */
.tabs-tab--add {
  font-size: 18px;
  color: var(--text-secondary);
  border: 1px dashed var(--control-border);
  border-radius: 6px;
}

.tabs-tab--add:hover:not(.is-disabled) {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: var(--hover-bg);
}

/* Indicator bar (bar / line types) */
.tabs-bar {
  position: absolute;
  pointer-events: none;
  background: var(--primary-color);
  border-radius: 999px;
  transition: left 0.25s ease, top 0.25s ease, width 0.25s ease, height 0.25s ease, opacity 0.2s ease;
  opacity: 0;
}

.tabs--bar .tabs-bar {
  bottom: 0;
  height: 2px;
}

.tabs--bar.tabs--bottom .tabs-bar {
  bottom: auto;
  top: 0;
}

.tabs--line .tabs-bar {
  bottom: -1px;
  height: 2px;
  border-radius: 0;
}

.tabs--line.tabs--bottom .tabs-bar {
  bottom: auto;
  top: -1px;
}

.z-tabs.is-vertical .tabs-bar {
  width: 2px;
  height: auto;
}

.z-tabs.is-vertical.tabs--left .tabs-bar {
  right: 0;
  left: auto;
}

.z-tabs.is-vertical.tabs--right .tabs-bar {
  left: 0;
  right: auto;
}

/* Line type: divider */
.tabs--line .tabs-nav {
  border-bottom: 1px solid var(--divider-color);
}

.tabs--line.tabs--bottom .tabs-nav {
  border-bottom: none;
  border-top: 1px solid var(--divider-color);
}

.tabs--line.is-vertical .tabs-nav {
  border-bottom: none;
  border-right: 1px solid var(--divider-color);
}

.tabs--line.is-vertical.tabs--right .tabs-nav {
  border-right: none;
  border-left: 1px solid var(--divider-color);
}

/* Card type */
.tabs--card .tabs-nav__list {
  gap: 4px;
}

.tabs--card .tabs-tab {
  border: 1px solid var(--control-border);
  border-radius: 6px 6px 0 0;
  background: var(--control-bg);
}

.tabs--card .tabs-tab:hover:not(.is-disabled):not(.active) {
  background: var(--hover-bg);
}

.tabs--card .tabs-tab.active {
  background: var(--bg-color, #fff);
  border-color: var(--control-border);
  border-bottom-color: transparent;
  color: var(--primary-color);
}

.tabs--card .tabs-nav {
  border-bottom: 1px solid var(--control-border);
  align-items: flex-end;
  position: relative;
}

.tabs--card .tabs-tab {
  margin-bottom: -1px;
}

.tabs--card.tabs--bottom .tabs-tab {
  border-radius: 0 0 6px 6px;
  margin-bottom: 0;
  margin-top: -1px;
}

.tabs--card.tabs--bottom .tabs-tab.active {
  border-bottom-color: var(--control-border);
  border-top-color: transparent;
}

.tabs--card.tabs--bottom .tabs-nav {
  border-bottom: none;
  border-top: 1px solid var(--control-border);
}

.tabs--card.is-vertical .tabs-tab {
  border-radius: 6px 0 0 6px;
  margin-bottom: 0;
  margin-right: -1px;
}

.tabs--card.is-vertical .tabs-tab.active {
  border-bottom-color: var(--control-border);
  border-right-color: transparent;
}

.tabs--card.is-vertical .tabs-nav {
  border-bottom: none;
  border-right: 1px solid var(--control-border);
  align-items: stretch;
}

.tabs--card.is-vertical.tabs--right .tabs-tab {
  border-radius: 0 6px 6px 0;
  margin-right: 0;
  margin-left: -1px;
}

.tabs--card.is-vertical.tabs--right .tabs-tab.active {
  border-left-color: transparent;
  border-right-color: var(--control-border);
}

.tabs--card.is-vertical.tabs--right .tabs-nav {
  border-right: none;
  border-left: 1px solid var(--control-border);
}

/* Segment type */
.tabs--segment .tabs-nav__list {
  padding: 3px;
  gap: 0;
  background: var(--control-bg);
  border-radius: 8px;
  border: 1px solid var(--control-border);
}

.tabs--segment .tabs-tab {
  flex: 1;
  border-radius: 6px;
  padding: 6px 14px;
  color: var(--text-secondary);
  /* 让 tab 处于 indicator 之上 */
  position: relative;
  z-index: 1;
  background: transparent;
  transition: color 0.2s;
}

.tabs--segment .tabs-tab:hover:not(.is-disabled):not(.active) {
  color: var(--text-color);
  background: var(--hover-bg);
}

.tabs--segment .tabs-tab.active {
  /* 背景/边框/阴影都交给 .tabs-segment-indicator，避免双层视觉 */
  background: transparent;
  color: var(--primary-color);
  font-weight: 600;
  box-shadow: none;
}

.tabs--segment.tabs--small .tabs-tab {
  padding: 4px 10px;
}

.tabs--segment.tabs--large .tabs-tab {
  padding: 8px 18px;
}

/* 滑动指示器：描边按钮风格，跟随选中 tab 的位置/尺寸平滑过渡 */
.tabs-segment-indicator {
  position: absolute;
  pointer-events: none;
  background: var(--bg-color, #fff);
  border: 2px solid var(--primary-color);
  border-radius: 6px;
  box-sizing: border-box;
  z-index: 0;
  opacity: 0;
  transition:
    left 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    top 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.18s ease;
}

/* Pane wrapper */
.tabs-pane-wrapper {
  flex: 1;
  min-width: 0;
  position: relative;
}

.tabs-pane {
  padding: 12px 0;
  animation: tabs-fade-in 0.2s ease-out;
}

.z-tabs.is-vertical .tabs-pane {
  padding: 0 16px;
}

.z-tabs.is-animated .tabs-pane.is-active {
  animation: tabs-slide-in 0.25s ease-out;
}

@keyframes tabs-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes tabs-slide-in {
  from {
    opacity: 0;
    transform: translateX(8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
