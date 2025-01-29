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
        component: () => import('pages/ProductList.vue')
      },
      {
        path: 'dashboard/vendor',
        component: () => import('pages/SupplierDashboard.vue'),
        meta: { requiresAuth: true, role: 'supplier' }
      },
      {
        path: 'dashboard/buyer',
        component: () => import('pages/RetailerDashboard.vue'),
        meta: { requiresAuth: true, role: 'retailer' }
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
