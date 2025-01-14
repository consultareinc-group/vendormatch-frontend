import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    // role: 'buyer',
    role: 'vendor',
  });
  const isAuthenticated = ref(false);

  function setUser(userData) {
    user.value = userData;
    isAuthenticated.value = true;
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
  }

  return {
    user,
    isAuthenticated,
    setUser,
    logout
  };
});
