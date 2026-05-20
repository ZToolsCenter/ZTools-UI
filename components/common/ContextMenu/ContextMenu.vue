<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { useOverlayPosition } from '../shared/useOverlayPosition'
import type { ContextMenuEmits, ContextMenuItem, ContextMenuProps } from './ContextMenu'

defineOptions({ name: 'ZContextMenu' })

const props = withDefaults(defineProps<ContextMenuProps>(), {
  show: undefined,
  defaultShow: false,
  disabled: false,
  to: 'body',
  zIndex: 10000
})

const emit = defineEmits<ContextMenuEmits>()

const triggerRef = ref<HTMLElement | null>(null)
const rootPanelRef = ref<HTMLElement | null>(null)
const uncontrolledShow = ref(props.show ?? props.defaultShow)

/** 根菜单的光标 x 坐标 */
const cursorX = ref(props.x ?? 0)
/** 根菜单的光标 y 坐标 */
const cursorY = ref(props.y ?? 0)

/** 根菜单内的活动项索引 */
const activeIndex = ref(-1)

/**
 * 展开路径：expandedPaths[d] 表示第 d 层菜单中展开子菜单的项索引。
 * - expandedPaths[0] = 根菜单中展开的项索引
 * - expandedPaths[1] = 第 1 层子菜单中展开的项索引
 * 数组长度 = 已展开的子菜单层级数
 */
const expandedPaths = ref<number[]>([])

/**
 * 子菜单活动索引：submenuActive[d] 表示第 d 层子菜单内高亮的项索引。
 * 数组长度应与 expandedPaths 一致。
 */
const submenuActive = ref<number[]>([])

/** 子菜单面板定位样式，key = 子菜单层级（从 0 开始） */
const submenuStyles = ref<Record<number, CSSProperties>>({})

/** 子菜单面板 DOM 引用，key = 子菜单层级 */
const submenuPanelRefs = ref<Record<number, HTMLElement | null>>({})

const mergedShow = computed(() => (props.show === undefined ? uncontrolledShow.value : props.show))
const teleportTarget = computed(() => (props.to === false ? 'body' : props.to ?? 'body'))
const hasExternalCoords = computed(() => props.x !== undefined && props.y !== undefined)
const mergedX = computed(() => (hasExternalCoords.value ? props.x! : cursorX.value))
const mergedY = computed(() => (hasExternalCoords.value ? props.y! : cursorY.value))

const rootTransformOrigin = ref('0px 0px')

function clampOrigin(value: number, max: number): number {
  return Math.min(Math.max(value, 0), max)
}

function updateRootTransformOrigin(panelRect: DOMRect): void {
  const originX = clampOrigin(mergedX.value - panelRect.left, panelRect.width)
  const originY = clampOrigin(mergedY.value - panelRect.top, panelRect.height)
  rootTransformOrigin.value = `${originX}px ${originY}px`
}

const { panelStyle: rootPanelStyle, containsTarget, scheduleUpdate } = useOverlayPosition({
  visible: mergedShow,
  triggerRef,
  panelRef: rootPanelRef,
  placement: computed(() => 'right-start' as const),
  x: computed(() => mergedX.value),
  y: computed(() => mergedY.value),
  zIndex: computed(() => props.zIndex),
  onPositioned: ({ panelRect }) => {
    updateRootTransformOrigin(panelRect)
  }
})

const rootPanelInlineStyle = computed<CSSProperties>(() => ({
  ...rootPanelStyle.value,
  transformOrigin: rootTransformOrigin.value
}))

watch(
  () => props.show,
  (value) => {
    if (value !== undefined) {
      uncontrolledShow.value = value
    }
  }
)

watch(
  () => [props.x, props.y] as const,
  () => {
    if (mergedShow.value) {
      scheduleUpdate()
    }
  }
)

/** 判断菜单项是否可交互（非分隔线、非禁用） */
function isActionableItem(item: ContextMenuItem): boolean {
  if (item.type === 'separator') return false
  return !item.disabled
}

