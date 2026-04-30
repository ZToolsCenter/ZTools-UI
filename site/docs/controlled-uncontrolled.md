# 受控与非受控模式

ztools-ui 中的表单类组件支持两种使用模式：受控模式和非受控模式。

## 非受控模式

在非受控模式下，组件自行管理内部状态。父组件通过 `defaultXxx` 属性设置初始值，并通过事件监听变化。

```vue
<script setup>
import { ref } from 'vue'
import { ZInput } from 'ztools-ui-components/common/Input'

const inputValue = ref('') // 用于获取最新的值
</script>

<template>
  <ZInput
    :default-model-value="'初始值'"
    @update:model-value="inputValue = $event"
  />
  <p>最近输入: {{ inputValue }}</p>
</template>
```

非受控模式适合简单场景，组件会自动管理状态，你只需要监听变化即可。

## 受控模式

在受控模式下，父组件通过 `v-model` 或显式 prop 完全控制组件值，组件值变化必须通过事件回写。

```vue
<script setup>
import { ref } from 'vue'
import { ZInput } from 'ztools-ui-components/common/Input'

const value = ref('初始值')
</script>

<template>
  <ZInput v-model="value" />
  <!-- 等同于 -->
  <ZInput
    :model-value="value"
    @update:model-value="value = $event"
  />
  <p>当前值: {{ value }}</p>
</template>
```

受控模式适合需要完全控制组件状态的场景，比如表单验证、条件控制等。

## 如何切换模式

模式的切换取决于你传入的 prop：

| 行为 | prop | 效果 |
|------|------|------|
| 受控模式 | 传入 `modelValue` 且不为 `undefined` | 组件值由父组件完全控制 |
| 非受控模式 | 未传 `modelValue` 或值为 `undefined` | 组件使用 `defaultModelValue` 作为初始值，自行管理状态 |

**重要提示**：`undefined` 仅表示"切换为非受控"，若要清空值请使用 `null`。

## 浮层组件的显隐控制

对于 Popover、ColorPicker 等浮层组件，同样支持受控/非受控的显隐控制：

```vue
<!-- 受控显隐 -->
<ZPopover :show="visible" @update:show="visible = $event">
  <template #trigger>
    <ZButton @click="visible = true">打开</ZButton>
  </template>
  内容
</ZPopover>

<!-- 非受控显隐 -->
<ZPopover :default-show="true" @update:show="handleShowChange">
  <template #trigger>
    <ZButton>触发器</ZButton>
  </template>
  内容
</ZPopover>
```

## 选择建议

- **非受控模式**：适合简单的表单场景，开箱即用
- **受控模式**：适合需要精确控制组件状态、与其他状态联动的复杂场景
