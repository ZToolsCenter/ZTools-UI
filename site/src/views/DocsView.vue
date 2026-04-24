<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import DocsShell from '../layouts/DocsShell.vue'
import type { SidebarItem } from '../layouts/DocsShell.vue'
import MarkdownArticle from '../components/MarkdownArticle.vue'
import { docNavGroups, allDocs, type DocNavEntry } from '../content/docs/nav'

const activeId = ref('introduction')
const currentMd = ref(allDocs[0].md)
const tocItems = ref<{ id: string; label: string; level: number }[]>([])
const tocActiveId = ref('')

// Build sidebar items from nav groups
const sidebarItems: SidebarItem[] = docNavGroups.map((g) => ({
  id: g.id,
  label: g.label,
  children: g.children.map((c) => ({ id: c.id, label: c.label }))
}))

function selectDoc(id: string) {
  const doc = allDocs.find((d) => d.id === id)
  if (doc) {
    activeId.value = id
    currentMd.value = doc.md
    tocActiveId.value = ''
  }
}

function onHeadings(headings: { id: string; label: string; level: number }[]) {
  tocItems.value = headings
}

// Scroll observer for active TOC
const scrollContainer = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function setupScrollObserver() {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          tocActiveId.value = entry.target.id
        }
      }
    },
    { root: scrollContainer.value, rootMargin: '0px 0px -60% 0px' }
  )
}

function handleTocClick(id: string) {
  const shell = document.querySelector('.docs-shell')
  const main = shell?.querySelector('.docs-main') as HTMLElement | null
  const target = main?.querySelector(`#${CSS.escape(id)}`) as HTMLElement | null
  if (target && main) {
    main.scrollTo({ top: target.offsetTop - 20, behavior: 'smooth' })
    tocActiveId.value = id
  }
}

onMounted(() => {
  const shell = document.querySelector('.docs-shell')
  scrollContainer.value = shell?.querySelector('.docs-main') as HTMLElement | null
  if (scrollContainer.value) {
    setupScrollObserver()
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <DocsShell
    :sidebar-items="sidebarItems"
    :active-id="activeId"
    :toc-items="tocItems"
    :toc-active-id="tocActiveId"
    @select="selectDoc"
    @toc-click="handleTocClick"
  >
    <MarkdownArticle :raw="currentMd" @headings="onHeadings" />
  </DocsShell>
</template>
