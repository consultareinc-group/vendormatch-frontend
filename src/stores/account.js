import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing users-related data
export const useAccountStore = defineStore('account', {
  state: () => ({
    Enterprises: []
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
    // Action to fetch enterprise from the API
    SearchEnterprise(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch enterprises based on the offset
        api.get(`enterprise?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise if the API request fails
        });
      });
    },
  },
})
