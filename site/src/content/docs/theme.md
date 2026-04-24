# 主题系统

ztools-ui 有一套完整的主题系统，包括明暗模式、主题色、平台检测和 Windows 窗口材质。

## CSS 变量

组件库通过 CSS 变量控制所有视觉表现。主要的变量包括：

| 变量 | 说明 | 亮色默认 | 暗色默认 |
|------|------|----------|----------|
| `--bg-color` | 背景色 | `#f4f4f4` | `#303133` |
| `--text-color` | 主文本色 | `#333333` | `#f3f4f6` |
| `--text-secondary` | 辅助文本色 | `#616161` | `#bfc0c3` |
| `--border-color` | 边框色 | `#e5e7eb` | `#374151` |
| `--primary-color` | 主题色 | `#0284c7` | `#38bdf8` |
| `--card-bg` | 卡片背景 | `rgba(0,0,0,0.015)` | `rgba(255,255,255,0.04)` |
| `--control-bg` | 控件背景 | `rgba(0,0,0,0.035)` | `rgba(255,255,255,0.04)` |
| `--hover-bg` | 悬浮背景 | 自动计算 | 自动计算 |
| `--active-bg` | 激活背景 | 自动计算 | 自动计算 |

## 明暗模式

通过 `html.dark` 类名切换：

```ts
document.documentElement.classList.toggle('dark', isDark)
```

`useZtoolsTheme()` 会自动处理这一步。

## 主题色

支持以下预设主题色：`blue`、`purple`、`green`、`orange`、`red`、`pink`、`custom`。

通过 `body` 上的 `theme-xxx` 类名生效：

```ts
document.body.classList.add('theme-blue')
```

## 平台检测

组件库会在 `html` 上添加 `os-mac`、`os-windows`、`os-linux` 类名，用于平台相关的样式差异。

## Windows 窗口材质

Windows 下支持 `mica`、`acrylic`、`none` 三种材质，通过 `html[data-material]` 属性控制。
