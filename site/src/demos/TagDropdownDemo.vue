<script setup lang="ts">
import { ref } from 'vue'
import { ZTagDropdown } from 'ztools-ui-components/common/TagDropdown'
import type { TagDropdownMenuItem } from 'ztools-ui-components/common/TagDropdown'

const menuItems: TagDropdownMenuItem[] = [
  { key: 'edit', label: '编辑', icon: 'i-z-settings' },
  { key: 'copy', label: '复制', icon: 'i-z-file' },
  { key: 'delete', label: '删除', icon: 'i-z-trash', danger: true }
]

function onSelect(key: string) {
  alert(`选中: ${key}`)
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