/** 获取菜单列表中所有可交互项的索引 */
function getActionableIndices(items: ContextMenuItem[]): number[] {
  const indices: number[] = []
  for (let i = 0; i < items.length; i++) {
    if (isActionableItem(items[i])) {
      indices.push(i)
    }
  }
  return indices
}

/**
 * 获取第 depth 层的菜单项列表。
 * depth=0 为根菜单；depth>0 通过 expandedPaths 逐层导航到子菜单的 children。
 */
function getMenuItemsAtDepth(depth: number): ContextMenuItem[] {
  if (depth === 0) return props.menuItems

  let items = props.menuItems
  for (let d = 0; d < depth; d++) {
    const expandedIdx = d === 0 ? expandedPaths.value[0] : expandedPaths.value[d]
    if (expandedIdx === undefined) return []
    const item = items[expandedIdx]
    if (!item || item.type !== 'submenu' || !item.children) return []
    items = item.children
  }
  return items
}

/** 检测菜单列表中是否包含任何带图标的项 */
function hasAnyIcon(items: ContextMenuItem[]): boolean {
  return items.some((item) => item.type !== 'separator' && item.icon)
}

/** 设置菜单显隐状态 */
function setShow(next: boolean): void {
  if (mergedShow.value === next) return

  if (props.show === undefined) {
    uncontrolledShow.value = next
  }

  emit('update:show', next)
  emit('visible-change', next)
}

/** 关闭整个菜单树并重置所有状态 */
function closeAll(): void {
  activeIndex.value = -1
  expandedPaths.value = []
  submenuActive.value = []
  submenuStyles.value = {}
  submenuPanelRefs.value = {}
  setShow(false)
}

/** 处理触发区域的 contextmenu 事件 */
function handleContextMenu(event: MouseEvent): void {
  if (props.disabled) return

  event.preventDefault()
  event.stopPropagation()

  cursorX.value = event.clientX
  cursorY.value = event.clientY
  expandedPaths.value = []
  submenuActive.value = []
  submenuStyles.value = {}
  activeIndex.value = -1

  if (!mergedShow.value) {
    setShow(true)
  } else {
    scheduleUpdate()
  }

  nextTick(() => {
    rootPanelRef.value?.focus({ preventScroll: true })
    initActiveIndex()
  })
}

/** 将根菜单活动索引定位到第一个可交互项 */
function initActiveIndex(): void {
  const indices = getActionableIndices(props.menuItems)
  activeIndex.value = indices.length > 0 ? indices[0] : -1
}

/** 在指定层级内移动活动索引 */
function moveActiveIndex(depth: number, direction: -1 | 1): void {
  const items = getMenuItemsAtDepth(depth)
  const indices = getActionableIndices(items)
  if (indices.length === 0) return

  const currentIdx = getActiveIndex(depth)
  const pos = indices.indexOf(currentIdx)
  const nextPos = pos === -1
    ? (direction === 1 ? 0 : indices.length - 1)
    : (pos + direction + indices.length) % indices.length
  const nextIdx = indices[nextPos]

  setActiveIndex(depth, nextIdx)

  // 移动时折叠更深的子菜单
  if (expandedPaths.value.length > depth) {
    collapseSubmenu(depth)
  }
}

/** 获取指定层级的活动项索引 */
function getActiveIndex(depth: number): number {
  if (depth === 0) return activeIndex.value
  return submenuActive.value[depth - 1] ?? -1
}

/** 设置指定层级的活动项索引 */
function setActiveIndex(depth: number, index: number): void {
  if (depth === 0) {
    activeIndex.value = index
  } else {
    submenuActive.value[depth - 1] = index
  }
}

/**
 * 展开指定层级的子菜单。
 * depth=0 表示从根菜单展开第 1 层子菜单，depth=1 表示从第 1 层子菜单展开第 2 层，以此类推。
 */
