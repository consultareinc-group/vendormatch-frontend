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

        router.isReady().then(() => {
          if (response.data.role === 0) {
            router.push({ name: 'vendor' });
          } else {
            router.push({ name: 'buyer' });
          }
        });

      } else {
        router.isReady().then(() => {
          router.push({ name: 'signin' });
        });
      }
    } catch (error) {
      router.isReady().then(() => {
        router.push({ name: 'signin' });
      });
      console.log(error)
    }
  } else {
    // not working here

    router.isReady().then(() => {
      router.push({ name: 'signin' });
    });
  }
});
