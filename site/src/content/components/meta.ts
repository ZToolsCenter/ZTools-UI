import type { Component } from 'vue'
import { componentGroups, componentIndex } from './nav'
import ButtonDemo from '../../demos/ButtonDemo.vue'
import SelectDemo from '../../demos/SelectDemo.vue'
import SelectDemoSource from '../../demos/SelectDemo.vue?raw'
import SliderDemo from '../../demos/SliderDemo.vue'
import SliderDemoSource from '../../demos/SliderDemo.vue?raw'
import InputDemo from '../../demos/InputDemo.vue'
import ColorPickerDemo from '../../demos/ColorPickerDemo.vue'
import PopoverDemo from '../../demos/PopoverDemo.vue'
import CheckboxDemo from '../../demos/CheckboxDemo.vue'
import RadioDemo from '../../demos/RadioDemo.vue'
import SwitchDemo from '../../demos/SwitchDemo.vue'
import TagDemo from '../../demos/TagDemo.vue'
import HotkeyInputDemo from '../../demos/HotkeyInputDemo.vue'
import HotkeyInputDemoSource from '../../demos/HotkeyInputDemo.vue?raw'
import CommandCardDemo from '../../demos/CommandCardDemo.vue'
import CommandCardDemoSource from '../../demos/CommandCardDemo.vue?raw'
import CommandTagDemo from '../../demos/CommandTagDemo.vue'
import CommandTagDemoSource from '../../demos/CommandTagDemo.vue?raw'
import FeatureCardDemo from '../../demos/FeatureCardDemo.vue'
import FeatureCardDemoSource from '../../demos/FeatureCardDemo.vue?raw'
import AdaptiveIconDemo from '../../demos/AdaptiveIconDemo.vue'
import AdaptiveIconDemoSource from '../../demos/AdaptiveIconDemo.vue?raw'
import ToastDemo from '../../demos/ToastDemo.vue'
import ToastDemoSource from '../../demos/ToastDemo.vue?raw'
import ConfirmDialogDemo from '../../demos/ConfirmDialogDemo.vue'
import ConfirmDialogDemoSource from '../../demos/ConfirmDialogDemo.vue?raw'
import TagDropdownDemo from '../../demos/TagDropdownDemo.vue'
import TagDropdownDemoSource from '../../demos/TagDropdownDemo.vue?raw'
import DetailPanelDemo from '../../demos/DetailPanelDemo.vue'
import DetailPanelDemoSource from '../../demos/DetailPanelDemo.vue?raw'
import ShortcutEditorDemo from '../../demos/ShortcutEditorDemo.vue'
import ShortcutEditorDemoSource from '../../demos/ShortcutEditorDemo.vue?raw'
import PluginDetailDemo from '../../demos/PluginDetailDemo.vue'
import PluginDetailDemoSource from '../../demos/PluginDetailDemo.vue?raw'

const componentDemoSources = new Map<Component, string>([
  [SelectDemo, SelectDemoSource],
  [SliderDemo, SliderDemoSource],
  [HotkeyInputDemo, HotkeyInputDemoSource],
  [CommandCardDemo, CommandCardDemoSource],
  [CommandTagDemo, CommandTagDemoSource],
  [FeatureCardDemo, FeatureCardDemoSource],
  [AdaptiveIconDemo, AdaptiveIconDemoSource],
  [ToastDemo, ToastDemoSource],
  [ConfirmDialogDemo, ConfirmDialogDemoSource],
  [TagDropdownDemo, TagDropdownDemoSource],
  [DetailPanelDemo, DetailPanelDemoSource],
  [ShortcutEditorDemo, ShortcutEditorDemoSource],
  [PluginDetailDemo, PluginDetailDemoSource]
])

interface SfcSourceBlock {
  tag: 'template' | 'script'
  attrs: string
  content: string
}

// 组件文档演示项
export interface ComponentDemo {
  title: string
  description?: string
  component: Component
  componentProps?: Record<string, unknown>
  sourceCode?: string
}

interface VariantDemoConfig<TVariant extends string> {
  variant: TVariant
  title: string
  description?: string
  sourceCode: string
  props?: Record<string, unknown>
}

function trimCodeBlock(code: string): string {
  const lines = code.replace(/\r\n/g, '\n').replace(/^\n/, '').replace(/\n\s*$/, '').split('\n')
  const firstContentLine = lines.find((line) => line.trim())
  const baseIndent = firstContentLine?.match(/^\s*/)?.[0].length ?? 0

  return lines
    .map((line) => {
      if (!line.trim()) return ''

      const indent = line.match(/^\s*/)?.[0].length ?? 0
      return indent >= baseIndent ? line.slice(baseIndent) : line
    })
    .join('\n')
}

function indentCodeBlock(code: string): string {
  return trimCodeBlock(code)
    .split('\n')
    .map((line) => (line ? `  ${line}` : line))
    .join('\n')
}

function createDemoSource(template: string, script: string): string {
  return `<template>\n${indentCodeBlock(template)}\n</template>\n\n<script setup lang="ts">\n${trimCodeBlock(script)}\n</script>`
}

const buttonDemoScript = `import { ZButton } from 'ztools-ui-components/common/Button'`
const inputDemoScript = `import { ZInput } from 'ztools-ui-components/common/Input'`
const inputModelDemoScript = `import { ref } from 'vue'
import { ZInput } from 'ztools-ui-components/common/Input'`
const colorPickerDemoScript = `import { ZColorPicker } from 'ztools-ui-components/common/ColorPicker'`
const colorPickerModelDemoScript = `import { ref } from 'vue'
import { ZColorPicker } from 'ztools-ui-components/common/ColorPicker'`
const popoverDemoScript = `import { ZButton } from 'ztools-ui-components/common/Button'
import { ZPopover } from 'ztools-ui-components/common/Popover'`
const popoverOnlyDemoScript = `import { ZPopover } from 'ztools-ui-components/common/Popover'`
const popoverModelDemoScript = `import { ref } from 'vue'
import { ZButton } from 'ztools-ui-components/common/Button'
import { ZPopover } from 'ztools-ui-components/common/Popover'`
const checkboxDemoScript = `import { ZCheckbox } from 'ztools-ui-components/common/Checkbox'`
const checkboxModelDemoScript = `import { ref } from 'vue'
import { ZCheckbox } from 'ztools-ui-components/common/Checkbox'`
const radioDemoScript = `import { ZRadio } from 'ztools-ui-components/common/Radio'`
const radioModelDemoScript = `import { ref } from 'vue'
import { ZRadio } from 'ztools-ui-components/common/Radio'`
const switchDemoScript = `import { ZSwitch } from 'ztools-ui-components/common/Switch'`
const switchModelDemoScript = `import { ref } from 'vue'
import { ZSwitch } from 'ztools-ui-components/common/Switch'`
const tagDemoScript = `import { ZTag } from 'ztools-ui-components/common/Tag'`
const tagModelDemoScript = `import { ref } from 'vue'
import { ZTag } from 'ztools-ui-components/common/Tag'`
const selectDemoScript = `import { ZSelect } from 'ztools-ui-components/common/Select'`
const selectModelDemoScript = `import { ref } from 'vue'
import { ZSelect } from 'ztools-ui-components/common/Select'
import type { SelectValueType } from 'ztools-ui-components/common/Select'`

