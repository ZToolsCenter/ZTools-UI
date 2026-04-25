---
title: 主题系统
---

# 主题系统

ztools-ui 有一套完整的主题系统，包括明暗模式、主题色、平台检测和 Windows 窗口材质。

## CSS 变量

组件库通过 CSS 变量控制所有视觉表现。主要的变量包括：

<table class="theme-vars-table">
  <thead>
    <tr>
      <th>变量</th>
      <th>说明</th>
      <th>亮色默认</th>
      <th>暗色默认</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="theme-token">--bg-color</span></td>
      <td>背景色</td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #f4f4f4;"></span><span class="theme-token">#f4f4f4</span></span></td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #303133;"></span><span class="theme-token">#303133</span></span></td>
    </tr>
    <tr>
      <td><span class="theme-token">--text-color</span></td>
      <td>主文本色</td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #333333;"></span><span class="theme-token">#333333</span></span></td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #f3f4f6;"></span><span class="theme-token">#f3f4f6</span></span></td>
    </tr>
    <tr>
      <td><span class="theme-token">--text-secondary</span></td>
      <td>辅助文本色</td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #616161;"></span><span class="theme-token">#616161</span></span></td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #bfc0c3;"></span><span class="theme-token">#bfc0c3</span></span></td>
    </tr>
    <tr>
      <td><span class="theme-token">--border-color</span></td>
      <td>边框色</td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #e5e7eb;"></span><span class="theme-token">#e5e7eb</span></span></td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #374151;"></span><span class="theme-token">#374151</span></span></td>
    </tr>
    <tr>
      <td><span class="theme-token">--primary-color</span></td>
      <td>主题色</td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #0284c7;"></span><span class="theme-token">#0284c7</span></span></td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: #38bdf8;"></span><span class="theme-token">#38bdf8</span></span></td>
    </tr>
    <tr>
      <td><span class="theme-token">--card-bg</span></td>
      <td>卡片背景</td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: rgba(0,0,0,0.015);"></span><span class="theme-token">rgba(0,0,0,0.015)</span></span></td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: rgba(255,255,255,0.04);"></span><span class="theme-token">rgba(255,255,255,0.04)</span></span></td>
    </tr>
    <tr>
      <td><span class="theme-token">--control-bg</span></td>
      <td>控件背景</td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: rgba(0,0,0,0.035);"></span><span class="theme-token">rgba(0,0,0,0.035)</span></span></td>
      <td><span class="theme-color"><span class="theme-color__swatch" style="--swatch-color: rgba(255,255,255,0.04);"></span><span class="theme-token">rgba(255,255,255,0.04)</span></span></td>
    </tr>
    <tr>
      <td><span class="theme-token">--hover-bg</span></td>
      <td>悬浮背景</td>
      <td>自动计算</td>
      <td>自动计算</td>
    </tr>
    <tr>
      <td><span class="theme-token">--active-bg</span></td>
      <td>激活背景</td>
      <td>自动计算</td>
      <td>自动计算</td>
    </tr>
  </tbody>
</table>

<style>
.theme-vars-table {
  width: 100%;
}

.theme-vars-table td {
  color: var(--site-text);
}

.theme-token {
  display: inline-block;
  padding: 2px 6px;
  border: 1px solid var(--site-border);
  border-radius: 4px;
  background: var(--site-panel-muted-bg);
  color: var(--site-text);
  font-family: Monaco, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.4;
}

.theme-color {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.theme-color__swatch {
  width: 14px;
  height: 14px;
  flex: none;
  border: 1px solid var(--site-border);
  border-radius: 4px;
  background: var(--swatch-color);
}
</style>

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
