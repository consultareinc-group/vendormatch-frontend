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
        component: () => import('src/pages/dashboard/VendorDashboard.vue'),
        meta: { role: [0, 2] }
      },
      {
        path: 'dashboard/buyer',
        name: 'buyer',
        component: () => import('src/pages/dashboard/BuyerDashboard.vue'),
        meta: { role: [1] }
      },
      {
        path: 'inquiries',
        name: 'inquiries',
        component: () => import('src/pages/inquiry/InquiryPage.vue'),
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
