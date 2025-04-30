import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing users-related data
export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    EnterpriseList: [],
    EnterpriseDetails: {},
    ShowEnterpriseEditDialog: false
  }),
  actions: {
    // Action to fetch enterprises from the API
    GetEnterprises($request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch enterprises
        api.get(`enterprise?${$request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise if the API request fails
        });
      });
    },
    // Action to fetch enterprise from the API
    GetEnterprise($request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch enterprise
        api.get(`enterprise/${$request.id}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise if the API request fails
        });
      });
    },
    // Action to update enterprise
    UpdateEnterprise(request) {
      return new Promise((resolve, reject) => {
        // Make a PUT request to update enterprise information in the database
        api
          .put(`enterprise/${request.id}`, request)
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
