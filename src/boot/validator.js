import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth';
import { LocalStorage } from 'quasar';

export default boot(async ({ router }) => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for Axios to fully initialize

  const authStore = useAuthStore();
  const token = LocalStorage.getItem('Bearer');

  if (token) {
    try {
      const response = await authStore.ValidateToken();
      if (response.status === 'success') {
        const userRole = response.data.role; // Get user role from API response

        router.beforeEach((to, from, next) => {
          if (to.meta?.role !== undefined && to.meta.role !== userRole) {
            next({ name: 'signin' }); // Redirect to sign-in if role doesn't match
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
      router.push({ name: 'signin' });
    });
  }
});
