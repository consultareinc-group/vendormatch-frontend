import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests
import { LocalStorage } from 'quasar';

// Define a Pinia store named 'counter' for managing users-related data
export const useAuthStore = defineStore('auth', {
  state: () => ({
    UserInformation: {}
  }),
  actions: {
    // Action to fetch specific users from the API
    GetUser(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch users based on the offset
        api.get(`login/${request.id}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },

    // Action to insert users
    LoginUser(request) {
      return new Promise((resolve, reject) => {
        // Make a POST request to insert users in the database users table
        api
          .post(`login`, request)
          .then((response) => {
            if (response.data.status === 'success') {
              this.UserInformation = response.data.data
              this.SetBearerToken(response.data.data.bearer_token)
            }
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },

    ValidateToken() {
      return new Promise((resolve, reject) => {
        api.get(`validate-token`)
          .then((response) => {
            if (response.data.status === 'success') {
              this.UserInformation = response.data.data
            }
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    SetBearerToken(token) {
      if (token !== null) {
        LocalStorage.set('Bearer', token);
      } else {
        LocalStorage.remove('Bearer');
      }
    }

  },
})