const buttonDemoVariants = [
  {
    variant: 'basic',
    title: '基础',
    description: '展示 default / primary / success / warning / danger 与块级按钮。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row">
            <ZButton>默认按钮</ZButton>
            <ZButton type="primary">主要按钮</ZButton>
            <ZButton type="success">成功按钮</ZButton>
            <ZButton type="warning">警告按钮</ZButton>
            <ZButton type="danger">危险按钮</ZButton>
          </div>
          <ZButton block type="primary">块级按钮</ZButton>
        </div>
      `,
      buttonDemoScript
    )
  },
  {
    variant: 'dashed',
    title: '虚线按钮',
    description: '通过文档样式扩展示例，演示虚线描边按钮的展示方式。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row">
            <ZButton class="button-demo__dashed">默认虚线</ZButton>
            <ZButton class="button-demo__dashed button-demo__dashed--primary">主要虚线</ZButton>
            <ZButton class="button-demo__dashed button-demo__dashed--danger">危险虚线</ZButton>
          </div>
        </div>
      `,
      buttonDemoScript
    )
  },
  {
    variant: 'size',
    title: '尺寸',
    description: '支持 small、medium、large 三种尺寸。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row button-demo__row--align-end">
            <ZButton size="small">Small</ZButton>
            <ZButton size="medium" type="primary">Medium</ZButton>
            <ZButton size="large" type="success">Large</ZButton>
          </div>
        </div>
      `,
      buttonDemoScript
    )
  },
  {
    variant: 'text',
    title: '文本',
    description: '适合弱操作或次级导航场景。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row">
            <ZButton type="text">文字按钮</ZButton>
            <ZButton type="text">查看详情</ZButton>
            <ZButton type="text">移除</ZButton>
          </div>
        </div>
      `,
      buttonDemoScript
    )
  },
  {
    variant: 'label',
    title: '标签',
    description: '按钮内容可自由组合，用于徽标、数量或状态提示。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row">
            <ZButton type="primary">
              <span class="button-demo__compound">
                <span>发布</span>
                <span class="button-demo__pill button-demo__pill--light">Beta</span>
              </span>
            </ZButton>
            <ZButton>
              <span class="button-demo__compound">
                <span>消息</span>
                <span class="button-demo__pill">12</span>
              </span>
            </ZButton>
            <ZButton type="success">
              <span class="button-demo__compound">
                <span>同步</span>
                <span class="button-demo__pill button-demo__pill--success">已启用</span>
              </span>
            </ZButton>
          </div>
        </div>
      `,
      buttonDemoScript
    )
  },
  {
    variant: 'disabled',
    title: '禁用',
    description: '禁用状态下按钮不可点击，并降低视觉权重。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row">
            <ZButton disabled>默认禁用</ZButton>
            <ZButton type="primary" disabled>主要禁用</ZButton>
            <ZButton type="text" disabled>文字禁用</ZButton>
          </div>
        </div>
      `,
      buttonDemoScript
    )
  },
  {
    variant: 'icon',
    title: '图标',
    description: '通过 icon 插槽在按钮前添加图标。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row">
            <ZButton type="primary">
              <template #icon>
                <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v8m0 0 3-3m-3 3L5 7m-2 5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </template>
              下载
            </ZButton>
            <ZButton>
              <template #icon>
                <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M7 3h6M7 8h6M7 13h6M3 3h.01M3 8h.01M3 13h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </template>
              列表
            </ZButton>
            <ZButton type="success">
              <template #icon>
                <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3.5 8 3 3 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </template>
              已完成
            </ZButton>
          </div>
        </div>
      `,
      buttonDemoScript
    )
  },
  {
    variant: 'event',
    title: '事件',
    description: '点击按钮时可触发 click 事件，并更新外部状态。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__column">
            <div class="button-demo__row">
              <ZButton @click="handleAction('保存')">保存</ZButton>
              <ZButton type="primary" @click="handleAction('发布')">发布</ZButton>
              <ZButton type="danger" @click="handleAction('删除')">删除</ZButton>
            </div>
            <div class="button-demo__status">
              <span>触发次数：{{ clickCount }}</span>
              <span>最后事件：{{ lastAction }}</span>
            </div>
          </div>
        </div>
      `,
      `
        import { ref } from 'vue'
        import { ZButton } from 'ztools-ui-components/common/Button'

        const clickCount = ref(0)
        const lastAction = ref('未触发')

        function handleAction(action: string) {
          clickCount.value += 1
          lastAction.value = action
        }
      `
    )
  },
  {
    variant: 'shape',
    title: '形状',
    description: '文档中演示圆角、胶囊和圆形按钮的常见布局写法。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row">
            <ZButton class="button-demo__round" type="primary">圆角按钮</ZButton>
            <ZButton class="button-demo__round" type="success">胶囊按钮</ZButton>
            <ZButton class="button-demo__circle" type="primary" aria-label="添加">
              <template #icon>
                <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </template>
            </ZButton>
          </div>
        </div>
      `,
      buttonDemoScript
    )
  },
  {
    variant: 'transparent',
    title: '透明背景',
    description: '在有底色的容器中展示透明按钮效果。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__surface">
            <div class="button-demo__row">
              <ZButton class="button-demo__transparent">默认透明</ZButton>
              <ZButton class="button-demo__transparent button-demo__transparent--primary">主要透明</ZButton>
              <ZButton class="button-demo__transparent button-demo__transparent--danger">危险透明</ZButton>
            </div>
          </div>
        </div>
      `,
      buttonDemoScript
    )
  },
  {
    variant: 'loading',
    title: '加载中',
    description: 'loading 状态会禁用按钮交互并显示加载指示器。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row">
            <ZButton :loading="loading" type="primary" @click="handleLoading">提交</ZButton>
            <ZButton loading>同步中</ZButton>
          </div>
        </div>
      `,
      `
        import { ref } from 'vue'
        import { ZButton } from 'ztools-ui-components/common/Button'

        const loading = ref(false)

        function handleLoading() {
          if (loading.value) return

          loading.value = true
          window.setTimeout(() => {
            loading.value = false
          }, 1200)
        }
      `
    )
  },
  {
    variant: 'group',
    title: '按钮组',
    description: '将多个按钮拼接为连续操作组。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__group">
            <ZButton class="button-demo__group-item">上一步</ZButton>
            <ZButton class="button-demo__group-item button-demo__group-item--active">处理中</ZButton>
            <ZButton class="button-demo__group-item">下一步</ZButton>
          </div>
        </div>
      `,
      buttonDemoScript
    )
  }
] satisfies readonly VariantDemoConfig<string>[]

const inputDemoVariants = [
  {
    variant: 'basic',
    title: '基础用法',
    description: '通过 v-model 绑定输入值，适合常规文本输入。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZInput v-model="text" placeholder="请输入内容" />
          <span>当前值: {{ text }}</span>
        </div>
      `,
      `
        ${inputModelDemoScript}

        const text = ref('ztools-ui')
      `
    )
  },
  {
    variant: 'clearable',
    title: '可清空',
    description: '设置 clearable 后，输入框有内容时会显示清空按钮。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZInput v-model="text" placeholder="请输入内容" clearable />
          <span>当前值: {{ text || '空' }}</span>
        </div>
      `,
      `
        ${inputModelDemoScript}

        const text = ref('可清空内容')
      `
    )
  },
  {
    variant: 'affix',
    title: '前后缀',
    description: '通过 prefix 和 suffix 插槽补充输入框语义。',
    sourceCode: createDemoSource(
      `
        <div class="demo-grid">
          <ZInput v-model="keyword" placeholder="搜索插件">
            <template #prefix>搜索</template>
          </ZInput>
          <ZInput model-value="readonly value" readonly>
            <template #suffix>只读</template>
          </ZInput>
        </div>
      `,
      `
        ${inputModelDemoScript}

        const keyword = ref('插件搜索')
      `
    )
  },
  {
    variant: 'size',
    title: '尺寸',
    description: '支持 small、medium、large 三种尺寸。',
    sourceCode: createDemoSource(
      `
        <div class="demo-grid">
          <ZInput model-value="Small" size="small" />
          <ZInput model-value="Medium" size="medium" />
          <ZInput model-value="Large" size="large" />
        </div>
      `,
      inputDemoScript
    )
  },
  {
    variant: 'state',
    title: '状态',
    description: '展示只读、禁用和密码输入等常见状态。',
    sourceCode: createDemoSource(
      `
        <div class="demo-grid">
          <ZInput model-value="readonly value" readonly />
          <ZInput model-value="disabled value" disabled />
          <ZInput v-model="password" type="password" placeholder="请输入密码" />
        </div>
      `,
      `
        ${inputModelDemoScript}

        const password = ref('')
      `
    )
  },
  {
    variant: 'textarea',
    title: '文本域',
    description: '设置 type 为 textarea 可输入多行文本。',
    sourceCode: createDemoSource(
      `
        <ZInput v-model="text" type="textarea" placeholder="请输入多行内容" />
      `,
      `
        ${inputModelDemoScript}

        const text = ref('这是一段多行文本内容')
      `
    )
  },
  {
    variant: 'validation',
    title: '验证状态',
    description: '可脱离表单独立使用 success、warning、error 状态和提示文案。',
    sourceCode: createDemoSource(
      `
        <div class="demo-grid">
          <ZInput model-value="ztools-ui" status="success" message="名称可用" />
          <ZInput model-value="ztools" status="warning" message="建议使用更明确的名称" />
          <ZInput v-model="username" status="error" message="至少输入 3 个字符" />
        </div>
      `,
      `
        ${inputModelDemoScript}

        const username = ref('ab')
      `
    )
  },
  {
    variant: 'word-limit',
    title: '字数统计',
    description: '设置 show-word-limit 后显示当前字数，配合 maxlength 展示上限。',
    sourceCode: createDemoSource(
      `
        <ZInput v-model="text" type="textarea" :maxlength="30" show-word-limit placeholder="请输入 30 字以内的内容" />
      `,
      `
        ${inputModelDemoScript}

        const text = ref('ztools-ui')
      `
    )
  }
] satisfies readonly VariantDemoConfig<string>[]

const colorPickerDemoVariants = [
  {
    variant: 'basic',
    title: '基础用法',
    description: '可同时使用颜色面板和文本输入框编辑颜色值。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZColorPicker v-model="color" />
          <span>当前颜色: {{ color }}</span>
        </div>
      `,
      `
        ${colorPickerModelDemoScript}

        const color = ref('#0284c7')
      `
    )
  },
  {
    variant: 'size',
    title: '尺寸',
    description: '支持 small、medium、large 三种尺寸。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZColorPicker v-model="color" size="small" />
          <ZColorPicker v-model="color" size="medium" />
          <ZColorPicker v-model="color" size="large" />
        </div>
      `,
      `
        ${colorPickerModelDemoScript}

        const color = ref('#0284c7')
      `
    )
  },
  {
    variant: 'without-input',
    title: '隐藏输入框',
    description: '设置 show-input 为 false，仅保留颜色选择入口。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZColorPicker v-model="color" :show-input="false" />
          <span>当前颜色: {{ color }}</span>
        </div>
      `,
      `
        ${colorPickerModelDemoScript}

        const color = ref('#16a34a')
      `
    )
  },
  {
    variant: 'alpha',
    title: '透明通道',
    description: '设置 show-alpha 后可在颜色面板中调整透明度，并支持 HEX、RGBA、HSL 格式切换。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZColorPicker v-model="color" show-alpha />
          <span>当前颜色: {{ color }}</span>
        </div>
      `,
      `
        ${colorPickerModelDemoScript}

        const color = ref('#8b5cf680')
      `
    )
  },
  {
    variant: 'placement',
    title: '弹出位置',
    description: '与 Popover 共用 placement 体系，支持 12 个方向，并默认根据视口空间自动纠正。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <div class="demo-row">
            <ZColorPicker v-model="color" placement="top-start" :show-input="false" />
            <ZColorPicker v-model="color" placement="top" :show-input="false" />
            <ZColorPicker v-model="color" placement="top-end" :show-input="false" />
            <ZColorPicker v-model="color" placement="bottom-start" :show-input="false" />
            <ZColorPicker v-model="color" placement="bottom" :show-input="false" />
            <ZColorPicker v-model="color" placement="bottom-end" :show-input="false" />
          </div>
        </div>
      `,
      `
        ${colorPickerModelDemoScript}

        const color = ref('#f97316')
      `
    )
  },
  {
    variant: 'disabled',
    title: '禁用',
    description: '禁用后颜色面板和文本输入都不可交互。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZColorPicker model-value="#94a3b8" disabled />
          <ZColorPicker model-value="#64748b" :show-input="false" disabled />
        </div>
      `,
      colorPickerDemoScript
    )
  }
] satisfies readonly VariantDemoConfig<string>[]

