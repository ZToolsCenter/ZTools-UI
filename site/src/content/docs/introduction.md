# 介绍

`@jspatrick/ztools-ui` 是一套为 ZTools 插件生态打造的 Vue 3 组件库。它提供了一组精心设计的 UI 组件，覆盖了插件开发中最常见的交互场景。

## 为什么需要这个库？

ZTools 插件运行在 Electron 宿主环境中，拥有统一的设计语言和主题系统。`ztools-ui` 的目标是：

- **一致性**：所有插件共享相同的视觉风格和交互模式
- **主题感知**：组件自动适配亮/暗主题、平台差异和窗口材质
- **宿主集成**：封装了与 ZTools 宿主（`window.ztools`）的交互细节

## 组件一览

| 组件 | 说明 |
|------|------|
| `Dropdown` | 下拉选择器 |
| `Slider` | 滑块控件 |
| `Toast` | 轻提示 |
| `ConfirmDialog` | 确认弹窗 |
| `HotkeyInput` | 快捷键录制输入 |
| `ShortcutEditor` | 快捷键编辑面板 |
| `DetailPanel` | 覆盖式详情面板 |
| `AdaptiveIcon` | 自适应图标 |
| `CommandCard` | 指令卡片 |
| `CommandTag` | 指令标签 |
| `FeatureCard` | 功能卡片 |
| `TagDropdown` | 标签下拉菜单 |
| `PluginDetail` | 插件详情面板 |
