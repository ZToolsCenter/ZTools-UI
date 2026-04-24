<script setup lang="ts">
import type { ApiProp, ApiSlot, ApiEmit } from '../content/components/meta'

interface Props {
  props?: ApiProp[]
  slots?: ApiSlot[]
  emits?: ApiEmit[]
}

defineProps<Props>()

// 判断是否有 API 数据
const hasApi = (data?: any[]): boolean => {
  return data && data.length > 0
}
</script>

<template>
  <div class="api-section">
    <h3 class="section-title">API</h3>

    <!-- Props -->
    <div v-if="hasApi(props)" id="api-props" class="api-subsection">
      <h4 class="subsection-title">Props</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in props" :key="prop.name">
            <td class="prop-name">
              <code>{{ prop.name }}</code>
              <span v-if="prop.required" class="required-badge">必填</span>
            </td>
            <td class="prop-type"><span class="type-token">{{ prop.type }}</span></td>
            <td class="prop-default">
              <code v-if="prop.default">{{ prop.default }}</code>
              <span v-else class="empty">-</span>
            </td>
            <td class="prop-description">
              {{ prop.description }}
              <span v-if="prop.since" class="since-badge">{{ prop.since }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Slots -->
    <div v-if="hasApi(slots)" id="api-slots" class="api-subsection">
      <h4 class="subsection-title">Slots</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in slots" :key="slot.name">
            <td class="slot-name"><code>{{ slot.name }}</code></td>
            <td class="slot-description">
              {{ slot.description }}
              <span v-if="slot.since" class="since-badge">{{ slot.since }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Emits -->
    <div v-if="hasApi(emits)" id="api-emits" class="api-subsection">
      <h4 class="subsection-title">Events</h4>
      <table class="api-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>签名</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emit in emits" :key="emit.name">
            <td class="emit-name"><code>{{ emit.name }}</code></td>
            <td class="emit-signature"><code>{{ emit.signature }}</code></td>
            <td class="emit-description">
              {{ emit.description }}
              <span v-if="emit.since" class="since-badge">{{ emit.since }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 无 API 数据提示 -->
    <div v-if="!hasApi(props) && !hasApi(slots) && !hasApi(emits)" class="empty-api">
      该组件暂无 API 文档
    </div>
  </div>
</template>

<style scoped>
.api-section {
  margin-top: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--divider-color);
}

.api-subsection {
  margin-bottom: 24px;
}

.api-subsection:last-child {
  margin-bottom: 0;
}

.subsection-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 12px;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.api-table thead {
  background: var(--hover-bg);
}

.api-table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--divider-color);
}

.api-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--divider-color);
  color: var(--text-color);
  vertical-align: top;
}

.api-table tr:last-child td {
  border-bottom: none;
}

.api-table code {
  background: var(--control-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  color: var(--primary-color);
}

.type-token {
  display: inline-block;
  background: var(--control-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  color: var(--primary-color);
}

.prop-name,
.slot-name,
.emit-name {
  font-weight: 500;
  white-space: nowrap;
}

.prop-name {
  width: 120px;
}

.prop-type {
  width: 260px;
}

.prop-default {
  width: 100px;
}

.prop-description,
.slot-description,
.emit-description {
  line-height: 1.5;
}

.required-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 500;
  color: var(--danger-color);
  background: var(--danger-light-bg);
  border-radius: 4px;
}

.since-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--control-bg);
  border-radius: 4px;
}

.empty {
  color: var(--text-secondary);
  font-style: italic;
}

.empty-api {
  padding: 32px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  background: var(--card-bg);
  border-radius: 8px;
}
</style>