const popoverDemoVariants = [
  {
    variant: 'basic',
    title: '基础用法',
    description: '默认使用 hover 触发，适合承载轻量提示和上下文说明。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZPopover show-arrow keep-alive-on-hover>
            <template #trigger>
              <ZButton type="primary">悬停查看</ZButton>
            </template>
            这是一个基础 Popover，可用于补充说明、轻量提示和上下文内容。
          </ZPopover>
          <span>默认触发方式为 hover。</span>
        </div>
      `,
      popoverDemoScript
    )
  },
  {
    variant: 'trigger',
    title: '触发方式',
    description: '支持 hover、click、focus、manual 四种触发模式。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZPopover show-arrow keep-alive-on-hover>
            <template #trigger>
              <ZButton>hover</ZButton>
            </template>
            鼠标移入触发区域时打开。
          </ZPopover>

          <ZPopover trigger="click" show-arrow>
            <template #trigger>
              <ZButton>click</ZButton>
            </template>
            点击触发区域切换显示状态。
          </ZPopover>

          <ZPopover trigger="focus" show-arrow>
            <template #trigger>
              <ZButton>focus</ZButton>
            </template>
            聚焦 trigger 或其内部可聚焦元素时显示。
          </ZPopover>

          <ZPopover trigger="manual" :show="manualShow" show-arrow>
            <template #trigger>
              <ZButton @click="manualShow = !manualShow">manual</ZButton>
            </template>
            手动模式只响应外部 show 状态。
          </ZPopover>
        </div>
      `,
      `
        ${popoverModelDemoScript}

        const manualShow = ref(false)
      `
    )
  },
  {
    variant: 'placement',
    title: '12 个方向',
    description: '通过 placement 控制弹出方向，默认会根据视口空间自动纠正。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column" style="width: min(100%, 640px); gap: 12px;">
          <div
            style="
              display: grid;
              grid-template-columns: repeat(5, minmax(92px, 1fr));
              gap: 12px;
              align-items: center;
            "
          >
            <div aria-hidden="true"></div>
            <ZPopover placement="top-start" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">top-start</button>
              </template>
              当前 placement: top-start
            </ZPopover>
            <ZPopover placement="top" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">top</button>
              </template>
              当前 placement: top
            </ZPopover>
            <ZPopover placement="top-end" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">top-end</button>
              </template>
              当前 placement: top-end
            </ZPopover>
            <div aria-hidden="true"></div>

            <ZPopover placement="left-start" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">left-start</button>
              </template>
              当前 placement: left-start
            </ZPopover>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <ZPopover placement="right-start" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">right-start</button>
              </template>
              当前 placement: right-start
            </ZPopover>

            <ZPopover placement="left" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">left</button>
              </template>
              当前 placement: left
            </ZPopover>
            <div aria-hidden="true"></div>
            <div
              style="
                min-height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed var(--control-border);
                border-radius: 10px;
                color: var(--text-secondary);
                font-size: 12px;
              "
            >
              Popover
            </div>
            <div aria-hidden="true"></div>
            <ZPopover placement="right" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">right</button>
              </template>
              当前 placement: right
            </ZPopover>

            <ZPopover placement="left-end" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">left-end</button>
              </template>
              当前 placement: left-end
            </ZPopover>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <div aria-hidden="true"></div>
            <ZPopover placement="right-end" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">right-end</button>
              </template>
              当前 placement: right-end
            </ZPopover>

            <div aria-hidden="true"></div>
            <ZPopover placement="bottom-start" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">bottom-start</button>
              </template>
              当前 placement: bottom-start
            </ZPopover>
            <ZPopover placement="bottom" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">bottom</button>
              </template>
              当前 placement: bottom
            </ZPopover>
            <ZPopover placement="bottom-end" show-arrow keep-alive-on-hover>
              <template #trigger>
                <button type="button" style="width: 100%; min-height: 40px; padding: 8px 10px;">bottom-end</button>
              </template>
              当前 placement: bottom-end
            </ZPopover>
            <div aria-hidden="true"></div>
          </div>
        </div>
      `,
      popoverOnlyDemoScript
    )
  },
  {
    variant: 'header-footer',
    title: '头部与底部区域',
    description: '通过 header、footer 插槽组织结构化内容，并支持对应 class/style。',
    sourceCode: createDemoSource(
      `
        <ZPopover
          trigger="click"
          show-arrow
          header-class="is-accent"
          :header-style="{ fontWeight: 600 }"
          :footer-style="{ color: 'var(--primary-color)' }"
        >
          <template #trigger>
            <ZButton>打开结构化内容</ZButton>
          </template>
          <template #header>
            标题区域
          </template>
          默认内容区支持任意插槽内容，也可以继续放表单、说明文字或操作入口。
          <template #footer>
            底部区域已应用 footer-style。
          </template>
        </ZPopover>
      `,
      popoverDemoScript
    )
  },
  {
    variant: 'controlled',
    title: '受控显示',
    description: '传入 show 后进入受控模式，通过 update:show 与 clickoutside 管理状态。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZPopover
            trigger="click"
            :show="visible"
            show-arrow
            @update:show="visible = $event"
            @clickoutside="clickoutsideCount += 1"
          >
            <template #trigger>
              <ZButton>{{ visible ? '关闭' : '打开' }}受控浮层</ZButton>
            </template>
            当前显示状态由外部 show 控制，点击外部也会通过事件通知父组件。
          </ZPopover>
          <span>show: {{ visible ? 'true' : 'false' }} / clickoutside: {{ clickoutsideCount }}</span>
        </div>
      `,
      `
        ${popoverModelDemoScript}

        const visible = ref(false)
        const clickoutsideCount = ref(0)
      `
    )
  },
  {
    variant: 'manual-position',
    title: '手动定位',
    description: '同时传入 x 和 y 后，浮层会忽略 trigger 锚点并按视口坐标定位。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <div class="demo-row">
            <ZButton @click="toggleManualPosition">{{ visible ? '关闭' : '打开' }}手动定位</ZButton>
            <button type="button" @click="move">移动位置</button>
          </div>
          <span>x: {{ x }} / y: {{ y }}</span>
          <ZPopover trigger="manual" :show="visible" :x="x" :y="y" show-arrow>
            传入 x 和 y 后，会忽略 trigger 锚点并按视口坐标定位。
          </ZPopover>
        </div>
      `,
      `
        ${popoverModelDemoScript}

        const visible = ref(false)
        const x = ref(220)
        const y = ref(180)

        function toggleManualPosition(): void {
          visible.value = !visible.value
        }

        function move(): void {
          x.value += 24
          y.value += 16
          visible.value = true
        }
      `
    )
  },
  {
    variant: 'width-arrow-overlap',
    title: '宽度、箭头与重叠',
    description: '支持 width="trigger"、固定宽度、show-arrow、overlap 和 to=false。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <div class="demo-row">
            <ZPopover trigger="click" width="trigger" show-arrow>
              <template #trigger>
                <ZButton>width=&quot;trigger&quot;</ZButton>
              </template>
              面板宽度会与触发元素保持一致。
            </ZPopover>

            <ZPopover trigger="click" :width="280" show-arrow>
              <template #trigger>
                <ZButton>固定 280px</ZButton>
              </template>
              也可以直接传入数值宽度。
            </ZPopover>
          </div>

          <ZPopover trigger="click" overlap :to="false" show-arrow>
            <template #trigger>
              <button type="button">overlap + to=false</button>
            </template>
            浮层会留在当前层级渲染，并与触发元素边缘贴合。
          </ZPopover>
        </div>
      `,
      popoverDemoScript
    )
  },
  {
    variant: 'raw-scrollable',
    title: 'Raw 与滚动',
    description: 'raw 模式只保留行为层，scrollable 可为内容区提供滚动能力。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZPopover trigger="click" raw>
            <template #trigger>
              <ZButton>Raw 模式</ZButton>
            </template>
            <div style="width: 240px; padding: 14px 16px; border-radius: 12px; background: var(--control-bg); border: 1px solid var(--control-border);">
              自定义内容
            </div>
          </ZPopover>

          <ZPopover trigger="click" scrollable show-arrow>
            <template #trigger>
              <ZButton>可滚动内容</ZButton>
            </template>
            <template #header>
              更新记录
            </template>
            <div v-for="item in items" :key="item">{{ item }}</div>
            <template #footer>
              滚动不影响 outside click 与浮层交互。
            </template>
          </ZPopover>
        </div>
      `,
      `
        ${popoverModelDemoScript}

        const items = Array.from({ length: 14 }, (_, index) => '滚动内容 ' + (index + 1))
      `
    )
  }
] satisfies readonly VariantDemoConfig<string>[]

const checkboxDemoVariants = [
  {
    variant: 'basic',
    title: '基础用法',
    description: '通过 v-model 管理选中状态，可配合文案或插槽显示标签。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <div class="demo-row">
            <ZCheckbox v-model="checked">启用插件</ZCheckbox>
            <ZCheckbox :model-value="false">未选中</ZCheckbox>
          </div>
          <span>当前值: {{ checked }}</span>
        </div>
      `,
      `
        ${checkboxModelDemoScript}

        const checked = ref(true)
      `
    )
  },
  {
    variant: 'indeterminate',
    title: '半选状态',
    description: 'indeterminate 适合树形或批量选择中的部分选中状态。',
    sourceCode: createDemoSource(
      `
        <ZCheckbox v-model="checked" indeterminate>部分选中</ZCheckbox>
      `,
      `
        ${checkboxModelDemoScript}

        const checked = ref(true)
      `
    )
  },
  {
    variant: 'disabled',
    title: '禁用',
    description: '禁用状态下复选框不可切换。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZCheckbox :model-value="true" disabled>已选禁用</ZCheckbox>
          <ZCheckbox :model-value="false" disabled>未选禁用</ZCheckbox>
        </div>
      `,
      checkboxDemoScript
    )
  }
] satisfies readonly VariantDemoConfig<string>[]

const radioDemoVariants = [
  {
    variant: 'basic',
    title: '基础用法',
    description: '配合同一 name 使用，可通过 v-model 管理当前选中值。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <div class="demo-row">
            <ZRadio v-model="value" name="theme" value="blue">蓝色</ZRadio>
            <ZRadio v-model="value" name="theme" value="purple">紫色</ZRadio>
            <ZRadio v-model="value" name="theme" value="green">绿色</ZRadio>
          </div>
          <span>当前值: {{ value }}</span>
        </div>
      `,
      `
        ${radioModelDemoScript}

        const value = ref('blue')
      `
    )
  },
  {
    variant: 'disabled',
    title: '禁用',
    description: '禁用状态下单选项不可切换。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZRadio model-value="blue" name="disabled-theme" value="blue" disabled>蓝色（禁用）</ZRadio>
          <ZRadio model-value="blue" name="disabled-theme" value="orange" disabled>橙色（禁用）</ZRadio>
        </div>
      `,
      radioDemoScript
    )
  }
] satisfies readonly VariantDemoConfig<string>[]

const switchDemoVariants = [
  {
    variant: 'basic',
    title: '基础用法',
    description: '通过 v-model 绑定开关状态。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZSwitch v-model="enabled" />
          <span>当前值: {{ enabled }}</span>
        </div>
      `,
      `
        ${switchModelDemoScript}

        const enabled = ref(true)
      `
    )
  },
  {
    variant: 'text',
    title: '文字提示',
    description: '通过 activeText 和 inactiveText 展示开关两侧文案。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZSwitch v-model="enabled" active-text="开启" inactive-text="关闭" />
          <span>当前值: {{ enabled }}</span>
        </div>
      `,
      `
        ${switchModelDemoScript}

        const enabled = ref(true)
      `
    )
  },
  {
    variant: 'size',
    title: '尺寸',
    description: '支持 small、medium、large 三种尺寸。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZSwitch :model-value="false" size="small" />
          <ZSwitch :model-value="true" size="medium" />
          <ZSwitch :model-value="true" size="large" />
        </div>
      `,
      switchDemoScript
    )
  },
  {
    variant: 'disabled',
    title: '禁用',
    description: '禁用状态下开关不可切换。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZSwitch :model-value="true" disabled />
          <ZSwitch :model-value="false" disabled />
          <ZSwitch :model-value="true" active-text="开启" inactive-text="关闭" disabled />
        </div>
      `,
      switchDemoScript
    )
  }
] satisfies readonly VariantDemoConfig<string>[]

const selectDemoVariants = [
  {
    variant: 'basic',
    title: '基础用法',
    description: '通过 v-model 绑定当前选中值，options 提供可选项。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZSelect v-model="selected" :options="options" placeholder="选择主题色" />
          <span>当前值: {{ selected }}</span>
        </div>
      `,
      `
        ${selectModelDemoScript}

        const selected = ref('blue')
        const options = [
          { label: '蓝色 (Blue)', value: 'blue' },
          { label: '紫色 (Purple)', value: 'purple' },
          { label: '绿色 (Green)', value: 'green' },
          { label: '橙色 (Orange)', value: 'orange' }
        ]
      `
    )
  },
  {
    variant: 'multiple',
    title: '多选与最大标签数量',
    description: 'multiple 开启多选，maxTagCount 可控制已选标签展示数量。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZSelect v-model="multipleSelected" :options="options" multiple clearable placeholder="选择多个颜色" />
          <ZSelect
            v-model="limitedSelected"
            :options="options"
            multiple
            clearable
            :max-tag-count="2"
            placeholder="最多显示 2 个标签"
          />
          <span>多选值: {{ multipleSelected.join(', ') }}</span>
        </div>
      `,
      `
        ${selectModelDemoScript}

        const multipleSelected = ref<SelectValueType[]>(['blue', 'green', 'orange'])
        const limitedSelected = ref<SelectValueType[]>(['blue', 'purple', 'green', 'orange'])
        const options = [
          { label: '蓝色 (Blue)', value: 'blue' },
          { label: '紫色 (Purple)', value: 'purple' },
          { label: '绿色 (Green)', value: 'green' },
          { label: '橙色 (Orange)', value: 'orange' }
        ]
      `
    )
  },
  {
    variant: 'clearable',
    title: '可清空',
    description: '设置 clearable 后，有选中值时显示清空按钮。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZSelect v-model="selected" :options="options" clearable placeholder="可清空选择" />
          <span>当前值: {{ selected || '未选择' }}</span>
        </div>
      `,
      `
        ${selectModelDemoScript}

        const selected = ref('purple')
        const options = [
          { label: '蓝色 (Blue)', value: 'blue' },
          { label: '紫色 (Purple)', value: 'purple' },
          { label: '绿色 (Green)', value: 'green' }
        ]
      `
    )
  },
  {
    variant: 'size',
    title: '尺寸',
    description: '支持 small、medium、large 三种尺寸。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZSelect v-model="sizeValue" :options="sizeOptions" size="small" />
          <ZSelect v-model="sizeValue" :options="sizeOptions" size="medium" />
          <ZSelect v-model="sizeValue" :options="sizeOptions" size="large" />
        </div>
      `,
      `
        ${selectModelDemoScript}

        const sizeValue = ref('medium')
        const sizeOptions = [
          { label: '小尺寸', value: 'small' },
          { label: '默认尺寸', value: 'medium' },
          { label: '大尺寸', value: 'large' }
        ]
      `
    )
  },
  {
    variant: 'status',
    title: '验证状态',
    description: '可独立展示 success、warning、error 状态和提示文案。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZSelect v-model="value" :options="options" status="success" message="选择可用" placeholder="成功状态" />
          <ZSelect v-model="value" :options="options" status="warning" message="建议确认后选择" placeholder="警告状态" />
          <ZSelect v-model="value" :options="options" status="error" message="请选择一个选项" placeholder="错误状态" />
        </div>
      `,
      `
        ${selectModelDemoScript}

        const value = ref('')
        const options = [
          { label: '蓝色 (Blue)', value: 'blue' },
          { label: '紫色 (Purple)', value: 'purple' },
          { label: '绿色 (Green)', value: 'green' }
        ]
      `
    )
  },
  {
    variant: 'scroll',
    title: '滚动事件',
    description: '下拉菜单滚动时会触发 scroll 事件。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZSelect v-model="scrollValue" :options="longOptions" placeholder="滚动菜单" @scroll="handleScroll" />
          <span>滚动触发次数: {{ scrollCount }}</span>
        </div>
      `,
      `
        ${selectModelDemoScript}

        const scrollValue = ref('option-1')
        const scrollCount = ref(0)
        const longOptions = Array.from({ length: 24 }, (_, index) => ({
          label: '选项 ' + (index + 1),
          value: 'option-' + (index + 1)
        }))

        function handleScroll(): void {
          scrollCount.value += 1
        }
      `
    )
  },
  {
    variant: 'tags',
    title: 'Tag 输入模式',
    description: 'mode="tags" 时允许输入并通过 Enter 创建自定义标签。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <ZSelect
            v-model="tagValues"
            :options="tagOptions"
            mode="tags"
            clearable
            placeholder="输入后按 Enter 创建标签"
          />
          <span>标签: {{ tagValues.join(', ') }}</span>
        </div>
      `,
      `
        ${selectModelDemoScript}

        const tagValues = ref<SelectValueType[]>(['设计', '效率'])
        const tagOptions = [
          { label: '设计', value: '设计' },
          { label: '开发', value: '开发' },
          { label: '效率', value: '效率' },
          { label: '自动化', value: '自动化' }
        ]
      `
    )
  },
  {
    variant: 'placement',
    title: '弹层定位',
    description: '支持与 Popover 一致的 placement 体系，并可通过 autoAdjustPlacement 控制视口边缘自动纠正。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <div class="demo-row">
            <ZSelect v-model="startValue" :options="options" placement="top-start" placeholder="top-start" />
            <ZSelect v-model="centerValue" :options="options" placement="bottom" placeholder="bottom" />
            <ZSelect v-model="endValue" :options="options" placement="top-end" placeholder="top-end" />
          </div>
          <div class="demo-row" style="justify-content: flex-end; width: 100%;">
            <ZSelect v-model="autoAdjustValue" :options="options" placement="right-start" placeholder="自动纠正" />
            <ZSelect
              v-model="fixedPlacementValue"
              :options="options"
              placement="right-start"
              :auto-adjust-placement="false"
              placeholder="保持原方向"
            />
          </div>
        </div>
      `,
      `
        ${selectModelDemoScript}

        const startValue = ref('blue')
        const centerValue = ref('purple')
        const endValue = ref('green')
        const autoAdjustValue = ref('orange')
        const fixedPlacementValue = ref('red')
        const options = [
          { label: '蓝色 (Blue)', value: 'blue' },
          { label: '紫色 (Purple)', value: 'purple' },
          { label: '绿色 (Green)', value: 'green' },
          { label: '橙色 (Orange)', value: 'orange' },
          { label: '红色 (Red)', value: 'red' }
        ]
      `
    )
  }
] satisfies readonly VariantDemoConfig<string>[]

const tagDemoVariants = [
  {
    variant: 'type',
    title: '类型',
    description: '使用不同 type 展示分类、状态或提示语义。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZTag>默认标签</ZTag>
          <ZTag type="primary">主要标签</ZTag>
          <ZTag type="success">成功标签</ZTag>
          <ZTag type="warning">警告标签</ZTag>
          <ZTag type="danger">危险标签</ZTag>
          <ZTag type="info">信息标签</ZTag>
        </div>
      `,
      tagDemoScript
    )
  },
  {
    variant: 'size',
    title: '尺寸',
    description: '支持 small、medium、large 三种尺寸。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZTag size="small">小标签</ZTag>
          <ZTag size="medium" type="primary">中标签</ZTag>
          <ZTag size="large" type="success">大标签</ZTag>
        </div>
      `,
      tagDemoScript
    )
  },
  {
    variant: 'round',
    title: '圆角',
    description: '设置 round 后标签呈胶囊形状。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZTag round>圆角标签</ZTag>
          <ZTag round type="primary">主要标签</ZTag>
          <ZTag round type="success">成功标签</ZTag>
        </div>
      `,
      tagDemoScript
    )
  },
  {
    variant: 'closable',
    title: '可关闭',
    description: '设置 closable 后显示关闭按钮，并通过 close 事件处理移除逻辑。',
    sourceCode: createDemoSource(
      `
        <div class="demo-column">
          <div class="demo-row">
            <ZTag v-if="visible" closable type="primary" @close="visible = false">可关闭标签</ZTag>
            <ZTag closable type="warning">警告标签</ZTag>
          </div>
          <button v-if="!visible" type="button" @click="visible = true">重新显示</button>
        </div>
      `,
      `
        ${tagModelDemoScript}

        const visible = ref(true)
      `
    )
  },
  {
    variant: 'disabled',
    title: '禁用',
    description: '禁用状态下降低视觉权重并阻止点击与关闭事件。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ZTag disabled>默认禁用</ZTag>
          <ZTag type="primary" disabled>主要禁用</ZTag>
          <ZTag closable type="danger" disabled>关闭禁用</ZTag>
        </div>
      `,
      tagDemoScript
    )
  }
] satisfies readonly VariantDemoConfig<string>[]

function getSfcSourceBlock(source: string, tag: SfcSourceBlock['tag']): SfcSourceBlock | undefined {
  const openPattern = new RegExp(`^<${tag}\\b([^>]*)>`, 'im')
  const openMatch = openPattern.exec(source)
  if (!openMatch) return undefined

  const contentStart = openMatch.index + openMatch[0].length
  const closePattern = new RegExp(`^</${tag}>`, 'im')
  const closeMatch = closePattern.exec(source.slice(contentStart))
  if (!closeMatch) return undefined

  return {
    tag,
    attrs: openMatch[1],
    content: source.slice(contentStart, contentStart + closeMatch.index)
  }
}

function getSfcSourceBlocks(source: string): SfcSourceBlock[] {
  return [getSfcSourceBlock(source, 'template'), getSfcSourceBlock(source, 'script')].filter(
    (block): block is SfcSourceBlock => Boolean(block)
  )
}

function formatSfcSourceBlock(block: SfcSourceBlock): string {
  const content = block.tag === 'template' ? indentCodeBlock(block.content) : trimCodeBlock(block.content)

  return `<${block.tag}${block.attrs}>\n${content}\n</${block.tag}>`
}

function normalizeDemoSource(source: string | undefined): string | undefined {
  const trimmedSource = source?.trim()
  if (!trimmedSource) return undefined

  const displaySource = trimmedSource.replace(/(['"])ztools-ui-components\/[^'"]+\1/g, '$1ztools-ui$1')
  const blocks = getSfcSourceBlocks(displaySource)
  if (!blocks.length) return displaySource

  return [
    ...blocks.filter((block) => block.tag === 'template'),
    ...blocks.filter((block) => block.tag === 'script')
  ]
    .map(formatSfcSourceBlock)
    .join('\n\n')
}

const normalizedDemoSourceCache = new Map<string, string | undefined>()

function resolveNormalizedDemoSource(source: string | undefined): string | undefined {
  if (!source) return undefined

  const cachedSource = normalizedDemoSourceCache.get(source)
  if (cachedSource !== undefined || normalizedDemoSourceCache.has(source)) {
    return cachedSource
  }

  const normalizedSource = normalizeDemoSource(source)
  normalizedDemoSourceCache.set(source, normalizedSource)
  return normalizedSource
}

function createVariantDemos<TVariant extends string>(
  component: Component,
  configs: readonly VariantDemoConfig<TVariant>[]
): ComponentDemo[] {
  return configs.map(({ variant, title, description, sourceCode, props }) => {
    const demo: ComponentDemo = {
      title,
      component,
      componentProps: { variant, ...props },
      sourceCode
    }

    if (description) {
      demo.description = description
    }

    return demo
  })
}

function resolveDemoSource(demo: ComponentDemo): string | undefined {
  return resolveNormalizedDemoSource(demo.sourceCode ?? componentDemoSources.get(demo.component))
}

// API 属性
export interface ApiProp {
  name: string
  type: string
  default?: string
  description: string
  since?: string
  required?: boolean
}

// API Slot
export interface ApiSlot {
  name: string
  description: string
  since?: string
}

// API 事件
export interface ApiEmit {
  name: string
  signature: string
  description: string
  since?: string
}

// 组件 API 信息
export interface ComponentApi {
  props?: ApiProp[]
  slots?: ApiSlot[]
  emits?: ApiEmit[]
}

// 组件文档元数据
export interface ComponentDocMeta {
  id: string
  group: string
  zhName: string
  enName: string
  description: string
  demos: ComponentDemo[]
  api: ComponentApi
}

// 所有组件文档元数据
export const componentDocs: Record<string, ComponentDocMeta> = {
  button: {
    id: 'button',
    group: 'input',
    zhName: '按钮',
    enName: 'Button',
    description: '通用按钮组件，支持多种类型、尺寸、loading 与块级布局。',
    demos: createVariantDemos(ButtonDemo, buttonDemoVariants),
    api: {
      props: [
        {
          name: 'type',
          type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'text'",
          default: 'default',
          description: '按钮类型',
          since: '1.0.0'
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          default: 'medium',
          description: '按钮尺寸',
          since: '1.0.0'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: '是否禁用',
          since: '1.0.0'
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: '是否显示加载状态',
          since: '1.0.0'
        },
        {
          name: 'nativeType',
          type: "'button' | 'submit' | 'reset'",
          default: 'button',
          description: '原生 button 的 type 属性',
          since: '1.0.0'
        },
        {
          name: 'block',
          type: 'boolean',
          default: 'false',
          description: '是否占满整行宽度',
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'default',
          description: '按钮内容',
          since: '1.0.0'
        },
        {
          name: 'icon',
          description: '按钮图标区域',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'click',
          signature: '(event: MouseEvent) => void',
          description: '点击按钮时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  input: {
    id: 'input',
    group: 'input',
    zhName: '输入框',
    enName: 'Input',
    description: '通用文本输入框，支持 textarea、clearable、验证状态、字数统计、尺寸和前后缀插槽。',
    demos: createVariantDemos(InputDemo, inputDemoVariants),
    api: {
      props: [
        {
          name: 'modelValue',
          type: 'string | number',
          description: '输入框当前值',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'type',
          type: "'text' | 'password' | 'number' | 'email' | 'url' | 'tel' | 'search' | 'textarea'",
          default: 'text',
          description: '原生输入类型',
          since: '1.0.0'
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '',
          description: '占位文本',
          since: '1.0.0'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: '是否禁用',
          since: '1.0.0'
        },
        {
          name: 'readonly',
          type: 'boolean',
          default: 'false',
          description: '是否只读',
          since: '1.0.0'
        },
        {
          name: 'clearable',
          type: 'boolean',
          default: 'false',
          description: '是否显示清空按钮',
          since: '1.0.0'
        },
        {
          name: 'maxlength',
          type: 'number',
          description: '原生最大长度限制',
          since: '1.0.0'
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          default: 'medium',
          description: '输入框尺寸',
          since: '1.0.0'
        },
        {
          name: 'status',
          type: "'success' | 'warning' | 'error'",
          description: '验证状态，可脱离表单独立使用',
          since: '1.0.0'
        },
        {
          name: 'message',
          type: 'string',
          default: '',
          description: '验证状态提示文案',
          since: '1.0.0'
        },
        {
          name: 'showWordLimit',
          type: 'boolean',
          default: 'false',
          description: '是否显示字数统计',
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'prefix',
          description: '输入框前缀内容',
          since: '1.0.0'
        },
        {
          name: 'suffix',
          description: '输入框后缀内容',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:modelValue',
          signature: '(value: string | number) => void',
          description: '输入值变化时触发',
          since: '1.0.0'
        },
        {
          name: 'change',
          signature: '(value: string | number) => void',
          description: 'change 事件触发时同步当前值',
          since: '1.0.0'
        },
        {
          name: 'input',
          signature: '(value: string | number) => void',
          description: 'input 事件触发时返回当前值',
          since: '1.0.0'
        },
        {
          name: 'clear',
          signature: '() => void',
          description: '点击清空按钮时触发',
          since: '1.0.0'
        },
        {
          name: 'focus',
          signature: '(event: FocusEvent) => void',
          description: '输入框获得焦点时触发',
          since: '1.0.0'
        },
        {
          name: 'blur',
          signature: '(event: FocusEvent) => void',
          description: '输入框失去焦点时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  'color-picker': {
    id: 'color-picker',
    group: 'input',
    zhName: '颜色选择器',
    enName: 'ColorPicker',
    description: '颜色面板选择器，支持文本输入联动、透明通道，以及与 Popover 一致的 12 方位弹层定位。',
    demos: createVariantDemos(ColorPickerDemo, colorPickerDemoVariants),
    api: {
      props: [
        {
          name: 'modelValue',
          type: 'string',
          description: '当前颜色值，推荐使用十六进制色值',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: '是否禁用',
          since: '1.0.0'
        },
        {
          name: 'showInput',
          type: 'boolean',
          default: 'true',
          description: '是否显示右侧文本输入框',
          since: '1.0.0'
        },
        {
          name: 'showAlpha',
          type: 'boolean',
          default: 'false',
          description: '是否在颜色面板中显示透明通道控制，支持 HEX、RGBA、HSL 格式',
          since: '1.0.0'
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '#000000',
          description: '文本输入框占位内容',
          since: '1.0.0'
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          default: 'medium',
          description: '选择器尺寸',
          since: '1.0.0'
        },
        {
          name: 'placement',
          type: "'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end'",
          default: 'bottom-start',
          description: '颜色面板弹出位置，取值与 Popover 的 placement 完全一致',
          since: '1.0.0'
        },
        {
          name: 'autoAdjustPlacement',
          type: 'boolean',
          default: 'true',
          description: '是否根据视口空间自动翻转或修正颜色面板位置；关闭后始终按 placement 原值定位',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:modelValue',
          signature: '(value: string) => void',
          description: '颜色值变化时触发',
          since: '1.0.0'
        },
        {
          name: 'change',
          signature: '(value: string) => void',
          description: '颜色值提交变化时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  checkbox: {
    id: 'checkbox',
    group: 'input',
    zhName: '复选框',
    enName: 'Checkbox',
    description: '基础复选框控件，支持 disabled 和 indeterminate 状态。',
    demos: createVariantDemos(CheckboxDemo, checkboxDemoVariants),
    api: {
      props: [
        {
          name: 'modelValue',
          type: 'boolean',
          description: '是否选中',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'label',
          type: 'string',
          description: '默认标签文本',
          since: '1.0.0'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: '是否禁用',
          since: '1.0.0'
        },
        {
          name: 'indeterminate',
          type: 'boolean',
          default: 'false',
          description: '是否显示半选状态',
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'default',
          description: '复选框标签内容',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:modelValue',
          signature: '(value: boolean) => void',
          description: '选中状态变化时触发',
          since: '1.0.0'
        },
        {
          name: 'change',
          signature: '(value: boolean) => void',
          description: '选中状态变化时触发（与 update:modelValue 同时触发）',
          since: '1.0.0'
        }
      ]
    }
  },

  radio: {
    id: 'radio',
    group: 'input',
    zhName: '单选框',
    enName: 'Radio',
    description: '基础单选框控件，适用于同组选项互斥选择。',
    demos: createVariantDemos(RadioDemo, radioDemoVariants),
    api: {
      props: [
        {
          name: 'modelValue',
          type: 'string | number | boolean',
          description: '当前选中值',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'value',
          type: 'string | number | boolean',
          description: '当前单选项代表的值',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'label',
          type: 'string',
          description: '默认标签文本',
          since: '1.0.0'
        },
        {
          name: 'name',
          type: 'string',
          description: '原生 radio 分组名',
          since: '1.0.0'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: '是否禁用',
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'default',
          description: '单选框标签内容',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:modelValue',
          signature: '(value: string | number | boolean) => void',
          description: '选中值变化时触发',
          since: '1.0.0'
        },
        {
          name: 'change',
          signature: '(value: string | number | boolean) => void',
          description: '选中值变化时触发（与 update:modelValue 同时触发）',
          since: '1.0.0'
        }
      ]
    }
  },

  switch: {
    id: 'switch',
    group: 'input',
    zhName: '开关',
    enName: 'Switch',
    description: '基础开关控件，支持文字提示和多种尺寸。',
    demos: createVariantDemos(SwitchDemo, switchDemoVariants),
    api: {
      props: [
        {
          name: 'modelValue',
          type: 'boolean',
          description: '当前开关值',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: '是否禁用',
          since: '1.0.0'
        },
        {
          name: 'activeText',
          type: 'string',
          description: '开启状态文案',
          since: '1.0.0'
        },
        {
          name: 'inactiveText',
          type: 'string',
          description: '关闭状态文案',
          since: '1.0.0'
        },
        {
          name: 'activeValue',
          type: 'boolean',
          default: 'true',
          description: '开启时对应的值',
          since: '1.0.0'
        },
        {
          name: 'inactiveValue',
          type: 'boolean',
          default: 'false',
          description: '关闭时对应的值',
          since: '1.0.0'
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          default: 'medium',
          description: '开关尺寸',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:modelValue',
          signature: '(value: boolean) => void',
          description: '开关值变化时触发',
          since: '1.0.0'
        },
        {
          name: 'change',
          signature: '(value: boolean) => void',
          description: '开关值变化时触发（与 update:modelValue 同时触发）',
          since: '1.0.0'
        }
      ]
    }
  },

  select: {
    id: 'select',
    group: 'input',
    zhName: '选择器',
    enName: 'Select',
    description: '用于从一组选项中选择值的选择器，支持单选、多选、可清空、验证状态和 tag 输入模式。',
    demos: createVariantDemos(SelectDemo, selectDemoVariants),
    api: {
      props: [
        {
          name: 'modelValue',
          type: 'string | number | Array<string | number>',
          description: '当前选中的值，多选和 tag 输入模式下为数组',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'options',
          type: 'SelectOption[]',
          description: '选项列表，每项包含 label、value，可通过 disabled 禁用单项',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '请选择',
          description: '未选择时的占位文本',
          since: '1.0.0'
        },
        {
          name: 'multiple',
          type: 'boolean',
          default: 'false',
          description: '是否启用多选模式',
          since: '1.0.0'
        },
        {
          name: 'clearable',
          type: 'boolean',
          default: 'false',
          description: '是否显示清空按钮',
          since: '1.0.0'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: '是否禁用选择器',
          since: '1.0.0'
        },
        {
          name: 'readonly',
          type: 'boolean',
          default: 'false',
          description: '是否只读',
          since: '1.0.0'
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          default: 'medium',
          description: '选择器尺寸',
          since: '1.0.0'
        },
        {
          name: 'status',
          type: "'success' | 'warning' | 'error'",
          description: '验证状态',
          since: '1.0.0'
        },
        {
          name: 'message',
          type: 'string',
          default: "''",
          description: '验证提示信息',
          since: '1.0.0'
        },
        {
          name: 'maxTagCount',
          type: 'number',
          description: '多选或 tag 输入模式下最多展示的标签数量，剩余显示为 +N',
          since: '1.0.0'
        },
        {
          name: 'mode',
          type: "'default' | 'tags'",
          default: 'default',
          description: '选择器模式，tags 模式允许输入并创建自定义标签',
          since: '1.0.0'
        },
        {
          name: 'placement',
          type: "'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end'",
          default: 'bottom-start',
          description: '下拉菜单弹出位置，默认会根据视口空间自动纠正',
          since: '1.0.0'
        },
        {
          name: 'autoAdjustPlacement',
          type: 'boolean',
          default: 'true',
          description: '是否根据视口空间自动翻转或修正下拉菜单位置',
          since: '1.0.0'
        },
        {
          name: 'to',
          type: 'string | HTMLElement | false',
          default: 'body',
          description: 'Teleport 目标，设为 false 时菜单留在原位置渲染',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:modelValue',
          signature: '(value: string | number | Array<string | number>) => void',
          description: '选中值变化时触发',
          since: '1.0.0'
        },
        {
          name: 'change',
          signature: '(value: string | number | Array<string | number>) => void',
          description: '选中值变化时触发（与 update:modelValue 同时触发）',
          since: '1.0.0'
        },
        {
          name: 'clear',
          signature: '() => void',
          description: '点击清空按钮时触发',
          since: '1.0.0'
        },
        {
          name: 'scroll',
          signature: '(event: Event) => void',
          description: '下拉菜单滚动时触发',
          since: '1.0.0'
        },
        {
          name: 'visible-change',
          signature: '(visible: boolean) => void',
          description: '下拉菜单显示状态变化时触发',
          since: '1.0.0'
        },
        {
          name: 'tag-create',
          signature: '(value: string) => void',
          description: 'tag 输入模式创建自定义标签时触发',
          since: '1.0.0'
        },
        {
          name: 'tag-remove',
          signature: '(value: string | number) => void',
          description: '移除已选标签时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  slider: {
    id: 'slider',
    group: 'input',
    zhName: '滑块',
    enName: 'Slider',
    description: '用于在数值范围内选择值的滑块控件，支持自定义步长和格式化显示。',
    demos: [
      {
        title: '基础用法',
        description: '通过 v-model 绑定数值，使用 min、max、step 配置范围和步长。',
        component: SliderDemo
      }
    ],
    api: {
      props: [
        {
          name: 'modelValue',
          type: 'number',
          description: '当前值',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'min',
          type: 'number',
          default: '0',
          description: '最小值',
          since: '1.0.0'
        },
        {
          name: 'max',
          type: 'number',
          default: '100',
          description: '最大值',
          since: '1.0.0'
        },
        {
          name: 'step',
          type: 'number',
          default: '1',
          description: '步长',
          since: '1.0.0'
        },
        {
          name: 'formatter',
          type: '(value: number) => string',
          default: '(value) => Math.round(value)',
          description: '格式化显示值的函数',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:modelValue',
          signature: '(value: number) => void',
          description: '值变化时触发',
          since: '1.0.0'
        },
        {
          name: 'change',
          signature: '(value: number) => void',
          description: '值变化时触发（与 update:modelValue 同时触发）',
          since: '1.0.0'
        }
      ]
    }
  },

  'hotkey-input': {
    id: 'hotkey-input',
    group: 'input',
    zhName: '快捷键录制',
    enName: 'HotkeyInput',
    description: '用于录制和显示快捷键的输入框，支持跨平台显示和双击修饰键录制。',
    demos: [
      {
        title: '基础用法',
        description: '点击输入框开始录制快捷键，支持组合键和双击修饰键。',
        component: HotkeyInputDemo
      }
    ],
    api: {
      props: [
        {
          name: 'modelValue',
          type: 'string',
          description: '当前快捷键字符串，如 "Command+Shift+A" 或 "Command+Command"',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '点击录制快捷键',
          description: '未录制时的占位文本',
          since: '1.0.0'
        },
        {
          name: 'platform',
          type: "'darwin' | 'win32' | 'linux'",
          default: 'darwin',
          description: '平台标识，用于显示正确的修饰键名称（如 macOS 显示 Command，Windows 显示 Ctrl）',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:modelValue',
          signature: '(value: string) => void',
          description: '快捷键变化时触发',
          since: '1.0.0'
        },
        {
          name: 'change',
          signature: '(value: string) => void',
          description: '快捷键变化时触发（与 update:modelValue 同时触发）',
          since: '1.0.0'
        }
      ]
    }
  },

  tag: {
    id: 'tag',
    group: 'display',
    zhName: '标签',
    enName: 'Tag',
    description: '轻量标签组件，支持状态色、尺寸、圆角和可关闭模式。',
    demos: createVariantDemos(TagDemo, tagDemoVariants),
    api: {
      props: [
        {
          name: 'type',
          type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'",
          default: 'default',
          description: '标签类型',
          since: '1.0.0'
        },
        {
          name: 'size',
          type: "'small' | 'medium' | 'large'",
          default: 'medium',
          description: '标签尺寸',
          since: '1.0.0'
        },
        {
          name: 'closable',
          type: 'boolean',
          default: 'false',
          description: '是否显示关闭按钮',
          since: '1.0.0'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: '是否禁用',
          since: '1.0.0'
        },
        {
          name: 'round',
          type: 'boolean',
          default: 'false',
          description: '是否使用圆角胶囊样式',
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'default',
          description: '标签内容',
          since: '1.0.0'
        },
        {
          name: 'icon',
          description: '标签图标区域',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'close',
          signature: '(event: MouseEvent) => void',
          description: '点击关闭按钮时触发',
          since: '1.0.0'
        },
        {
          name: 'click',
          signature: '(event: MouseEvent) => void',
          description: '点击标签时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  'command-card': {
    id: 'command-card',
    group: 'display',
    zhName: '指令卡片',
    enName: 'CommandCard',
    description: '用于展示指令信息的卡片组件，支持图标懒加载和自定义操作按钮。',
    demos: [
      {
        title: '基础用法',
        description: '传入 command 对象即可显示指令卡片，图标会自动懒加载。',
        component: CommandCardDemo
      }
    ],
    api: {
      props: [
        {
          name: 'command',
          type: 'Command',
          description: '指令对象，包含 name、icon、path、subType 等属性',
          required: true,
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'meta',
          description: '自定义元信息区域（默认显示 path、category 等信息）',
          since: '1.0.0'
        },
        {
          name: 'action',
          description: '自定义操作按钮区域（hover 时显示）',
          since: '1.0.0'
        }
      ]
    }
  },

  'command-tag': {
    id: 'command-tag',
    group: 'display',
    zhName: '指令标签',
    enName: 'CommandTag',
    description: '用于展示指令类型的小标签，支持多种指令类型样式。',
    demos: [
      {
        title: '基础用法',
        description: '根据 command 对象自动渲染对应类型的标签样式。',
        component: CommandTagDemo
      }
    ],
    api: {
      props: [
        {
          name: 'command',
          type: 'Command',
          description: '指令对象，包含 type、name、match 等属性',
          since: '1.0.0'
        },
        {
          name: 'type',
          type: "'text' | 'regex' | 'over'",
          description: '手动指定标签类型（优先级低于 command.type）',
          since: '1.0.0'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: '是否禁用状态',
          since: '1.0.0'
        },
        {
          name: 'showArrow',
          type: 'boolean',
          default: 'false',
          description: '是否显示下拉箭头',
          since: '1.0.0'
        }
      ]
    }
  },

  'feature-card': {
    id: 'feature-card',
    group: 'display',
    zhName: '功能卡片',
    enName: 'FeatureCard',
    description: '用于展示插件功能的卡片组件，支持图标懒加载和指令标签排列。',
    demos: [
      {
        title: '基础用法',
        description: '传入 feature 对象和指令标签子组件即可显示功能卡片。',
        component: FeatureCardDemo
      }
    ],
    api: {
      props: [
        {
          name: 'feature',
          type: 'Feature',
          description: '功能对象，包含 name、code、explain、icon 等属性',
          required: true,
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'default',
          description: '指令标签列表区域',
          since: '1.0.0'
        }
      ]
    }
  },

  'adaptive-icon': {
    id: 'adaptive-icon',
    group: 'display',
    zhName: '自适应图标',
    enName: 'AdaptiveIcon',
    description: '能够根据主题自动反色的图标组件，支持懒加载和图标分析。',
    demos: [
      {
        title: '基础用法',
        description: '传入图标 src 即可自动适配暗色/亮色主题。',
        component: AdaptiveIconDemo
      }
    ],
    api: {
      props: [
        {
          name: 'src',
          type: 'string',
          description: '图标 URL',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'alt',
          type: 'string',
          description: '替代文本',
          since: '1.0.0'
        },
        {
          name: 'forceAdaptive',
          type: 'boolean',
          default: 'false',
          description: '强制启用自适应模式（跳过图标分析）',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'error',
          signature: '(event: Event) => void',
          description: '图标加载失败时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  toast: {
    id: 'toast',
    group: 'feedback',
    zhName: '轻提示',
    enName: 'Toast',
    description: '用于显示临时消息的全局提示组件，支持多种类型和自动关闭。',
    demos: [
      {
        title: '基础用法',
        description: '通过 useToast 组合式函数调用，支持 success、error、warning、info 四种类型。',
        component: ToastDemo
      }
    ],
    api: {
      props: [
        {
          name: 'message',
          type: 'string',
          description: '提示内容',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'type',
          type: "'success' | 'error' | 'warning' | 'info'",
          default: 'info',
          description: '提示类型',
          since: '1.0.0'
        },
        {
          name: 'duration',
          type: 'number',
          default: '3000',
          description: '显示时长（毫秒），设为 0 则不自动关闭',
          since: '1.0.0'
        },
        {
          name: 'visible',
          type: 'boolean',
          default: 'false',
          description: '是否显示（通常通过 useToast 控制，无需手动设置）',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:visible',
          signature: '(value: boolean) => void',
          description: '显示状态变化时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  'confirm-dialog': {
    id: 'confirm-dialog',
    group: 'feedback',
    zhName: '确认弹窗',
    enName: 'ConfirmDialog',
    description: '用于需要用户确认的操作弹窗，支持多种确认类型。',
    demos: [
      {
        title: '基础用法',
        description: '通过 v-model:visible 控制显示，type 控制确认按钮样式。',
        component: ConfirmDialogDemo
      }
    ],
    api: {
      props: [
        {
          name: 'visible',
          type: 'boolean',
          description: '是否显示弹窗',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'title',
          type: 'string',
          default: '确认操作',
          description: '弹窗标题',
          since: '1.0.0'
        },
        {
          name: 'message',
          type: 'string',
          description: '弹窗提示内容',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'type',
          type: "'info' | 'warning' | 'danger'",
          default: 'info',
          description: '确认类型，影响图标和确认按钮样式',
          since: '1.0.0'
        },
        {
          name: 'confirmText',
          type: 'string',
          default: '确定',
          description: '确认按钮文本',
          since: '1.0.0'
        },
        {
          name: 'cancelText',
          type: 'string',
          default: '取消',
          description: '取消按钮文本',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:visible',
          signature: '(value: boolean) => void',
          description: '显示状态变化时触发',
          since: '1.0.0'
        },
        {
          name: 'confirm',
          signature: '() => void',
          description: '点击确认按钮时触发',
          since: '1.0.0'
        },
        {
          name: 'cancel',
          signature: '() => void',
          description: '点击取消按钮或遮罩时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  popover: {
    id: 'popover',
    group: 'feedback',
    zhName: '浮层',
    enName: 'Popover',
    description: '通用浮层组件，支持 trigger 插槽触发、受控显示、12 个方向定位、Teleport 和结构化内容区域。',
    demos: createVariantDemos(PopoverDemo, popoverDemoVariants),
    api: {
      props: [
        {
          name: 'trigger',
          type: "'hover' | 'click' | 'focus' | 'manual'",
          default: 'hover',
          description: '触发方式，manual 模式下仅响应外部 show 状态',
          since: '1.0.0'
        },
        {
          name: 'show',
          type: 'boolean',
          description: '受控显示状态，传入后组件不再维护内部显示状态',
          since: '1.0.0'
        },
        {
          name: 'placement',
          type: "'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end'",
          default: 'top',
          description: '浮层弹出方向，默认会结合视口空间自动纠正',
          since: '1.0.0'
        },
        {
          name: 'overlap',
          type: 'boolean',
          default: 'false',
          description: '是否让浮层与触发元素边缘重叠贴合',
          since: '1.0.0'
        },
        {
          name: 'raw',
          type: 'boolean',
          default: 'false',
          description: '是否关闭默认卡片样式，仅保留浮层行为与定位',
          since: '1.0.0'
        },
        {
          name: 'scrollable',
          type: 'boolean',
          default: 'false',
          description: '是否为默认内容区启用滚动容器',
          since: '1.0.0'
        },
        {
          name: 'showArrow',
          type: 'boolean',
          default: 'false',
          description: '是否显示指向触发元素的箭头',
          since: '1.0.0'
        },
        {
          name: 'to',
          type: 'string | HTMLElement | false',
          default: 'body',
          description: 'Teleport 目标，设为 false 时内容留在原位置渲染',
          since: '1.0.0'
        },
        {
          name: 'width',
          type: "number | 'trigger'",
          description: '浮层宽度，可传固定宽度或跟随 trigger 宽度',
          since: '1.0.0'
        },
        {
          name: 'x',
          type: 'number',
          description: '手动定位时的横向视口坐标，需要与 y 一起使用',
          since: '1.0.0'
        },
        {
          name: 'y',
          type: 'number',
          description: '手动定位时的纵向视口坐标，需要与 x 一起使用',
          since: '1.0.0'
        },
        {
          name: 'zIndex',
          type: 'number',
          default: '10000',
          description: '浮层的 z-index',
          since: '1.0.0'
        },
        {
          name: 'keepAliveOnHover',
          type: 'boolean',
          default: 'false',
          description: 'hover 模式下鼠标从 trigger 移入 panel 时是否保持显示',
          since: '1.0.0'
        },
        {
          name: 'headerClass',
          type: 'string',
          description: 'header 区域容器类名',
          since: '1.0.0'
        },
        {
          name: 'headerStyle',
          type: 'string | Record<string, string | number>',
          description: 'header 区域容器样式',
          since: '1.0.0'
        },
        {
          name: 'footerClass',
          type: 'string',
          description: 'footer 区域容器类名',
          since: '1.0.0'
        },
        {
          name: 'footerStyle',
          type: 'string | Record<string, string | number>',
          description: 'footer 区域容器样式',
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'trigger',
          description: '触发浮层的元素内容',
          since: '1.0.0'
        },
        {
          name: 'header',
          description: '可选头部区域',
          since: '1.0.0'
        },
        {
          name: 'default',
          description: '浮层主体内容',
          since: '1.0.0'
        },
        {
          name: 'footer',
          description: '可选底部区域',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:show',
          signature: '(value: boolean) => void',
          description: '显示状态变化时触发',
          since: '1.0.0'
        },
        {
          name: 'clickoutside',
          signature: '(event: PointerEvent) => void',
          description: '点击浮层外部区域时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  'tag-dropdown': {
    id: 'tag-dropdown',
    group: 'feedback',
    zhName: '标签下拉菜单',
    enName: 'TagDropdown',
    description: '可包裹任意内容的下拉菜单组件，常用于标签后的更多操作。',
    demos: [
      {
        title: '基础用法',
        description: '包裹标签组件，配置 menuItems 即可实现下拉菜单。',
        component: TagDropdownDemo
      }
    ],
    api: {
      props: [
        {
          name: 'menuItems',
          type: 'TagDropdownMenuItem[]',
          description: '菜单项列表，每项包含 key、label、icon、danger',
          required: true,
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'default',
          description: '触发下拉菜单的内容（通常是标签）',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'select',
          signature: '(key: string) => void',
          description: '选择菜单项时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  'detail-panel': {
    id: 'detail-panel',
    group: 'host',
    zhName: '详情面板',
    enName: 'DetailPanel',
    description: '覆盖式详情面板组件，带顶部返回栏和可滚动内容区。',
    demos: [
      {
        title: '基础用法',
        description: '传入 title 和 @back 事件，通过插槽放置内容。',
        component: DetailPanelDemo
      }
    ],
    api: {
      props: [
        {
          name: 'title',
          type: 'string',
          description: '面板标题',
          required: true,
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'header-right',
          description: '顶部栏右侧操作区',
          since: '1.0.0'
        },
        {
          name: 'default',
          description: '主要内容区域',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'back',
          signature: '() => void',
          description: '点击返回按钮时触发',
          since: '1.0.0'
        }
      ]
    }
  },

  'shortcut-editor': {
    id: 'shortcut-editor',
    group: 'host',
    zhName: '快捷键编辑',
    enName: 'ShortcutEditor',
    description: '快捷键编辑面板，集成于 DetailPanel 中。',
    demos: [
      {
        title: '基础用法',
        description: '通常配合 DetailPanel 使用，提供快捷键录制和目标指令配置。',
        component: ShortcutEditorDemo
      }
    ],
    api: {
      props: [
        {
          name: 'editingShortcut',
          type: 'GlobalShortcut | null',
          description: '正在编辑的快捷键对象，为 null 时表示新增模式',
          since: '1.0.0'
        },
        {
          name: 'prefillTarget',
          type: 'string',
          description: '预填充的目标指令',
          since: '1.0.0'
        },
        {
          name: 'isAppShortcut',
          type: 'boolean',
          default: 'false',
          description: '是否为应用快捷键（而非全局快捷键）',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'back',
          signature: '() => void',
          description: '取消或点击返回时触发',
          since: '1.0.0'
        },
        {
          name: 'save',
          signature: '(shortcut: string, target: string) => void',
          description: '保存时触发，返回快捷键和目标指令',
          since: '1.0.0'
        }
      ]
    }
  },

  'plugin-detail': {
    id: 'plugin-detail',
    group: 'host',
    zhName: '插件详情',
    enName: 'PluginDetail',
    description: '用于展示插件详细信息的大组件，包含头部、标签页、数据管理等。',
    demos: [
      {
        title: '基础用法',
        description: '传入 plugin 对象和相关状态，组件会自动渲染完整的插件详情页。',
        component: PluginDetailDemo
      }
    ],
    api: {
      props: [
        {
          name: 'plugin',
          type: 'PluginItem',
          description: '插件对象，包含 name、title、version、description、logo、features 等',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: '是否正在加载',
          since: '1.0.0'
        },
        {
          name: 'isRunning',
          type: 'boolean',
          default: 'false',
          description: '插件是否正在运行',
          since: '1.0.0'
        },
        {
          name: 'isPinned',
          type: 'boolean',
          default: 'false',
          description: '是否已置顶',
          since: '1.0.0'
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          default: 'false',
          description: '是否已禁用',
          since: '1.0.0'
        },
        {
          name: 'showPinButton',
          type: 'boolean',
          default: 'false',
          description: '是否显示置顶按钮',
          since: '1.0.0'
        },
        {
          name: 'showDisableToggle',
          type: 'boolean',
          default: 'false',
          description: '是否显示禁用开关',
          since: '1.0.0'
        },
        {
          name: 'showComments',
          type: 'boolean',
          default: 'false',
          description: '是否显示留言标签',
          since: '1.0.0'
        },
        {
          name: 'showSize',
          type: 'boolean',
          default: 'false',
          description: '是否显示插件大小',
          since: '1.0.0'
        }
      ],
      slots: [
        {
          name: 'extra-tabs',
          description: '额外标签页内容（如留言）',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'back',
          signature: '() => void',
          description: '返回时触发',
          since: '1.0.0'
        },
        {
          name: 'open',
          signature: '() => void',
          description: '打开插件时触发',
          since: '1.0.0'
        },
        {
          name: 'download',
          signature: '() => void',
          description: '下载插件时触发',
          since: '1.0.0'
        },
        {
          name: 'upgrade',
          signature: '() => void',
          description: '升级插件时触发',
          since: '1.0.0'
        },
        {
          name: 'uninstall',
          signature: '() => void',
          description: '卸载插件时触发',
          since: '1.0.0'
        },
        {
          name: 'kill',
          signature: '() => void',
          description: '终止插件时触发',
          since: '1.0.0'
        },
        {
          name: 'open-folder',
          signature: '() => void',
          description: '打开插件文件夹时触发',
          since: '1.0.0'
        },
        {
          name: 'toggle-pin',
          signature: '() => void',
          description: '切换置顶状态时触发',
          since: '1.0.0'
        },
        {
          name: 'toggle-disabled',
          signature: '(disabled: boolean) => void',
          description: '切换禁用状态时触发',
          since: '1.0.0'
        },
        {
          name: 'tab-switch',
          signature: '(tabId: TabId) => void',
          description: '切换标签页时触发',
          since: '1.0.0'
        }
      ]
    }
  }
}

// 根据分组获取侧边栏数据
export function getSidebarData() {
  return componentGroups.map((group) => ({
    id: group.id,
    label: group.label,
    children: componentIndex
      .filter((c) => c.group === group.id)
      .map((c) => ({ id: c.id, zhName: c.zhName, enName: c.enName }))
  }))
}

// 根据组件 ID 获取文档元数据
export function getComponentDoc(componentId: string): ComponentDocMeta | null {
  const doc = componentDocs[componentId]
  if (!doc) return null

  return {
    ...doc,
    demos: doc.demos.map((demo) => ({
      ...demo,
      sourceCode: resolveDemoSource(demo)
    }))
  }
}