function expandSubmenu(depth: number): void {
  const items = getMenuItemsAtDepth(depth)
  const idx = getActiveIndex(depth)
  const item = items[idx]
  if (!item || item.type !== 'submenu' || item.disabled) return

  // 同一子菜单已展开则不重复操作
  if (expandedPaths.value[depth] === idx) return

  expandedPaths.value[depth] = idx

  // 初始化子菜单内的活动索引
  const childIndices = getActionableIndices(item.children)
  submenuActive.value[depth] = childIndices.length > 0 ? childIndices[0] : -1

  // 裁掉更深层（重新展开时清理）
  if (expandedPaths.value.length > depth + 1) {
    expandedPaths.value = expandedPaths.value.slice(0, depth + 1)
    submenuActive.value = submenuActive.value.slice(0, depth + 1)
  }

  nextTick(() => {
    positionSubmenu(depth)
    submenuPanelRefs.value[depth]?.focus({ preventScroll: true })
  })
}

/** 折叠从指定层级开始的更深层子菜单 */
function collapseSubmenu(depth: number): void {
  expandedPaths.value = expandedPaths.value.slice(0, depth)
  submenuActive.value = submenuActive.value.slice(0, depth)

  // 清理 DOM 引用和样式
  for (const key of Object.keys(submenuStyles.value)) {
    if (Number(key) >= depth) {
      delete submenuStyles.value[Number(key)]
    }
  }
  for (const key of Object.keys(submenuPanelRefs.value)) {
    if (Number(key) >= depth) {
      delete submenuPanelRefs.value[Number(key)]
    }
  }
}

/** 根据父菜单中触发项的 DOMRect 计算子菜单面板的位置 */
function positionSubmenu(depth: number): void {
  const parentPanel = depth === 0 ? rootPanelRef.value : submenuPanelRefs.value[depth - 1]
  if (!parentPanel) return

  const itemIdx = expandedPaths.value[depth]
  const itemEl = parentPanel.querySelector(`[data-menu-index="${itemIdx}"]`) as HTMLElement | null
  if (!itemEl) return

  const submenuPanel = submenuPanelRefs.value[depth]
  if (!submenuPanel) return

  const itemRect = itemEl.getBoundingClientRect()
  const submenuRect = submenuPanel.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const padding = 8

  // 水平定位：优先右侧，不够则左侧
  let left: number
  if (itemRect.right + submenuRect.width + padding <= viewportWidth) {
    left = itemRect.right + 4
  } else {
    left = itemRect.left - submenuRect.width - 4
  }

  // 垂直定位：与触发项顶部对齐，不够则向上偏移
  let top = itemRect.top
  if (top + submenuRect.height > viewportHeight - padding) {
    top = Math.max(padding, viewportHeight - submenuRect.height - padding)
  }

  submenuStyles.value[depth] = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    zIndex: props.zIndex + depth + 1
  }
}

/** 存储子菜单面板 DOM 引用（不触发定位，避免 :ref 回调导致无限重渲染） */
function setSubmenuPanelRef(depth: number, el: HTMLElement | null): void {
  submenuPanelRefs.value[depth] = el
}

/** 处理菜单项点击或键盘选中 */
function handleItemSelect(item: ContextMenuItem): void {
  if (!isActionableItem(item)) return
  if (item.type === 'submenu') return

  emit('select', item.key)
  closeAll()
}

/** hover 定时器 */
let hoverTimer: ReturnType<typeof setTimeout> | null = null

/** 处理菜单项鼠标进入：更新活动索引并延迟展开子菜单 */
function handleItemPointerEnter(depth: number, index: number): void {
  const items = getMenuItemsAtDepth(depth)
  const item = items[index]
  if (!item) return

  setActiveIndex(depth, index)

  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }

  if (item.type === 'submenu' && !item.disabled) {
    hoverTimer = setTimeout(() => {
      expandSubmenu(depth)
    }, 100)
  } else {
    // 非子菜单项，折叠更深的子菜单
    if (expandedPaths.value.length > depth) {
      collapseSubmenu(depth)
    }
  }
}

