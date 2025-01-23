const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard/vendor',
        component: () => import('src/pages/supplier/SupplierDashboard.vue'),
        meta: { requiresAuth: true, role: 'supplier' }
      },
      {
        path: 'dashboard/buyer',
        component: () => import('src/pages/buyer/BuyerDashboard.vue'),
        meta: { requiresAuth: true, role: 'retailer' }
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
