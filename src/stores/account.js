import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing users-related data
export const useAccountStore = defineStore('account', {
  state: () => ({

  }),
  actions: {
    // Action to insert enterprise information
    RegisterEnterprise(request) {
      return new Promise((resolve, reject) => {
        api
          .post(`enterprise`, request)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // Action to insert user information
    RegisterUser(request) {
      return new Promise((resolve, reject) => {
        // Define headers with Content-Type
        const headers = {
          'Content-Type': 'multipart/form-data'
        };
        api
          .post(`register-account`, request, { headers })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // Action to insert user permissions
    RegisterUserPermission(request) {
      return new Promise((resolve, reject) => {
        api
          .post(`permission`, request)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

  },
})
