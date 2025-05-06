const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'accounts',
        component: () => import('src/pages/account/AccountList.vue'),
        meta: { level: 0 }
      },
      {
        path: 'create-account',
        name: 'create-account',
        component: () => import('src/pages/account/CreateAccount.vue'),
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
