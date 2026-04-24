// 重新导出组件文档元数据
export * from './meta'

// 为了保持向后兼容，保留旧接口（已弃用）
import type { Component } from 'vue'
import ButtonDemo from '../../demos/ButtonDemo.vue'
import DropdownDemo from '../../demos/DropdownDemo.vue'
import InputDemo from '../../demos/InputDemo.vue'
import SliderDemo from '../../demos/SliderDemo.vue'
import TagDemo from '../../demos/TagDemo.vue'
import ColorPickerDemo from '../../demos/ColorPickerDemo.vue'
import CheckboxDemo from '../../demos/CheckboxDemo.vue'
import RadioDemo from '../../demos/RadioDemo.vue'
import SwitchDemo from '../../demos/SwitchDemo.vue'

/** @deprecated 请使用 meta.ts 中的 componentDocs */
export interface ComponentRegistryEntry {
  id: string
  name: string
  group: string
  description: string
  demo: Component
}

/** @deprecated 请使用 meta.ts 中的 componentDocs */
export const componentRegistry: ComponentRegistryEntry[] = [
  { id: 'button', name: 'Button', group: 'input', description: '按钮', demo: ButtonDemo },
  { id: 'dropdown', name: 'Dropdown', group: 'input', description: '下拉选择器', demo: DropdownDemo },
  { id: 'input', name: 'Input', group: 'input', description: '输入框', demo: InputDemo },
  { id: 'slider', name: 'Slider', group: 'input', description: '滑块', demo: SliderDemo },
  { id: 'color-picker', name: 'ColorPicker', group: 'input', description: '颜色选择器', demo: ColorPickerDemo },
  { id: 'checkbox', name: 'Checkbox', group: 'input', description: '复选框', demo: CheckboxDemo },
  { id: 'radio', name: 'Radio', group: 'input', description: '单选框', demo: RadioDemo },
  { id: 'switch', name: 'Switch', group: 'input', description: '开关', demo: SwitchDemo },
  { id: 'tag', name: 'Tag', group: 'display', description: '标签', demo: TagDemo }
]

/** @deprecated 请使用 meta.ts 中的 componentGroups */
export const componentGroups = [
  { id: 'input', label: '输入控件' },
  { id: 'display', label: '展示组件' },
  { id: 'feedback', label: '反馈组件' },
  { id: 'host', label: '宿主集成' }
]
