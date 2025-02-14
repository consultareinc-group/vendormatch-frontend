const routes = [
  {
    path: '/',
    redirect: {
      name: 'signin'
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'products',
        name: 'products',
        component: () => import('src/pages/product/ProductList.vue')
      },
      {
        path: 'dashboard/vendor',
        name: 'vendor',
        component: () => import('src/pages/vendor/VendorDashboard.vue'),
        meta: { role: 'vendor' }
      },
      {
        path: 'dashboard/buyer',
        name: 'buyer',
        component: () => import('src/pages/buyer/BuyerDashboard.vue'),
        meta: { role: 'buyer' }
      },
      {
        path: 'inquiries',
        component: () => import('src/pages/vendor/InquiryPage.vue'),
        meta: { role: 'vendor' }
      }
    ]
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('src/pages/SignIn.vue')
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
