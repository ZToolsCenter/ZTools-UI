import type { App, Component, Plugin } from 'vue'

import { ZAdaptiveIcon } from './components/common/AdaptiveIcon'
import { ZButton } from './components/common/Button'
import { ZCheckbox } from './components/common/Checkbox'
import { ZColorPicker } from './components/common/ColorPicker'
import { ZCommandCard } from './components/common/CommandCard'
import { ZCommandTag } from './components/common/CommandTag'
import { ZConfirmDialog } from './components/common/ConfirmDialog'
import { ZDetailPanel } from './components/common/DetailPanel'
import { ZSelect } from './components/common/Select'
import { ZFeatureCard } from './components/common/FeatureCard'
import { ZHotkeyInput } from './components/common/HotkeyInput'
import { ZInput } from './components/common/Input'
import { ZPluginDetail } from './components/common/PluginDetail'
import { ZRadio } from './components/common/Radio'
import { ZShortcutEditor } from './components/common/ShortcutEditor'
import { ZSlider } from './components/common/Slider'
import { ZSwitch } from './components/common/Switch'
import { ZTag } from './components/common/Tag'
import { ZTagDropdown } from './components/common/TagDropdown'
import { ZToast } from './components/common/Toast'

const components = {
  ZAdaptiveIcon,
  ZButton,
  ZCheckbox,
  ZColorPicker,
  ZCommandCard,
  ZCommandTag,
  ZConfirmDialog,
  ZDetailPanel,
  ZSelect,
  ZFeatureCard,
  ZHotkeyInput,
  ZInput,
  ZPluginDetail,
  ZRadio,
  ZShortcutEditor,
  ZSlider,
  ZSwitch,
  ZTag,
  ZTagDropdown,
  ZToast
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
