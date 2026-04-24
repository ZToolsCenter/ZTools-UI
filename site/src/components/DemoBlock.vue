<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('css', css)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)

interface Props {
  title: string
  description?: string
  component: Component
  componentProps?: Record<string, unknown>
  sourceCode?: string
}

const props = defineProps<Props>()

const showCode = ref(false)
const hasSourceCode = computed(() => Boolean(props.sourceCode?.trim()))

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function trimBlankLines(value: string): string {
  const lines = value.replace(/\r\n/g, '\n').split('\n')

  while (lines[0]?.trim() === '') lines.shift()
  while (lines[lines.length - 1]?.trim() === '') lines.pop()

  return lines.join('\n')
}

function highlightCode(value: string, language: string): string {
  try {
    return hljs.highlight(value, { language }).value
  } catch {
    return escapeHtml(value)
  }
}

function getSfcBlock(source: string, tag: 'template' | 'script' | 'style'): { attrs: string; content: string } | null {
  const openPattern = new RegExp(`^<${tag}\\b([^>]*)>`, 'im')
  const openMatch = openPattern.exec(source)
  if (!openMatch) return null

  const contentStart = openMatch.index + openMatch[0].length
  const closePattern = new RegExp(`^</${tag}>`, 'im')
  const closeMatch = closePattern.exec(source.slice(contentStart))
  if (!closeMatch) return null

  return {
    attrs: openMatch[1],
    content: source.slice(contentStart, contentStart + closeMatch.index)
  }
}

function highlightVueSource(source: string): string {
  const normalizedSource = trimBlankLines(source)
  const templateBlock = getSfcBlock(normalizedSource, 'template')
  const scriptBlock = getSfcBlock(normalizedSource, 'script')
  const styleBlock = getSfcBlock(normalizedSource, 'style')
  const parts: string[] = []

  if (templateBlock) {
    parts.push(highlightCode(`<template${templateBlock.attrs}>`, 'xml'))
    parts.push('\n')
    parts.push(highlightCode(trimBlankLines(templateBlock.content), 'xml'))
    parts.push('\n')
    parts.push(highlightCode('</template>', 'xml'))
  }

  if (scriptBlock) {
    if (parts.length) parts.push('\n\n')
    parts.push(highlightCode(`<script${scriptBlock.attrs}>`, 'xml'))
    parts.push('\n')
    parts.push(highlightCode(trimBlankLines(scriptBlock.content), 'typescript'))
    parts.push('\n')
    parts.push(highlightCode(`</${'script'}>`, 'xml'))
  }

  if (styleBlock) {
    if (parts.length) parts.push('\n\n')
    parts.push(highlightCode(`<style${styleBlock.attrs}>`, 'xml'))
    parts.push('\n')
    parts.push(highlightCode(trimBlankLines(styleBlock.content), 'css'))
    parts.push('\n')
    parts.push(highlightCode('</style>', 'xml'))
  }

  return parts.length ? parts.join('') : highlightCode(normalizedSource, 'xml')
}

const highlightedCode = computed(() => highlightVueSource(props.sourceCode ?? ''))
</script>

<template>
  <div class="demo-block">
    <div class="demo-content">
      <div class="demo-header">
        <div>
          <h4 class="demo-title">{{ title }}</h4>
          <p v-if="description" class="demo-description">{{ description }}</p>
        </div>
        <button
          v-if="hasSourceCode"
          class="demo-code-toggle"
          type="button"
          :aria-expanded="showCode"
          :title="showCode ? '收起代码' : '查看代码'"
          @click="showCode = !showCode"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m6 4-4 4 4 4M10 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ showCode ? '收起' : '代码' }}</span>
        </button>
      </div>
      <div class="demo-preview">
        <component :is="component" v-bind="componentProps ?? {}" />
      </div>
      <pre v-if="showCode && sourceCode" class="demo-code"><code class="hljs language-vue" v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<style scoped>
