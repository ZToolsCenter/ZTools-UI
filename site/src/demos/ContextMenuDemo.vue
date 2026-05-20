<script setup lang="ts">
import { ref } from 'vue'
import { ZContextMenu } from 'ztools-ui-components/common/ContextMenu'
import type { ContextMenuItem } from 'ztools-ui-components/common/ContextMenu'
import { useToast } from 'ztools-ui-components/common/Toast'
import { ZToast } from 'ztools-ui-components/common/Toast'

const basicItems: ContextMenuItem[] = [
  { key: 'new', label: '新建文件', icon: 'i-z-add', shortcut: 'Ctrl+N' },
  { key: 'open', label: '打开', icon: 'i-z-file', shortcut: 'Ctrl+O' },
  { key: 'save', label: '保存', icon: 'i-z-settings', shortcut: 'Ctrl+S' },
  { type: 'separator' },
  { key: 'copy', label: '复制', shortcut: 'Ctrl+C' },
  { key: 'paste', label: '粘贴', shortcut: 'Ctrl+V' },
  { type: 'separator' },
  { key: 'delete', label: '删除', icon: 'i-z-trash', danger: true }
]

const textOnlyItems: ContextMenuItem[] = [
  { key: 'back', label: '返回', shortcut: 'Alt+←' },
  { key: 'forward', label: '前进', shortcut: 'Alt+→' },
  { key: 'refresh', label: '重新加载', shortcut: 'Ctrl+R' },
  { type: 'separator' },
  { key: 'bookmark', label: '添加书签', shortcut: 'Ctrl+D' },
  { key: 'source', label: '查看源代码' },
  { type: 'separator' },
  { key: 'inspect', label: '检查' }
]

const disabledItems: ContextMenuItem[] = [
  { key: 'edit', label: '编辑', icon: 'i-z-settings' },
  { key: 'readonly', label: '只读模式', disabled: true },
  { key: 'copy', label: '复制' },
  { key: 'paste-disabled', label: '粘贴（未复制）', disabled: true },
  { type: 'separator' },
  { key: 'delete', label: '删除', danger: true }
]

const submenuItems: ContextMenuItem[] = [
  { key: 'new', label: '新建', icon: 'i-z-add' },
  { type: 'separator' },
  {
    type: 'submenu',
    key: 'new-type',
    label: '新建类型',
    icon: 'i-z-file',
    children: [
      { key: 'ts', label: 'TypeScript 文件', shortcut: '.ts' },
      { key: 'vue', label: 'Vue 组件', shortcut: '.vue' },
      { key: 'css', label: '样式表', shortcut: '.css' },
      { type: 'separator' },
      { key: 'other', label: '其他...' }
    ]
  },
  {
    type: 'submenu',
    key: 'export',
    label: '导出为',
    children: [
      { key: 'json', label: 'JSON' },
      { key: 'csv', label: 'CSV' },
      { key: 'md', label: 'Markdown' }
    ]
  },
  { type: 'separator' },
  { key: 'settings', label: '设置', icon: 'i-z-settings' },
  { key: 'delete', label: '删除', icon: 'i-z-trash', danger: true }
]

const controlledShow = ref(false)
const controlledX = ref(0)
const controlledY = ref(0)
const { toastState, info } = useToast()

/** 使用 Toast 展示当前选中的菜单项 */
function onSelect(key: string) {
  info(`选中: ${key}`)
}

function handleControlledContextmenu(event: MouseEvent) {
  event.preventDefault()
  controlledX.value = event.clientX
  controlledY.value = event.clientY
  controlledShow.value = true
}
</script>

<template>
  <div class="demo-section">
    <p>右键触发区域可打开上下文菜单，支持子菜单、快捷键标注、禁用项和危险操作。</p>

    <div class="demo-box">
      <ZContextMenu :menu-items="basicItems" @select="onSelect">
        <div class="demo-area">
          右键点击此区域 — 基础菜单
        </div>
      </ZContextMenu>

      <ZContextMenu :menu-items="textOnlyItems" @select="onSelect">
        <div class="demo-area">
          右键点击此区域 — 纯文本菜单
        </div>
      </ZContextMenu>

      <ZContextMenu :menu-items="disabledItems" @select="onSelect">
        <div class="demo-area">
          右键点击此区域 — 禁用项
        </div>
      </ZContextMenu>

      <ZContextMenu :menu-items="submenuItems" @select="onSelect">
        <div class="demo-area">
          右键点击此区域 — 子菜单
        </div>
      </ZContextMenu>

      <div class="demo-area" @contextmenu="handleControlledContextmenu">
        右键点击此区域 — 受控定位
      </div>
      <ZContextMenu
        :menu-items="basicItems"
        :show="controlledShow"
        :x="controlledX"
        :y="controlledY"
        @update:show="controlledShow = $event"
        @select="onSelect"
      />
    </div>
    <ZToast
      :visible="toastState.visible"
      :message="toastState.message"
      :type="toastState.type"
      :duration="toastState.duration"
      @update:visible="toastState.visible = $event"
    />
  </div>
</template>

<style scoped>
.demo-section p {
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}

.demo-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.demo-area {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 24px 32px;
  background: var(--control-bg);
  border: 1px dashed var(--control-border);
  border-radius: 8px;
  cursor: default;
  font-size: 13px;
  color: var(--text-secondary);
  user-select: none;
  min-width: 160px;
  min-height: 80px;
  text-align: center;
}

.demo-area:hover {
  border-color: var(--primary-color, #3b82f6);
}
</style>
