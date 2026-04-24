const componentNames = [
  'AdaptiveIcon',
  'Button',
  'Checkbox',
  'ColorPicker',
  'CommandCard',
  'CommandTag',
  'ConfirmDialog',
  'DetailPanel',
  'Dropdown',
  'FeatureCard',
  'HotkeyInput',
  'Input',
  'PluginDetail',
  'Radio',
  'ShortcutEditor',
  'Slider',
  'Switch',
  'Tag',
  'TagDropdown',
  'Toast'
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
