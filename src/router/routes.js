const routes = [
  {
    path: '/',
    redirect: {
      name: 'signin'
    },
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('src/pages/SignIn.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('src/pages/SignUp.vue')
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
