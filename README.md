# ztools-ui 使用说明

`ztools-ui` 是一个面向 ZTools 插件场景的 Vue 3 UI 组件库，提供了插件详情、快捷键录制、下拉选择、提示弹窗等能力。

## 功能概览

- 基于 Vue 3 组件封装
- 提供统一安装入口，可全局注册组件
- 提供样式入口 `ztools-ui/style`
- 提供自动按需导入解析器 `ZToolsUIResolver`
- 同时导出 composables 与工具函数，便于二次封装

## 环境要求

- Vue `^3.5.13`
- `vue-router` `^4.5.0`（部分组件依赖路由）
- 浏览器 / Electron 渲染进程环境
- 若使用与宿主交互的组件，需要提供 `window.ztools` / `ztools` 运行时能力
- 若使用主题相关能力，还需要提供 `ztools.getThemeInfo()` 和 `ztools.onThemeChange()`

> 注意：这是一个偏 ZTools 宿主场景的 UI 库，不是完全脱离宿主环境的纯展示组件集。

## 安装

```bash
npm install ztools-ui vue vue-router
```

如果你的项目已经安装了 `vue` 和 `vue-router`，只需要安装 `ztools-ui` 即可。

## 导出说明

当前包提供 3 个公开入口：

- `ztools-ui`：组件、composables、utils、插件安装入口
- `ztools-ui/style`：全局样式与 UnoCSS 样式入口
- `ztools-ui/resolver`：自动导入组件解析器

## 快速开始

### 1. 全局注册组件

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ZToolsUI from 'ztools-ui'
import 'ztools-ui/style'

createApp(App).use(router).use(ZToolsUI).mount('#app')
```

安装后会全局注册以下组件：

- `AdaptiveIcon`
- `Button`
- `Checkbox`
- `ColorPicker`
- `CommandCard`
- `CommandTag`
- `ConfirmDialog`
- `DetailPanel`
- `Dropdown`
- `FeatureCard`
- `HotkeyInput`
- `Input`
- `PluginDetail`
- `Radio`
- `ShortcutEditor`
- `Slider`
- `Switch`
- `Tag`
- `TagDropdown`
- `Toast`

### 2. 局部按需引入

```vue
<script setup lang="ts">
import { Dropdown, useToast } from 'ztools-ui'

const { success } = useToast()

const options = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' }
]

function handleChange() {
  success('切换成功')
}
</script>

<template>
  <Dropdown :options="options" model-value="light" @change="handleChange" />
</template>
```

局部引入时，同样建议在应用入口只引入一次：

```ts
import 'ztools-ui/style'
```

## 自动导入组件

如果你在 Vite 中使用 `unplugin-vue-components`，可以配合解析器自动导入：

```ts
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ZToolsUIResolver } from 'ztools-ui/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        ZToolsUIResolver()
      ]
    })
  ]
})
```

默认会自动附带样式副作用导入；如果你想自行控制样式引入：

```ts
ZToolsUIResolver({ importStyle: false })
```

然后在应用入口手动引入：

```ts
import 'ztools-ui/style'
```

## 宿主主题接入

如果你希望在应用入口自动同步宿主主题到 DOM，可直接调用 `useZtoolsTheme()`。
宿主需要提供以下主题能力：

```ts
interface ThemeInfo {
  isDark: boolean
  primaryColor?: string
  customColor?: string
  windowMaterial: string
}

window.ztools.getThemeInfo(): ThemeInfo
window.ztools.onThemeChange(callback: (theme: ThemeInfo) => void): void
```

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { useZtoolsTheme } from 'ztools-ui'
import 'ztools-ui/style'

useZtoolsTheme()

createApp(App).mount('#app')
```

它会基于宿主返回的主题信息：

