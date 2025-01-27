import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing products-related data
export const useProductStore = defineStore('product', {
  state: () => ({
    Products: [],
    ProductDetails: {}
  }),
  actions: {
    // Action to fetch products from the API with pagination support
    async GetProducts(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch products based on the offset
        api.get(`vendor-match/product?offset="${request.offset}"`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise with the error response data
        });
      });
    },
    // Action to fetch specific products from the API
    GetProduct(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch products based on the offset
        api.get(`vendor-match/product/${request.id}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },
    // Action to search for products using a keyword
    SearchProducts(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch products matching the search keyword
        api.get(`vendor-match/product?search_keyword="${request.keyword}"`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },
    // Action to insert products
    InsertProduct(request) {
      return new Promise((resolve, reject) => {
        // Define headers with Content-Type
        const headers = {
          'Content-Type': 'multipart/form-data'
        };

        // Make a POST request to insert products in the database products table
        api
          .post(`vendor-match/product`, request, { headers })
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },
    // Action to insert products
    UpdateProduct(request) {
      return new Promise((resolve, reject) => {
        // Make a POST request to insert products in the database products table
        api.put(`vendor-match/product/${request.id}`, request).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },
    // Action to delete product
    DeleteProduct(request) {
      return new Promise((resolve, reject) => {
        // Make a DELETE request to delete product in the database products table
        api.delete(`vendor-match/product/${request.id}`, { data: request }).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },
  },
})
