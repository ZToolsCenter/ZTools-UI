<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'

const props = defineProps<{
  raw: string
}>()

const emit = defineEmits<{
  (e: 'headings', headings: { id: string; label: string; level: number }[]): void
}>()

// Custom renderer to add ids to headings and extract heading list
const headings = ref<{ id: string; label: string; level: number }[]>([])

const renderer = new marked.Renderer()

renderer.heading = function (data) {
  const text = data.text
  const depth = data.depth
  const id = text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
  return `<h${depth} id="${id}">${text}</h${depth}>`
}

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer
})

const html = computed(() => {
  if (!props.raw) return ''
  // Parse and collect headings
  const tokens = marked.lexer(props.raw)
  const extracted: { id: string; label: string; level: number }[] = []
  for (const token of tokens) {
    if (token.type === 'heading') {
      const text = token.text
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-|-$/g, '')
      extracted.push({ id, label: text, level: token.depth })
    }
  }
  headings.value = extracted
  emit('headings', extracted)
  return marked.parser(tokens)
})

const articleRef = ref<HTMLElement | null>(null)
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div ref="articleRef" class="markdown-article" v-html="html"></div>
</template>

<style scoped>
.markdown-article {
  font-size: 15px;
  line-height: 1.7;
  color: var(--site-text);
}

.markdown-article :deep(h1) {
  font-size: 2em;
  font-weight: 700;
  margin: 1.2em 0 0.6em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--site-border);
}

.markdown-article :deep(h2) {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.markdown-article :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.8em 0 0.4em;
}

.markdown-article :deep(h4) {
  font-size: 1.1em;
  font-weight: 600;
  margin: 0.6em 0 0.3em;
}

.markdown-article :deep(p) {
  margin: 0.8em 0;
}

.markdown-article :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

.markdown-article :deep(a:hover) {
  text-decoration: underline;
}

.markdown-article :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1em 0;
}

.markdown-article :deep(code) {
  padding: 2px 6px;
  background: var(--site-panel-muted-bg);
  border-radius: 4px;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-article :deep(pre) {
  padding: 14px 18px;
  background: var(--site-panel-muted-bg);
  border: 1px solid var(--site-border);
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
}

.markdown-article :deep(pre code) {
  padding: 0;
  background: transparent;
  border: none;
  font-size: 0.9em;
  line-height: 1.5;
}

.markdown-article :deep(ul),
.markdown-article :deep(ol) {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

.markdown-article :deep(li) {
  margin: 0.3em 0;
}

.markdown-article :deep(blockquote) {
  margin: 1em 0;
  padding: 0.6em 1em;
  border-left: 3px solid var(--primary-color);
  background: var(--site-panel-muted-bg);
  color: var(--site-text-muted);
  border-radius: 0 4px 4px 0;
}

.markdown-article :deep(table) {
  border-collapse: collapse;
  margin: 1em 0;
  width: 100%;
}

.markdown-article :deep(th),
.markdown-article :deep(td) {
  padding: 8px 12px;
  border: 1px solid var(--site-border);
  text-align: left;
}

.markdown-article :deep(th) {
  background: var(--site-panel-muted-bg);
  font-weight: 600;
}

.markdown-article :deep(hr) {
  border: none;
  border-top: 1px solid var(--site-border);
  margin: 1.5em 0;
}
</style>
