import introMd from './introduction.md?raw'
import gettingStartedMd from './getting-started.md?raw'
import themeMd from './theme.md?raw'

export interface DocNavEntry {
  id: string
  label: string
  md: string
}

export const docNavGroups = [
  {
    id: 'guide',
    label: '指南',
    children: [
      { id: 'introduction', label: '介绍', md: introMd },
      { id: 'getting-started', label: '快速上手', md: gettingStartedMd },
      { id: 'theme', label: '主题系统', md: themeMd }
    ] as DocNavEntry[]
  }
]

export const allDocs = docNavGroups.flatMap((g) => g.children)
