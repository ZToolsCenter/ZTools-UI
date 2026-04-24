import type { Component } from 'vue'
import ButtonDemo from '../../demos/ButtonDemo.vue'
import DropdownDemo from '../../demos/DropdownDemo.vue'
import DropdownDemoSource from '../../demos/DropdownDemo.vue?raw'
import SliderDemo from '../../demos/SliderDemo.vue'
import SliderDemoSource from '../../demos/SliderDemo.vue?raw'
import InputDemo from '../../demos/InputDemo.vue'
import ColorPickerDemo from '../../demos/ColorPickerDemo.vue'
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
import PluginDetailDemo from '../../demos/PluginDetailDemo.vue'
import PluginDetailDemoSource from '../../demos/PluginDetailDemo.vue?raw'

const componentDemoSources = new Map<Component, string>([
  [DropdownDemo, DropdownDemoSource],
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

const buttonDemoScript = `import { Button } from 'ztools-ui-components/common/Button'`
const inputDemoScript = `import { Input } from 'ztools-ui-components/common/Input'`
const inputModelDemoScript = `import { ref } from 'vue'
import { Input } from 'ztools-ui-components/common/Input'`
const colorPickerDemoScript = `import { ColorPicker } from 'ztools-ui-components/common/ColorPicker'`
const colorPickerModelDemoScript = `import { ref } from 'vue'
import { ColorPicker } from 'ztools-ui-components/common/ColorPicker'`
const checkboxDemoScript = `import { Checkbox } from 'ztools-ui-components/common/Checkbox'`
const checkboxModelDemoScript = `import { ref } from 'vue'
import { Checkbox } from 'ztools-ui-components/common/Checkbox'`
const radioDemoScript = `import { Radio } from 'ztools-ui-components/common/Radio'`
const radioModelDemoScript = `import { ref } from 'vue'
import { Radio } from 'ztools-ui-components/common/Radio'`
const switchDemoScript = `import { Switch } from 'ztools-ui-components/common/Switch'`
const switchModelDemoScript = `import { ref } from 'vue'
import { Switch } from 'ztools-ui-components/common/Switch'`
const tagDemoScript = `import { Tag } from 'ztools-ui-components/common/Tag'`
const tagModelDemoScript = `import { ref } from 'vue'
import { Tag } from 'ztools-ui-components/common/Tag'`

const buttonDemoVariants = [
  {
    variant: 'basic',
    title: '基础',
    description: '展示 default / primary / success / warning / danger 与块级按钮。',
    sourceCode: createDemoSource(
      `
        <div class="button-demo">
          <div class="button-demo__row">
            <Button>默认按钮</Button>
            <Button type="primary">主要按钮</Button>
            <Button type="success">成功按钮</Button>
            <Button type="warning">警告按钮</Button>
            <Button type="danger">危险按钮</Button>
          </div>
          <Button block type="primary">块级按钮</Button>
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
            <Button class="button-demo__dashed">默认虚线</Button>
            <Button class="button-demo__dashed button-demo__dashed--primary">主要虚线</Button>
            <Button class="button-demo__dashed button-demo__dashed--danger">危险虚线</Button>
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
            <Button size="small">Small</Button>
            <Button size="medium" type="primary">Medium</Button>
            <Button size="large" type="success">Large</Button>
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
            <Button type="text">文字按钮</Button>
            <Button type="text">查看详情</Button>
            <Button type="text">移除</Button>
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
            <Button type="primary">
              <span class="button-demo__compound">
                <span>发布</span>
                <span class="button-demo__pill button-demo__pill--light">Beta</span>
              </span>
            </Button>
            <Button>
              <span class="button-demo__compound">
                <span>消息</span>
                <span class="button-demo__pill">12</span>
              </span>
            </Button>
            <Button type="success">
              <span class="button-demo__compound">
                <span>同步</span>
                <span class="button-demo__pill button-demo__pill--success">已启用</span>
              </span>
            </Button>
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
            <Button disabled>默认禁用</Button>
            <Button type="primary" disabled>主要禁用</Button>
            <Button type="text" disabled>文字禁用</Button>
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
            <Button type="primary">
              <template #icon>
                <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v8m0 0 3-3m-3 3L5 7m-2 5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </template>
              下载
            </Button>
            <Button>
              <template #icon>
                <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M7 3h6M7 8h6M7 13h6M3 3h.01M3 8h.01M3 13h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </template>
              列表
            </Button>
            <Button type="success">
              <template #icon>
                <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3.5 8 3 3 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </template>
              已完成
            </Button>
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
              <Button @click="handleAction('保存')">保存</Button>
              <Button type="primary" @click="handleAction('发布')">发布</Button>
              <Button type="danger" @click="handleAction('删除')">删除</Button>
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
        import { Button } from 'ztools-ui-components/common/Button'

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
            <Button class="button-demo__round" type="primary">圆角按钮</Button>
            <Button class="button-demo__round" type="success">胶囊按钮</Button>
            <Button class="button-demo__circle" type="primary" aria-label="添加">
              <template #icon>
                <svg class="button-demo__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </template>
            </Button>
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
              <Button class="button-demo__transparent">默认透明</Button>
              <Button class="button-demo__transparent button-demo__transparent--primary">主要透明</Button>
              <Button class="button-demo__transparent button-demo__transparent--danger">危险透明</Button>
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
            <Button :loading="loading" type="primary" @click="handleLoading">提交</Button>
            <Button loading>同步中</Button>
          </div>
        </div>
      `,
      `
        import { ref } from 'vue'
        import { Button } from 'ztools-ui-components/common/Button'

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
            <Button class="button-demo__group-item">上一步</Button>
            <Button class="button-demo__group-item button-demo__group-item--active">处理中</Button>
            <Button class="button-demo__group-item">下一步</Button>
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
          <Input v-model="text" placeholder="请输入内容" />
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
          <Input v-model="text" placeholder="请输入内容" clearable />
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
          <Input v-model="keyword" placeholder="搜索插件">
            <template #prefix>搜索</template>
          </Input>
          <Input model-value="readonly value" readonly>
            <template #suffix>只读</template>
          </Input>
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
          <Input model-value="Small" size="small" />
          <Input model-value="Medium" size="medium" />
          <Input model-value="Large" size="large" />
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
          <Input model-value="readonly value" readonly />
          <Input model-value="disabled value" disabled />
          <Input v-model="password" type="password" placeholder="请输入密码" />
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
        <Input v-model="text" type="textarea" placeholder="请输入多行内容" />
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
          <Input model-value="ztools-ui" status="success" message="名称可用" />
          <Input model-value="ztools" status="warning" message="建议使用更明确的名称" />
          <Input v-model="username" status="error" message="至少输入 3 个字符" />
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
        <Input v-model="text" type="textarea" :maxlength="30" show-word-limit placeholder="请输入 30 字以内的内容" />
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
    description: '可同时使用原生颜色面板和文本输入框编辑颜色值。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ColorPicker v-model="color" />
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
        <div class="demo-row">
          <ColorPicker v-model="color" size="small" />
          <ColorPicker v-model="color" size="medium" />
          <ColorPicker v-model="color" size="large" />
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
          <ColorPicker v-model="color" :show-input="false" />
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
    variant: 'disabled',
    title: '禁用',
    description: '禁用后颜色面板和文本输入都不可交互。',
    sourceCode: createDemoSource(
      `
        <div class="demo-row">
          <ColorPicker model-value="#94a3b8" disabled />
          <ColorPicker model-value="#64748b" :show-input="false" disabled />
        </div>
      `,
      colorPickerDemoScript
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
            <Checkbox v-model="checked">启用插件</Checkbox>
            <Checkbox :model-value="false">未选中</Checkbox>
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
        <Checkbox v-model="checked" indeterminate>部分选中</Checkbox>
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
          <Checkbox :model-value="true" disabled>已选禁用</Checkbox>
          <Checkbox :model-value="false" disabled>未选禁用</Checkbox>
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
            <Radio v-model="value" name="theme" value="blue">蓝色</Radio>
            <Radio v-model="value" name="theme" value="purple">紫色</Radio>
            <Radio v-model="value" name="theme" value="green">绿色</Radio>
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
          <Radio model-value="blue" name="disabled-theme" value="blue" disabled>蓝色（禁用）</Radio>
          <Radio model-value="blue" name="disabled-theme" value="orange" disabled>橙色（禁用）</Radio>
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
          <Switch v-model="enabled" />
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
          <Switch v-model="enabled" active-text="开启" inactive-text="关闭" />
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
          <Switch :model-value="false" size="small" />
          <Switch :model-value="true" size="medium" />
          <Switch :model-value="true" size="large" />
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
          <Switch :model-value="true" disabled />
          <Switch :model-value="false" disabled />
          <Switch :model-value="true" active-text="开启" inactive-text="关闭" disabled />
        </div>
      `,
      switchDemoScript
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
          <Tag>默认标签</Tag>
          <Tag type="primary">主要标签</Tag>
          <Tag type="success">成功标签</Tag>
          <Tag type="warning">警告标签</Tag>
          <Tag type="danger">危险标签</Tag>
          <Tag type="info">信息标签</Tag>
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
          <Tag size="small">小标签</Tag>
          <Tag size="medium" type="primary">中标签</Tag>
          <Tag size="large" type="success">大标签</Tag>
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
          <Tag round>圆角标签</Tag>
          <Tag round type="primary">主要标签</Tag>
          <Tag round type="success">成功标签</Tag>
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
            <Tag v-if="visible" closable type="primary" @close="visible = false">可关闭标签</Tag>
            <Tag closable type="warning">警告标签</Tag>
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
          <Tag disabled>默认禁用</Tag>
          <Tag type="primary" disabled>主要禁用</Tag>
          <Tag closable type="danger" disabled>关闭禁用</Tag>
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

  const blocks = getSfcSourceBlocks(trimmedSource)
  if (!blocks.length) return trimmedSource

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
    description: '基于原生 color input 的颜色选择器，支持文本输入联动。',
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

  dropdown: {
    id: 'dropdown',
    group: 'input',
    zhName: '下拉选择器',
    enName: 'Dropdown',
    description: '用于从一组选项中选择单个值的下拉选择器，支持自定义选项和占位符。',
    demos: [
      {
        title: '基础用法',
        description: '最基础的用法，通过 v-model 绑定选中值，options 配置选项列表。',
        component: DropdownDemo
      }
    ],
    api: {
      props: [
        {
          name: 'modelValue',
          type: 'string | number',
          description: '当前选中的值',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'options',
          type: 'DropdownOption[]',
          description: '选项列表，每项包含 label 和 value',
          required: true,
          since: '1.0.0'
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '请选择',
          description: '未选择时的占位文本',
          since: '1.0.0'
        }
      ],
      emits: [
        {
          name: 'update:modelValue',
          signature: '(value: string | number) => void',
          description: '选中值变化时触发',
          since: '1.0.0'
        },
        {
          name: 'change',
          signature: '(value: string | number) => void',
          description: '选中值变化时触发（与 update:modelValue 同时触发）',
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
        component: DetailPanelDemo
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

// 组件分组
export const componentGroups = [
  { id: 'input', label: '输入控件' },
  { id: 'display', label: '展示组件' },
  { id: 'feedback', label: '反馈组件' },
  { id: 'host', label: '宿主集成' }
]

// 组件索引（用于侧边栏）
export interface ComponentIndexEntry {
  id: string
  zhName: string
  enName: string
  group: string
}

export const componentIndex: ComponentIndexEntry[] = Object.values(componentDocs).map((doc) => ({
  id: doc.id,
  zhName: doc.zhName,
  enName: doc.enName,
  group: doc.group
}))

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
