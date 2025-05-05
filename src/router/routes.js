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
        path: 'rfq-requests',
        name: 'rfq-requests',
        component: () => import('src/pages/request-for-quotation/RFQRequest.vue'),
      },
      {
        path: 'rfq-responses',
        name: 'rfq-responses',
        component: () => import('src/pages/request-for-quotation/RFQResponse.vue'),
      },
      {
        path: 'create-account',
        name: 'create-account',
        component: () => import('src/pages/CreateAccount.vue'),
      },
      {
        path: 'users',
        component: () => import('src/pages/user-management/UserManagement.vue'),
        meta: { level: 0 }
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
