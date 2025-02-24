import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing users-related data
export const useBuyerStore = defineStore('buyer', {
  state: () => ({
    Buyers: []
  }),
  actions: {
    // Action to fetch specific users from the API
    SearchBuyer(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch users based on the offset
        api.get(`vendor-match/buyer?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise if the API request fails
        });
      });
    },
  },
})