/** 鼠标离开菜单面板时清理 hover 定时器 */
function handlePointerLeave(): void {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
}

/** 根菜单面板的键盘导航 */
function handleRootKeydown(event: KeyboardEvent): void {
  if (!mergedShow.value) return

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      moveActiveIndex(0, -1)
      break
    case 'ArrowDown':
      event.preventDefault()
      moveActiveIndex(0, 1)
      break
    case 'ArrowRight': {
      event.preventDefault()
      const item = props.menuItems[activeIndex.value]
      if (item?.type === 'submenu' && !item.disabled) {
        expandSubmenu(0)
      }
      break
    }
    case 'ArrowLeft':
      event.preventDefault()
      break
    case 'Enter':
    case ' ': {
      event.preventDefault()
      const enterItem = props.menuItems[activeIndex.value]
      if (enterItem) {
        if (enterItem.type === 'submenu') {
          expandSubmenu(0)
        } else {
          handleItemSelect(enterItem)
        }
      }
      break
    }
    case 'Home':
      event.preventDefault()
      initActiveIndex()
      break
    case 'End': {
      event.preventDefault()
      const indices = getActionableIndices(props.menuItems)
      if (indices.length > 0) {
        activeIndex.value = indices[indices.length - 1]
      }
      break
    }
    case 'Escape':
      event.preventDefault()
      closeAll()
      break
  }
}

/** 子菜单面板的键盘导航 */
function handleSubmenuKeydown(depth: number, event: KeyboardEvent): void {
  // depth 是子菜单层级：0=第1层子菜单, 1=第2层子菜单
  // 对应 getMenuItemsAtDepth(depth + 1)
  const items = getMenuItemsAtDepth(depth + 1)
  if (items.length === 0) return

  const subIdx = submenuActive.value[depth] ?? -1
  const indices = getActionableIndices(items)

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      moveInSubmenu(depth, indices, -1)
      break
    case 'ArrowDown':
      event.preventDefault()
      moveInSubmenu(depth, indices, 1)
      break
    case 'ArrowRight': {
      event.preventDefault()
      const subItem = items[subIdx]
      if (subItem?.type === 'submenu' && !subItem.disabled) {
        expandSubmenu(depth + 1)
      }
      break
    }
    case 'ArrowLeft':
      event.preventDefault()
      collapseSubmenu(depth)
      // 聚焦回父级面板
      if (depth === 0) {
        rootPanelRef.value?.focus({ preventScroll: true })
      } else {
        submenuPanelRefs.value[depth - 1]?.focus({ preventScroll: true })
      }
      break
    case 'Enter':
    case ' ': {
      event.preventDefault()
      if (subIdx >= 0) {
        const enterItem = items[subIdx]
        if (enterItem.type === 'submenu') {
          expandSubmenu(depth + 1)
        } else {
          handleItemSelect(enterItem)
        }
      }
      break
    }
    case 'Home':
      event.preventDefault()
      if (indices.length > 0) {
        submenuActive.value[depth] = indices[0]
      }
      break
    case 'End':
      event.preventDefault()
      if (indices.length > 0) {
        submenuActive.value[depth] = indices[indices.length - 1]
      }
      break
    case 'Escape':
      event.preventDefault()
      closeAll()
      break
  }
}

/** 在子菜单内移动活动索引 */
function moveInSubmenu(depth: number, indices: number[], direction: -1 | 1): void {
  if (indices.length === 0) return

  const currentIdx = submenuActive.value[depth] ?? -1
  const pos = indices.indexOf(currentIdx)
  const nextPos = pos === -1
    ? (direction === 1 ? 0 : indices.length - 1)
    : (pos + direction + indices.length) % indices.length

  submenuActive.value[depth] = indices[nextPos]

  // 移动时折叠更深的子菜单
  if (expandedPaths.value.length > depth + 1) {
    collapseSubmenu(depth + 1)
  }
}

