import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { applyOsClass, type OsPlatform } from '../utils/themeUtils'

interface ZToolsOsHost {
  isMacOs?(): boolean
  isMacOS?(): boolean
  isWindows?(): boolean
  isLinux?(): boolean
}

const platform = ref<OsPlatform>('linux')
const isOsInitialized = ref(false)

function getOsHost(): ZToolsOsHost | null {
  if (typeof window !== 'undefined' && window.ztools) {
    return window.ztools as unknown as ZToolsOsHost
  }

  if (typeof ztools !== 'undefined') {
    return ztools as unknown as ZToolsOsHost
  }

  return null
}

export function detectOsPlatform(): OsPlatform {
  const host = getOsHost()

  if (host?.isMacOs?.() || host?.isMacOS?.()) {
    return 'darwin'
  }

  if (host?.isWindows?.()) {
    return 'win32'
  }

  if (host?.isLinux?.()) {
    return 'linux'
  }

  return 'linux'
}

function ensureOsState(): void {
  if (isOsInitialized.value) {
    return
  }

  platform.value = detectOsPlatform()
  applyOsClass(platform.value)
  isOsInitialized.value = true
}

export function useZtoolsOs(): {
  platform: Ref<OsPlatform>
  isMac: ComputedRef<boolean>
  isWindows: ComputedRef<boolean>
  isLinux: ComputedRef<boolean>
} {
  ensureOsState()

  return {
    platform,
    isMac: computed(() => platform.value === 'darwin'),
    isWindows: computed(() => platform.value === 'win32'),
    isLinux: computed(() => platform.value === 'linux')
  }
}
