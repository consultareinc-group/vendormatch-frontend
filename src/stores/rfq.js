import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing rfq-related data
export const useRFQStore = defineStore('rfq', {
  state: () => ({
    RFQs: [],
    RFQSearchResults: [],
    RFQDetails: {},
    RFQRequests: [],
    RFQResponses: [],
    RFQResponseDetails: {},
    RFQResponseMessages: [],

    // Triggers to show/hide the RFQ dialog
    ShowRFQDetailsDialog: false,
    ShowRFQRespondDialog: false,
    ShowBuyerReplyFormDialog: false,
    ShowVendorReplyFormDialog: false,
    ShowRFQEditDialog: false,
    // Triggers for loading state
    RFQCardLoading: false,
    // Trggers for true actions
    RFQSearching: false,
  }),
  actions: {
    // Action to fetch rfqs from the API with pagination support
    GetRFQs(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch rfqs based on the offset
        api.get(`vendor-match/rfq?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise with the error response data
        });
      });
    },
    // Action to fetch specific rfqs from the API
    GetRFQ(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch rfqs based on the offset
        api.get(`vendor-match/rfq/${request.id}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },
    // Action to fetch specific rfq attachment from the API
    GetRFQAttachment(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch rfqs based on the offset
        api.get(`vendor-match/rfq?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },
    // Action to search for rfqs using a keyword
    SearchRFQs(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch rfqs matching the search keyword
        api.get(`vendor-match/rfq?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },
    // Action to insert rfqs
    InsertRFQ(request) {
      return new Promise((resolve, reject) => {
        // Define headers with Content-Type
        const headers = {
          'Content-Type': 'multipart/form-data'
        };

        // Make a POST request to insert rfqs in the database rfqs table
        api
          .post(`vendor-match/rfq`, request, { headers })
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },
    // Action to update rfqs
    UpdateRFQ(request) {
      return new Promise((resolve, reject) => {
        // Define headers with Content-Type
        const headers = {
          'Content-Type': 'multipart/form-data'
        };

        // Make a POST request to insert rfqs in the database rfqs table
        api
          .post(`vendor-match/rfq/${request.id}`, request.form, { headers })
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },
    // Action to delete rfq
    DeleteRFQ(request) {
      return new Promise((resolve, reject) => {
        // Make a DELETE request to delete rfq in the database rfqs table
        api.delete(`vendor-match/rfq/${request.id}`, { data: request }).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },
    // Action to fetch rfqs responses from the API with pagination support
    GetRFQResponses(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch rfqs responses based on the offset
        api.get(`vendor-match/rfq-response?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise with the error response data
        });
      });
    },
    // Action to insert reponse to rfq
    InsertRFQResponse(request) {
      return new Promise((resolve, reject) => {

        // Make a POST request to insert rfq response in the database rfq response table
        api
          .post(`vendor-match/rfq-response`, request)
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },
    // Action to insert reponse to rfq
    ReplyToRFQResponse(request) {
      return new Promise((resolve, reject) => {

        // Make a POST request to insert rfq response in the database rfq response table
        api
          .post(`vendor-match/rfq-message`, request)
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },
    GetMessages(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch messages based on the offset
        api.get(`vendor-match/rfq-message?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise with the error response data
        });
      });
    },
  },
})
