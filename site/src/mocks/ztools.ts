import type { Component } from 'vue'
import { applyTheme } from '../../../composables'

/**
 * Mock `window.ztools` for the docs site so that components that depend on
 * the ZTools host can still render and interact.
 */

const memoryDb: Record<string, any> = {}

const mockPluginReadme = `# Mock Plugin

This is a **mock plugin** used by the docs site to demonstrate the \`PluginDetail\` component.

## Features

- Feature A
- Feature B
- Feature C

## Installation

\`\`\`bash
npm install mock-plugin
\`\`\`

## Usage

\`\`\`ts
import { mockPlugin } from 'mock-plugin'
mockPlugin.start()
\`\`\`

> This plugin is for demonstration purposes only.
`

function mockZtools() {
  const themeInfo = {
    isDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    primaryColor: 'blue' as string | undefined,
    customColor: undefined as string | undefined,
    windowMaterial: 'none'
  }

  const themeCallbacks: ((theme: typeof themeInfo) => void)[] = []

  const ztools = {
    removeSubInput() {},
    setSubInput() { return true },
    setSubInputValue() {},
    subInputFocus: () => false,
    subInputSelect: () => false,
    getThemeInfo: () => ({ ...themeInfo }),
    onThemeChange(cb: (theme: typeof themeInfo) => void) {
      themeCallbacks.push(cb)
    },
    isMacOs: () => false,
    isMacOS: () => false,
    isWindows: () => true,
    isLinux: () => false,
    shellOpenExternal(url: string) {
      window.open(url, '_blank')
    },
    internal: {
      analyzeImage(_src: string) {
        return Promise.resolve({
          isSimpleIcon: true,
          mainColor: '#333333',
          isDark: true,
          needsAdaptation: true
        })
      },
      startHotkeyRecording() {
        return Promise.resolve({ success: true })
      },
      onHotkeyRecorded: undefined as ((cb: (shortcut: string) => void) => void) | undefined,
      getPlatform() {
        return 'win32'
      },
      dbGet(key: string) {
        return Promise.resolve(memoryDb[key] ?? null)
      },
      dbPut(key: string, value: any) {
        memoryDb[key] = value
        return Promise.resolve()
      },
      installPluginFromMarket(_plugin: any) {
        return Promise.resolve({ success: false, error: 'Mock: not available' })
      },
      getPluginReadme(_idOrPath: string) {
        return Promise.resolve({ success: true, content: mockPluginReadme })
      },
      getPluginDocKeys(_name: string) {
        return Promise.resolve({
          success: true,
          data: [
            { key: 'settings', type: 'document' },
            { key: 'cache', type: 'attachment' }
          ]
        })
      },
      getPluginDoc(_name: string, key: string) {
        return Promise.resolve({
          success: true,
          data: { key, value: 'mock data', _rev: '1-abc', updatedAt: new Date().toISOString() },
          type: 'document'
        })
      },
      getPluginMemoryInfo(_path: string) {
        return Promise.resolve({
          success: true,
          data: { private: 32, shared: 16, total: 48 }
        })
      },
      clearPluginData(_name: string) {
        return Promise.resolve({ success: true })
      }
    }
  }

  applyTheme(themeInfo)

  // Wire up theme toggle for docs dev
  ;(window as any).__toggleDocsTheme = () => {
    themeInfo.isDark = !themeInfo.isDark
    applyTheme(themeInfo)
    themeCallbacks.forEach((cb) => cb({ ...themeInfo }))
  }

  ;(window as any).ztools = ztools
  ;(window as any).ztools.internal.onHotkeyRecorded = undefined
}

export function installMock() {
  mockZtools()
}
