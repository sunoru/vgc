import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'replays',
        component: () => import('src/pages/ReplayImporterPage.vue'),
      },
      {
        path: 'battles',
        component: () => import('pages/BattlesPage.vue'),
      },
      {
        path: 'damagecalc',
        component: () => import('pages/DamageCalcPage.vue'),
      },
      {
        path: 'speed-tiers',
        component: () => import('pages/SpeedTiersPage.vue'),
      },
      {
        path: 'scripts',
        component: () => import('pages/ScriptsPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
