<script setup lang="ts">
import { ref } from 'vue'
import { ZPluginDetail } from 'ztools-ui-components/common/PluginDetail'
import type { PluginItem } from 'ztools-ui-components/common/PluginDetail'

const mockPlugin: PluginItem = {
  name: 'mock-plugin',
  title: '示例插件',
  version: '1.0.0',
  description: '这是一个用于文档展示的示例插件',
  logo: '',
  installed: true,
  isDevelopment: false,
  localVersion: '1.0.0',
  path: '/plugins/mock-plugin',
  size: 1024000,
  author: 'ZTools',
  homepage: 'https://github.com/example/mock-plugin',
  features: [
    {
      code: 'search',
      name: '搜索',
      explain: '全文搜索功能',
      icon: '🔍',
      cmds: [
        { label: '搜索', type: 'text' },
        { label: '正则', type: 'regex' }
      ]
    },
    {
      code: 'translate',
      name: '翻译',
      explain: '多语言翻译',
      icon: '🌐',
      cmds: [{ label: '翻译', type: 'text' }]
    }
  ]
}
</script>

<template>
  <div class="demo-section">
    <p>插件详情面板，包含插件信息、README、指令列表和数据管理。依赖宿主 API 较多。</p>
    <div class="demo-box" style="position: relative; height: 500px; border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden;">
      <ZPluginDetail
        :plugin="mockPlugin"
        :is-loading="false"
        :is-running="true"
        :show-pin-button="true"
        :show-disable-toggle="true"
        :show-size="true"
        @back="() => {}"
      />
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
