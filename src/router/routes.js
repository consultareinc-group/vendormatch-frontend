const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'request-for-quotation',
        name: 'request-for-quotation',
        component: () => import('src/pages/request-for-quotation/CreateRFQ.vue'),
      },
      {
        path: 'request-for-quotation-cards',
        name: 'request-for-quotation-cards',
        component: () => import('src/pages/request-for-quotation/RFQCards.vue'),
      },
      {
        path: 'request-for-quotation-list',
        name: 'request-for-quotation-list',
        component: () => import('src/pages/request-for-quotation/RFQList.vue'),
      }
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