.demo-block {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.demo-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.demo-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 6px;
}

.demo-description {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.demo-content {
  flex: 1;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  min-height: 60px;
}

.demo-preview {
  min-height: 60px;
}

.demo-code-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
}

.demo-code-toggle:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background: var(--hover-bg);
}

.demo-code-toggle svg {
  width: 14px;
  height: 14px;
}

.demo-code {
  --hljs-bg: #fafafa;
  --hljs-color: #383a42;
  --hljs-comment: #a0a1a7;
  --hljs-keyword: #a626a4;
  --hljs-tag: #e45649;
  --hljs-literal: #0184bb;
  --hljs-string: #50a14f;
  --hljs-attr: #986801;
  --hljs-title: #4078f2;
  --hljs-built-in: #c18401;

  margin: 12px 0 0;
  padding: 16px;
  max-height: 420px;
  overflow: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--hljs-bg);
  color: var(--hljs-color);
  font-size: 12px;
  line-height: 1.6;
}

:global(html.dark) .demo-code {
  --hljs-bg: #282c34;
  --hljs-color: #abb2bf;
  --hljs-comment: #5c6370;
  --hljs-keyword: #c678dd;
  --hljs-tag: #e06c75;
  --hljs-literal: #56b6c2;
  --hljs-string: #98c379;
  --hljs-attr: #d19a66;
  --hljs-title: #61aeee;
  --hljs-built-in: #e6c07b;
}

.demo-code code {
  display: block;
  padding: 0;
  overflow: visible;
  background: transparent;
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  white-space: pre;
}

.demo-code :deep(.hljs) {
  background: transparent;
  color: var(--hljs-color);
}

.demo-code :deep(.hljs-comment),
.demo-code :deep(.hljs-quote) {
  color: var(--hljs-comment);
  font-style: italic;
}

.demo-code :deep(.hljs-doctag),
.demo-code :deep(.hljs-keyword),
.demo-code :deep(.hljs-formula) {
  color: var(--hljs-keyword);
}

.demo-code :deep(.hljs-section),
.demo-code :deep(.hljs-name),
.demo-code :deep(.hljs-selector-tag),
.demo-code :deep(.hljs-deletion),
.demo-code :deep(.hljs-subst) {
  color: var(--hljs-tag);
}

.demo-code :deep(.hljs-literal) {
  color: var(--hljs-literal);
}

.demo-code :deep(.hljs-string),
.demo-code :deep(.hljs-regexp),
.demo-code :deep(.hljs-addition),
.demo-code :deep(.hljs-attribute),
.demo-code :deep(.hljs-meta .hljs-string) {
  color: var(--hljs-string);
}

.demo-code :deep(.hljs-attr),
.demo-code :deep(.hljs-variable),
.demo-code :deep(.hljs-template-variable),
.demo-code :deep(.hljs-type),
.demo-code :deep(.hljs-selector-class),
.demo-code :deep(.hljs-selector-attr),
.demo-code :deep(.hljs-selector-pseudo),
.demo-code :deep(.hljs-number) {
  color: var(--hljs-attr);
}

.demo-code :deep(.hljs-symbol),
.demo-code :deep(.hljs-bullet),
.demo-code :deep(.hljs-link),
.demo-code :deep(.hljs-meta),
.demo-code :deep(.hljs-selector-id),
.demo-code :deep(.hljs-title) {
  color: var(--hljs-title);
}

.demo-code :deep(.hljs-built_in),
.demo-code :deep(.hljs-title.class_),
.demo-code :deep(.hljs-class .hljs-title) {
  color: var(--hljs-built-in);
}

.demo-code :deep(.hljs-emphasis) {
  font-style: italic;
}

.demo-code :deep(.hljs-strong) {
  font-weight: 700;
}

.demo-code :deep(.hljs-link) {
  text-decoration: underline;
}
</style>
