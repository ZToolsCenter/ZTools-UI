const componentNames = [
  'ZAdaptiveIcon',
  'ZButton',
  'ZCheckbox',
  'ZColorPicker',
  'ZCommandCard',
  'ZCommandTag',
  'ZConfirmDialog',
  'ZDetailPanel',
  'ZSelect',
  'ZFeatureCard',
  'ZHotkeyInput',
  'ZInput',
  'ZPluginDetail',
  'ZRadio',
  'ZShortcutEditor',
  'ZSlider',
  'ZSwitch',
  'ZTag',
  'ZTagDropdown',
  'ZToast'
] as const

export type ZToolsUIComponentName = (typeof componentNames)[number]

export interface ZToolsUIResolverOptions {
  importStyle?: boolean
}

export function ZToolsUIResolver(options: ZToolsUIResolverOptions = {}) {
  const { importStyle = true } = options
  const componentNameSet = new Set<string>(componentNames)

  return {
    type: 'component' as const,
    resolve: (name: string) => {
      if (!componentNameSet.has(name)) {
        return undefined
      }

      return {
        name,
        from: 'ztools-ui',
        sideEffects: importStyle ? 'ztools-ui/style' : undefined
      }
    }
  }
}
