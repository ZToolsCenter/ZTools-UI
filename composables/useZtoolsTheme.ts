import { ref, type Ref } from 'vue'
import { applyOsClass } from '../utils/themeUtils'

export interface ThemeInfo {
  isDark: boolean
  primaryColor?: string
  customColor?: string
  windowMaterial: string
}

export interface UseZtoolsThemeResult {
  isDark: Ref<boolean>
  primaryColor: Ref<string | undefined>
  customColor: Ref<string | undefined>
  windowMaterial: Ref<string>
}

export const themeClasses = [
  'theme-blue',
  'theme-purple',
  'theme-green',
  'theme-orange',
  'theme-red',
  'theme-pink',
  'theme-custom'
] as const

const isDark = ref(false)
const primaryColor = ref<string>()
const customColor = ref<string>()
const windowMaterial = ref('none')
let isThemeInitialized = false

interface ZToolsThemeHost {
  getThemeInfo(): ThemeInfo
  onThemeChange(callback: (theme: ThemeInfo) => void): void
}

function getThemeHost(): ZToolsThemeHost | null {
  if (typeof window !== 'undefined' && window.ztools) {
    const host = window.ztools as unknown as Partial<ZToolsThemeHost>
    if (typeof host.getThemeInfo === 'function' && typeof host.onThemeChange === 'function') {
      return host as ZToolsThemeHost
    }
  }

  if (typeof ztools !== 'undefined') {
    const host = ztools as unknown as Partial<ZToolsThemeHost>
    if (typeof host.getThemeInfo === 'function' && typeof host.onThemeChange === 'function') {
      return host as ZToolsThemeHost
    }
  }

  return null
}

function syncThemeState(theme: ThemeInfo): void {
  isDark.value = theme.isDark
  primaryColor.value = theme.primaryColor
  customColor.value = theme.customColor
  windowMaterial.value = theme.windowMaterial
}

export function applyTheme(theme: ThemeInfo): void {
  syncThemeState(theme)

  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('data-material', theme.windowMaterial)
  document.documentElement.classList.toggle('dark', theme.isDark)

  document.body.classList.remove(...themeClasses)

  if (theme.primaryColor) {
    document.body.classList.add(`theme-${theme.primaryColor}`)
  }

  if (theme.customColor) {
    document.documentElement.style.setProperty('--primary-color', theme.customColor)
  } else {
    document.documentElement.style.removeProperty('--primary-color')
  }
}

function ensureThemeState(): void {
  if (isThemeInitialized) {
    return
  }

  const host = getThemeHost()
  if (!host) {
    return
  }

  applyTheme(host.getThemeInfo())
  applyOsClass()
  host.onThemeChange((theme) => {
    applyTheme(theme)
  })
  isThemeInitialized = true
}

export function useZtoolsTheme(): UseZtoolsThemeResult {
  ensureThemeState()
  return {
    isDark,
    primaryColor,
    customColor,
    windowMaterial
  }
}

export function useColorScheme(): { isDark: Ref<boolean> } {
  ensureThemeState()
  return { isDark }
}
