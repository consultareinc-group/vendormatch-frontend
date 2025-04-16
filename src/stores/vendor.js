import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing users-related data
export const useVendorStore = defineStore('vendor', {
  state: () => ({
    Vendors: [],
    VendorList: [],
  }),
  actions: {
    // Action to fetch specific vendor from the API
    SearchVendor(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch users based on the offset
        api.get(`vendor-match/vendor?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise if the API request fails
        });
      });
    },
    // Action to fetch specific vendors from the API
    GetVendors(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch vendors based on the offset
        api.get(`vendor-match/vendor?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise if the API request fails
        });
      });
    },
  },
})
