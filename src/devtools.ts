import type { ModuleCustomTab } from '@nuxt/devtools-kit/types'
import type { Nuxt } from 'nuxt/schema'

export function setupDevTools(nuxt: Nuxt) {
  nuxt.hook('devtools:customTabs' as any, (tabs: ModuleCustomTab[]) => {
    tabs.push({
      category: 'server',
      name: 'better-auth',
      title: 'Auth',
      icon: 'i-lucide-shield-check',
      view: {
        type: 'iframe',
        src: '/__better-auth-devtools',
      },
    })
  })
}
