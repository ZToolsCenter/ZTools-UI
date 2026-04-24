import { createRouter as _createRouter, createWebHistory } from 'vue-router'

export function createRouter() {
  return _createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('./views/HomeView.vue')
      },
      {
        path: '/docs',
        name: 'docs',
        component: () => import('./views/DocsView.vue')
      },
      {
        path: '/components',
        name: 'components',
        redirect: () => {
          // 默认重定向到第一个组件
          return { name: 'component-detail', params: { componentId: 'dropdown' } }
        }
      },
      {
        path: '/components/:componentId',
        name: 'component-detail',
        component: () => import('./views/ComponentsView.vue'),
        props: true
      }
    ]
  })
}
