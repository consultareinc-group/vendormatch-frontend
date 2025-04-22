import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing users-related data
export const useUserStore = defineStore('user', {
  state: () => ({
    Users: [],
    UserDetails: {},
    ShowUserDetailsDialog: false,
    ShowUserEditDialog: false,

  }),
  actions: {
    // Action to fetch specific users from the API
    SearchUser(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch users based on the offset
        api.get(`vendor-match/user?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise if the API request fails
        });
      });
    },
    // Action to update products
    UpdateUser(request) {
      return new Promise((resolve, reject) => {
        // Make a PUT request to update user information in the database
        api
          .put(`user-information/${request.id}`, request)
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },
  },
})
