# 快速上手

## 安装

```bash
npm install @jspatrick/ztools-ui
```

## 引入样式

在入口文件中引入组件库的样式和 UnoCSS：

```ts
import '@jspatrick/ztools-ui/style'
```

> `style` 入口会自动加载全局 CSS 变量、主题系统和 UnoCSS 运行时。

## 注册组件

### 方式一：全量注册

```ts
import { createApp } from 'vue'
import ZToolsUI from '@jspatrick/ztools-ui'
import '@jspatrick/ztools-ui/style'

const app = createApp(App)
app.use(ZToolsUI)
```

### 方式二：按需引入

```vue
<script setup>
import { Dropdown } from '@jspatrick/ztools-ui'
</script>

<template>
  <Dropdown v-model="value" :options="options" />
</template>
```

配合 `unplugin-vue-components` 和 `@jspatrick/ztools-ui/resolver` 可以实现自动按需导入。

## 主题初始化

组件库依赖 ZTools 宿主提供的主题信息。如果你在 ZTools 插件环境中使用，调用 `useZtoolsTheme()` 即可自动同步：

```ts
import { useZtoolsTheme } from '@jspatrick/ztools-ui'

const { isDark, primaryColor } = useZtoolsTheme()
```

在非 ZTools 环境（如文档站或独立测试），你需要自行注入 `window.ztools` mock。