- 在 `html` 上切换 `dark` 类
- 在 `html` 上写入 `data-material`
- 在 `html` 上同步 `os-mac`、`os-windows`、`os-linux`
- 在 `body` 上切换 `theme-*` 主题类
- 在 `customColor` 存在时写入 `--primary-color`

`windowMaterial` 通常使用 `mica`、`acrylic`、`none` 等值，由宿主自行决定具体返回内容。

如果你还需要同步平台类名，可直接调用 `applyOsClass()` 自动检测宿主平台，或使用 `useZtoolsOs()` 获取 `platform` / `isMac` / `isWindows` / `isLinux`。

## 常用组件

### 布局与导航

| 组件 | 说明 | 依赖 |
| --- | --- | --- |
| `DetailPanel` | 通用详情页容器，适合带返回按钮的右侧面板 | 无强宿主依赖 |

### 表单与交互

| 组件 | 说明 | 依赖 |
| --- | --- | --- |
| `Button` | 基础按钮组件，支持类型、尺寸、loading 和 block | 无 |
| `Input` | 基础输入框，支持 `v-model`、清空按钮、前后缀插槽 | 无 |
| `Dropdown` | 基础下拉选择组件，支持 `v-model` | 无 |
| `ColorPicker` | 基于原生输入实现的颜色选择器 | 无 |
| `Checkbox` | 基础复选框组件，支持半选状态 | 无 |
| `Radio` | 基础单选框组件，适合互斥选择 | 无 |
| `Switch` | 基础开关组件，支持文案与尺寸 | 无 |
| `Slider` | 滑块输入组件 | 无 |
| `TagDropdown` | 标签型操作菜单 | 无 |
| `HotkeyInput` | 录制快捷键输入框 | `window.ztools.internal` |
| `ShortcutEditor` | 快捷键编辑面板，内部组合了 `HotkeyInput` | `window.ztools.internal` |

### 展示与业务组件

| 组件 | 说明 | 依赖 |
| --- | --- | --- |
| `AdaptiveIcon` | 根据图标分析结果做深浅色自适应显示 | 建议提供 `window.ztools.internal.analyzeImage` |
| `Tag` | 轻量标签组件，支持状态色、圆角和关闭操作 | 无 |
| `CommandCard` | 命令卡片，适合展示应用、命令或系统项 | 无强宿主依赖 |
| `CommandTag` | 命令标签展示 | 无 |
| `FeatureCard` | 功能卡片展示 | 无 |
| `PluginDetail` | 插件详情面板，含 README、数据、内存、操作区等 | 强依赖 ZTools 宿主 API |

### 反馈类组件

| 组件 | 说明 | 依赖 |
| --- | --- | --- |
| `Toast` | 全局提示组件 | 通常搭配 `useToast()` |
| `ConfirmDialog` | 确认弹窗组件 | 通常搭配 `useConfirmDialog()` |

## Composables

### `useZtoolsTheme()`

在应用入口同步宿主主题到 DOM：

```ts
import { useZtoolsTheme } from 'ztools-ui'

const { isDark, primaryColor, customColor, windowMaterial } = useZtoolsTheme()
```

> 该 composable 会读取 `window.ztools.getThemeInfo()`，并订阅 `window.ztools.onThemeChange()`；同时同步 `isDark`、`primaryColor`、`customColor`、`windowMaterial` 这些响应式状态，以及 `dark`、`data-material`、`os-*`、`theme-*` 和 `--primary-color`。

### `useZtoolsOs()`

读取宿主平台信息，并同步根节点平台类名：

```ts
import { useZtoolsOs } from 'ztools-ui'

const { platform, isMac, isWindows, isLinux } = useZtoolsOs()
```

> 该 composable 会优先读取 `window.ztools.isMacOs()` / `window.ztools.isMacOS()` / `window.ztools.isWindows()` / `window.ztools.isLinux()`，并调用 `applyOsClass()` 同步 `os-mac`、`os-windows`、`os-linux`。

### `useColorScheme()`

仅获取响应式深色模式状态：

