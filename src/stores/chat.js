import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing messages-related data
export const useMessageStore = defineStore('message', {
  state: () => ({
    Messages: [],
    MessageDetails: {},
    SearchedMessages: []
  }),
  actions: {
    // Action to fetch messages from the API with pagination support
    GetMessages(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch messages based on the offset
        api.get(`vendor-match/chat?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise with the error response data
        });
      });
    },
    // Action to insert messages
    InsertMessage(request) {
      return new Promise((resolve, reject) => {
        api
          .post(`vendor-match/chat`, request)
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },
    // Action to fetch inquiries from the products
    SearchMessages(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch users based on the offset
        api.get(`vendor-match/chat?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise if the API request fails
        });
      });
    },
  },
})
