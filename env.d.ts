/// <reference types="vite/client" />
/// <reference types="vitepress/client" />

declare module '*.md?raw' {
  const content: string
  export default content
}

declare module '*.vue?raw' {
  const content: string
  export default content
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, never>, Record<string, never>, any>
  export default component
}

declare module 'virtual:uno.css'

interface ThemeInfo {
  isDark: boolean
  primaryColor?: string
  customColor?: string
  windowMaterial: string
}

interface ZToolsGlobal {
  removeSubInput(): void
  setSubInput(
    callback: (payload: { text: string }) => void,
    placeholder?: string,
    autoFocus?: boolean
  ): boolean
  setSubInputValue(value: string): void
  subInputFocus?: () => boolean
  subInputSelect?: () => boolean
  getThemeInfo(): ThemeInfo
  onThemeChange(callback: (theme: ThemeInfo) => void): void
  isMacOs?(): boolean
  isMacOS?(): boolean
  isWindows?(): boolean
  isLinux?(): boolean
}

interface ZToolsInternal {
  [key: string]: any
  analyzeImage(src: string): Promise<any>
  startHotkeyRecording(): Promise<{ success: boolean; error?: string }>
  onHotkeyRecorded?: (callback: (shortcut: string) => void) => void
  getPlatform(): string
  dbGet(key: string): Promise<any>
  dbPut(key: string, value: any): Promise<any>
  installPluginFromMarket(plugin: any): Promise<{ success: boolean; error?: string; plugin?: any }>
  getPluginReadme(idOrPath: string): Promise<{ success: boolean; error?: string; content?: string }>
  getPluginDocKeys(name: string): Promise<{ success: boolean; error?: string; data?: any[] }>
  clearPluginData(name: string): Promise<{ success: boolean; error?: string }>
  getPluginDoc(
    name: string,
    key: string
  ): Promise<{ success: boolean; error?: string; data?: any; type?: 'document' | 'attachment' }>
  getPluginMemoryInfo(
    path: string
  ): Promise<{ success: boolean; error?: string; data?: { private: number; shared: number; total: number } }>
}

declare const ztools: ZToolsGlobal

interface Window {
  __setDocsTheme?: (isDark: boolean) => void
  ztools: ZToolsGlobal & {
    isWindows(): boolean
    shellOpenExternal(url: string): void
    internal: ZToolsInternal
  }
}
