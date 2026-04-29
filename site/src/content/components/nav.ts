export interface ComponentGroup {
  id: string
  label: string
}

export interface ComponentIndexEntry {
  id: string
  zhName: string
  enName: string
  group: string
}

export const componentGroups: ComponentGroup[] = [
  { id: 'input', label: '输入控件' },
  { id: 'display', label: '展示组件' },
  { id: 'feedback', label: '反馈组件' },
  { id: 'host', label: '宿主集成' }
]

export const componentIndex: ComponentIndexEntry[] = [
  { id: 'button', zhName: '按钮', enName: 'Button', group: 'input' },
  { id: 'input', zhName: '输入框', enName: 'Input', group: 'input' },
  { id: 'color-picker', zhName: '颜色选择器', enName: 'ColorPicker', group: 'input' },
  { id: 'checkbox', zhName: '复选框', enName: 'Checkbox', group: 'input' },
  { id: 'radio', zhName: '单选框', enName: 'Radio', group: 'input' },
  { id: 'switch', zhName: '开关', enName: 'Switch', group: 'input' },
  { id: 'select', zhName: '选择器', enName: 'Select', group: 'input' },
  { id: 'slider', zhName: '滑块', enName: 'Slider', group: 'input' },
  { id: 'hotkey-input', zhName: '快捷键录制', enName: 'HotkeyInput', group: 'input' },
  { id: 'tag', zhName: '标签', enName: 'Tag', group: 'display' },
  { id: 'command-card', zhName: '指令卡片', enName: 'CommandCard', group: 'display' },
  { id: 'command-tag', zhName: '指令标签', enName: 'CommandTag', group: 'display' },
  { id: 'feature-card', zhName: '功能卡片', enName: 'FeatureCard', group: 'display' },
  { id: 'adaptive-icon', zhName: '自适应图标', enName: 'AdaptiveIcon', group: 'display' },
  { id: 'toast', zhName: '轻提示', enName: 'Toast', group: 'feedback' },
  { id: 'confirm-dialog', zhName: '确认弹窗', enName: 'ConfirmDialog', group: 'feedback' },
  { id: 'popover', zhName: '浮层', enName: 'Popover', group: 'feedback' },
  { id: 'tag-dropdown', zhName: '标签下拉菜单', enName: 'TagDropdown', group: 'feedback' },
  { id: 'detail-panel', zhName: '详情面板', enName: 'DetailPanel', group: 'host' },
  { id: 'shortcut-editor', zhName: '快捷键编辑', enName: 'ShortcutEditor', group: 'host' },
  { id: 'plugin-detail', zhName: '插件详情', enName: 'PluginDetail', group: 'host' }
]
