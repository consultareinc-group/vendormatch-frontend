const routes = [
  {
    path: '/',
    redirect: {
      name: 'products'
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
        component: () => import('src/pages/supplier/SupplierDashboard.vue'),
        meta: { role: 'vendor' }
      },
      {
        path: 'dashboard/buyer',
        name: 'buyer',
        component: () => import('src/pages/buyer/BuyerDashboard.vue'),
        meta: { role: 'buyer' }
      },
      // {
      //   path: 'login',
      //   component: () => import('pages/Login.vue')
      // },
      // {
      //   path: 'register',
      //   component: () => import('pages/Register.vue')
      // },
      // {
      //   path: 'profile',
      //   component: () => import('pages/Profile.vue'),
      //   meta: { requiresAuth: true }
      // },
    ]
  },
  {
    path: '/signin',
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
