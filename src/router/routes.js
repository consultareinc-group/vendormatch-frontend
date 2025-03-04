const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard/vendor',
        name: 'vendor',
        component: () => import('src/pages/vendor/VendorDashboard.vue'),
        meta: { role: 0 }
      },
      {
        path: 'dashboard/buyer',
        name: 'buyer',
        component: () => import('src/pages/buyer/BuyerDashboard.vue'),
        meta: { role: 1 }
      },
      {
        path: 'inquiries',
        name: 'inquiries',
        component: () => import('src/pages/vendor/InquiryPage.vue'),
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