/** 判断指定层级的子菜单是否已展开 */
function isSubmenuExpanded(depth: number, index: number): boolean {
  return expandedPaths.value[depth] === index
}

/** 判断菜单项在指定层级是否为当前活动项 */
function isActiveAtDepth(depth: number, index: number): boolean {
  if (depth === 0) return activeIndex.value === index
  return submenuActive.value[depth - 1] === index
}

/** 判断点击目标是否在任意菜单面板内 */
function containsMenuTarget(target: EventTarget | null): boolean {
  if (containsTarget(target)) return true

  const node = target as Node | null
  if (!node) return false

  for (const panel of Object.values(submenuPanelRefs.value)) {
    if (panel?.contains(node)) return true
  }
  return false
}

/** 全局 pointerdown：点击菜单外部时关闭 */
function handleDocumentPointerDown(event: PointerEvent): void {
  if (!mergedShow.value) return
  if (containsMenuTarget(event.target)) return

  emit('clickoutside', event)
  closeAll()
}

/** 全局 keydown：Escape 关闭 */
function handleDocumentKeydown(event: KeyboardEvent): void {
  if (!mergedShow.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeAll()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown, true)
  document.addEventListener('keydown', handleDocumentKeydown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
  document.removeEventListener('keydown', handleDocumentKeydown, true)
  if (hoverTimer) clearTimeout(hoverTimer)
})

defineExpose({ closeAll })
</script>

<template>
  <div class="zt-context-menu">
    <div
      ref="triggerRef"
      class="zt-context-menu__trigger"
      @contextmenu="handleContextMenu"
    >
      <slot></slot>
    </div>

    <Teleport :to="teleportTarget" :disabled="props.to === false">
      <!-- 根菜单面板 -->
      <Transition name="zt-context-menu-panel">
        <div
          v-if="mergedShow"
          ref="rootPanelRef"
          class="zt-context-menu__panel"
          :style="rootPanelInlineStyle"
          role="menu"
          tabindex="-1"
          @keydown="handleRootKeydown"
          @pointerleave="handlePointerLeave"
        >
          <template v-for="(item, index) in menuItems" :key="item.key ?? index">
            <div
              v-if="item.type === 'separator'"
              class="zt-context-menu__separator"
              role="separator"
            ></div>
            <div
              v-else
              class="zt-context-menu__item"
              :class="{
                'is-active': isActiveAtDepth(0, index),
                'is-disabled': item.disabled,
                'is-danger': item.danger
              }"
              :data-menu-index="index"
              role="menuitem"
              :aria-disabled="item.disabled ? 'true' : undefined"
              :aria-haspopup="item.type === 'submenu' ? 'menu' : undefined"
              :aria-expanded="item.type === 'submenu' ? isSubmenuExpanded(0, index) : undefined"
              @click="handleItemSelect(item)"
              @pointerenter="handleItemPointerEnter(0, index)"
            >
              <span v-if="item.icon" :class="item.icon" class="zt-context-menu__item-icon"></span>
              <span v-else-if="hasAnyIcon(menuItems)" class="zt-context-menu__item-icon"></span>
              <span class="zt-context-menu__item-label">{{ item.label }}</span>
              <span v-if="'shortcut' in item && item.shortcut" class="zt-context-menu__item-shortcut">{{ item.shortcut }}</span>
              <svg v-if="item.type === 'submenu'" class="zt-context-menu__submenu-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </template>
        </div>
      </Transition>

      <!-- 子菜单面板 -->
      <template v-for="(_, depth) in expandedPaths" :key="depth">
        <Transition name="zt-context-menu-panel">
          <div
            v-if="expandedPaths[depth] !== undefined"
            :ref="(el) => setSubmenuPanelRef(depth, el as HTMLElement | null)"
            class="zt-context-menu__panel zt-context-menu__panel--submenu"
            :style="submenuStyles[depth]"
            role="menu"
            tabindex="-1"
            @keydown="handleSubmenuKeydown(depth, $event)"
            @pointerleave="handlePointerLeave"
          >
            <template v-for="(subItem, subIndex) in getMenuItemsAtDepth(depth + 1)" :key="subItem.key ?? subIndex">
              <div
                v-if="subItem.type === 'separator'"
                class="zt-context-menu__separator"
                role="separator"
              ></div>
              <div
                v-else
                class="zt-context-menu__item"
                :class="{
                  'is-active': isActiveAtDepth(depth + 1, subIndex),
                  'is-disabled': subItem.disabled,
                  'is-danger': subItem.danger
                }"
                :data-menu-index="subIndex"
                role="menuitem"
                :aria-disabled="subItem.disabled ? 'true' : undefined"
                :aria-haspopup="subItem.type === 'submenu' ? 'menu' : undefined"
                :aria-expanded="subItem.type === 'submenu' ? isSubmenuExpanded(depth + 1, subIndex) : undefined"
                @click="handleItemSelect(subItem)"
                @pointerenter="handleItemPointerEnter(depth + 1, subIndex)"
              >
                <span v-if="subItem.icon" :class="subItem.icon" class="zt-context-menu__item-icon"></span>
                <span v-else-if="hasAnyIcon(getMenuItemsAtDepth(depth + 1))" class="zt-context-menu__item-icon"></span>
                <span class="zt-context-menu__item-label">{{ subItem.label }}</span>
                <span v-if="'shortcut' in subItem && subItem.shortcut" class="zt-context-menu__item-shortcut">{{ subItem.shortcut }}</span>
                <svg v-if="subItem.type === 'submenu'" class="zt-context-menu__submenu-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </template>
          </div>
        </Transition>
      </template>
    </Teleport>
  </div>