```ts
import { useColorScheme } from 'ztools-ui'

const { isDark } = useColorScheme()
```

> 如果你还需要把宿主题信息应用到 DOM，请优先在应用入口调用 `useZtoolsTheme()`。

### `useHistoryState<T>()`

读取 `history.state` 中的路由参数，并可选择读取后清空：

```ts
import { useHistoryState } from 'ztools-ui'

const state = useHistoryState<{ pluginName: string }>()
```

### `useZtoolsSubInput()`

用于接入 ZTools 的子输入框能力，支持输入监听、搜索触发与快捷聚焦。

```ts
import { useZtoolsSubInput } from 'ztools-ui'

const subInput = useZtoolsSubInput('', '请输入关键词')
subInput.onSearch((value) => {
  console.log(value)
})
```

> 该能力依赖全局 `ztools` 对象，不适用于普通 Web 页面独立运行。

### `useJumpFunction()`

监听路由切换并消费 `history.state` 传值，适合实现“从外部跳转到指定页面后自动执行某动作”的场景。

## 工具函数

### `weightedSearch(items, query, fields)`

按字段权重进行搜索和排序。

```ts
import { weightedSearch } from 'ztools-ui'

const result = weightedSearch(list, keyword, [
  { value: (item) => item.title, weight: 3 },
  { value: (item) => item.description, weight: 1 }
])
```

### `shuffleArray(arr)`

返回打乱后的新数组，不修改原数组。

### `themeUtils`

导出了一组主题相关工具：

- `normalizeTheme`
- `normalizePrimaryColor`
- `normalizeWindowMaterial`
- `applyCustomColor`
- `applyPrimaryColor`
- `applyOsClass`

适合主题类名切换、自定义主色应用，以及根节点平台类同步。

### `upgradeInstalledPluginFromMarket()`

用于把已安装插件升级到插件市场版本，依赖 ZTools 宿主 API。

## 反馈能力示例

### Toast

```vue
<script setup lang="ts">
import { Toast, useToast } from 'ztools-ui'

const { success, error } = useToast()

function handleSave() {
  try {
    success('保存成功')
  } catch {
    error('保存失败')
  }
}
</script>

<template>
  <button @click="handleSave">保存</button>
  <Toast />
</template>
```

### ConfirmDialog

```vue
<script setup lang="ts">
import { ConfirmDialog, useConfirmDialog } from 'ztools-ui'

const { confirm } = useConfirmDialog()

async function handleDelete() {
  const ok = await confirm({
    title: '确认删除',
    message: '确定要删除当前项吗？',
    type: 'danger'
  })

  if (!ok) return
  console.log('已确认删除')
}
</script>

<template>
  <button @click="handleDelete">删除</button>
  <ConfirmDialog />
</template>
```

## 样式说明

`ztools-ui/style` 会引入：

- UnoCSS 生成样式
- 全局基础样式

建议：

- 仅在应用入口引入一次
- 如果你已经有全局样式体系，请先验证变量与重置样式是否冲突

## 使用建议

1. 普通基础组件（如 `Dropdown`、`Slider`、`CommandTag`）可以直接在 Vue 3 项目中使用。
2. ZTools 宿主相关组件（如 `PluginDetail`、`HotkeyInput`、`ShortcutEditor`）建议只在 ZTools 插件运行环境中使用。
3. 如果你只想使用组件样式能力，优先按需引入组件并统一引入 `ztools-ui/style`。

## 本地构建

```bash
npm run typecheck
npm run build
```

构建产物输出到 `dist/` 目录。

## 目录说明

```text
ztools-ui/
├─ components/    # 组件导出
├─ composables/   # 组合式函数
├─ utils/         # 工具函数
├─ index.ts       # 主入口
├─ plugin.ts      # install 注册入口
├─ resolver.ts    # 自动导入解析器
└─ style.ts       # 样式入口
```
