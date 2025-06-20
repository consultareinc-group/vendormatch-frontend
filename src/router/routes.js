const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'products',
        name: 'products',
        component: () => import('src/pages/product/ProductList.vue')
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('src/pages/dashboard/admin/AdminDashboard.vue'),
        meta: { level: 0 }
      },
      {
        path: 'dashboard/vendor',
        name: 'vendor',
        component: () => import('src/pages/dashboard/VendorDashboard.vue'),
        meta: { role: 0 }
      },
      {
        path: 'dashboard/buyer',
        name: 'buyer',
        component: () => import('src/pages/dashboard/BuyerDashboard.vue'),
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