</template>

<style>
.zt-context-menu {
  display: inline-flex;
  max-width: 100%;
}

.zt-context-menu__trigger {
  display: inline-flex;
  max-width: 100%;
}

.zt-context-menu__panel {
  min-width: 160px;
  max-width: min(280px, calc(100vw - 16px));
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid var(--control-border);
  border-radius: 6px;
  backdrop-filter: blur(100px) saturate(200%) brightness(110%);
  -webkit-backdrop-filter: blur(100px) saturate(200%) brightness(110%);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  outline: none;
}

html.dark .zt-context-menu__panel {
  background: rgba(48, 48, 48, 0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.zt-context-menu__panel--submenu {
  position: fixed;
}

.zt-context-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  color: var(--text-color);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
  user-select: none;
  line-height: 20px;
}

.zt-context-menu__item.is-active {
  background: var(--hover-bg);
}

.zt-context-menu__item.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zt-context-menu__item.is-danger {
  color: var(--danger-color, #ef4444);
}

.zt-context-menu__item.is-danger.is-active {
  background: var(--danger-light-bg, rgba(239, 68, 68, 0.1));
}

.zt-context-menu__item-icon {
  flex-shrink: 0;
  opacity: 0.8;
  font-size: 14px;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.zt-context-menu__item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.zt-context-menu__item-shortcut {
  flex-shrink: 0;
  color: var(--text-secondary, #999);
  font-size: 12px;
  margin-left: auto;
  padding-left: 16px;
}

.zt-context-menu__submenu-arrow {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  opacity: 0.5;
  margin-left: auto;
}

.zt-context-menu__separator {
  height: 1px;
  margin: 4px 8px;
  background: var(--control-border);
}

.zt-context-menu-panel-enter-active {
  animation: zt-context-menu-in 0.15s ease-out;
}

.zt-context-menu-panel-leave-active {
  animation: zt-context-menu-out 0.1s ease-in;
}

@keyframes zt-context-menu-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zt-context-menu-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
