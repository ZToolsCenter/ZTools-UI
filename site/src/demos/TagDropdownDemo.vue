<script setup lang="ts">
import { ZTagDropdown } from 'ztools-ui-components/common/TagDropdown'
import type { TagDropdownMenuItem } from 'ztools-ui-components/common/TagDropdown'
import { useToast } from 'ztools-ui-components/common/Toast'
import { ZToast } from 'ztools-ui-components/common/Toast'

const { toastState, info } = useToast()

const menuItems: TagDropdownMenuItem[] = [
  { key: 'edit', label: '编辑', icon: 'i-z-settings' },
  { key: 'copy', label: '复制', icon: 'i-z-file' },
  { key: 'delete', label: '删除', icon: 'i-z-trash', danger: true }
]

/** 使用 Toast 展示当前选中的菜单项 */
function onSelect(key: string) {
  info(`选中: ${key}`)
}
</script>

<template>
  <div class="demo-section">
    <p>标签下拉菜单，附加在标签元素上点击展开。</p>
    <div class="demo-box">
      <ZTagDropdown :menu-items="menuItems" @select="onSelect">
        <span style="padding: 4px 12px; background: var(--control-bg); border: 1px solid var(--control-border); border-radius: 4px; cursor: pointer; font-size: 13px;">点击展开菜单</span>
      </ZTagDropdown>
    </div>
    <ZToast
      :visible="toastState.visible"
      :message="toastState.message"
      :type="toastState.type"
      :duration="toastState.duration"
      @update:visible="toastState.visible = $event"
    />
  </div>
</template>

<style scoped>
.demo-section p {
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 14px;
}
.demo-box {
  display: flex;
  gap: 8px;
}
</style>
