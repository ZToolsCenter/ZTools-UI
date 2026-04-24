import type { App, Component, Plugin } from 'vue'

import { AdaptiveIcon } from './components/common/AdaptiveIcon'
import { Button } from './components/common/Button'
import { Checkbox } from './components/common/Checkbox'
import { ColorPicker } from './components/common/ColorPicker'
import { CommandCard } from './components/common/CommandCard'
import { CommandTag } from './components/common/CommandTag'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { DetailPanel } from './components/common/DetailPanel'
import { Dropdown } from './components/common/Dropdown'
import { FeatureCard } from './components/common/FeatureCard'
import { HotkeyInput } from './components/common/HotkeyInput'
import { Input } from './components/common/Input'
import { PluginDetail } from './components/common/PluginDetail'
import { Radio } from './components/common/Radio'
import { ShortcutEditor } from './components/common/ShortcutEditor'
import { Slider } from './components/common/Slider'
import { Switch } from './components/common/Switch'
import { Tag } from './components/common/Tag'
import { TagDropdown } from './components/common/TagDropdown'
import { Toast } from './components/common/Toast'

const components = {
  AdaptiveIcon,
  Button,
  Checkbox,
  ColorPicker,
  CommandCard,
  CommandTag,
  ConfirmDialog,
  DetailPanel,
  Dropdown,
  FeatureCard,
  HotkeyInput,
  Input,
  PluginDetail,
  Radio,
  ShortcutEditor,
  Slider,
  Switch,
  Tag,
  TagDropdown,
  Toast
} as const

export function install(app: App): void {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component as Component)
  })
}

const plugin: Plugin = {
  install
}

export default plugin
