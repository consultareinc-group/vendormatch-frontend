import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth';
import { LocalStorage } from 'quasar';

export default boot(async ({ router }) => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for Axios to fully initialize

  const authStore = useAuthStore();
  const token = LocalStorage.getItem('Bearer');

  router.isReady().then(() => {
    if (router.currentRoute.value.name !== 'signin' || router.currentRoute.value.name !== 'signup') {
      return;
    }
  });

  if (token) {
    try {
      const response = await authStore.ValidateToken();
      if (response.status === 'success') {
        const userRole = response.data.role; // Get user role from API response
        const userLevel = response.data.level; // Get user role from API response

        router.beforeEach((to, from, next) => {

          if (to.meta?.role !== undefined) {
            if (!to.meta.role.includes(userRole)) {
              next({ name: 'signin' }); // Redirect to sign-in if role doesn't match
            } else {
              next(); // Allow navigation
            }
          } else if (to.meta?.level !== undefined && to.meta.level !== userLevel) {
            next({ name: 'signin' }); // Redirect to sign-in if level doesn't match
          } else {
            next(); // Allow navigation
          }
        });

        router.isReady().then(() => {
          if (router.currentRoute.value.name === 'signin') {
            router.push(userRole === 0 ? { name: 'vendor' } : { name: 'buyer' });
          }
        });

      } else {
        router.isReady().then(() => {
          router.push({ name: 'signin' });

        });
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      router.isReady().then(() => {

        router.push({ name: 'signin' });

      });
    }
  } else {
    router.isReady().then(() => {
      if (router.currentRoute.value.name === 'signup') {
        router.push({ name: 'signup' });
      } else {
        router.push({ name: 'signin' });
      }
    });
  }
});
