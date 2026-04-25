import { componentIndex } from '../src/content/components/nav'

export default {
  paths() {
    return componentIndex.map((component) => ({
      params: {
        componentId: component.id
      }
    }))
  }
}
