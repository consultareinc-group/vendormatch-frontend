import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'counter' for managing products-related data
export const useProductStore = defineStore('product', {
  state: () => ({
    Products: [],
    VendorProducts: [],
    SearchedProducts: [],
    ProductDetails: {},
    SavedProducts: [],
    RecommendedProducts: [],
    SearchedInquiryProducts: []
  }),
  actions: {
    // Action to fetch products from the API with pagination support
    GetProducts(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch products based on the offset
        api.get(`vendor-match/product?${request}`).then((response) => {
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
        api.get(`vendor-match/product?${request}`).then((response) => {
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
    // Action to update products
    UpdateProduct(request) {
      return new Promise((resolve, reject) => {
        // Define headers with Content-Type
        const headers = {
          'Content-Type': 'multipart/form-data'
        };

        // Make a POST request to insert products in the database products table
        api
          .post(`vendor-match/product/${request.id}`, request.form, { headers })
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
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

    // Action to insert products
    NotifyVendor(request) {
      return new Promise((resolve, reject) => {
        // Make a POST request to insert products in the database products table
        api
          .post(`vendor-match/notify`, request)
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },

    // Action to fetch favorite products from the API
    GetFavoriteProducts(request) {
      return new Promise((resolve, reject) => {
        // Make a GET request to fetch products based on the offset
        api.get(`vendor-match/favorite?${request}`).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((error) => {
          reject(error); // Reject the promise with the error response data
        });
      });
    },

    // Action to add product in favorites
    AddProductToFavorites(request) {
      return new Promise((resolve, reject) => {
        // Make a POST request to add products in the database favorite table
        api
          .post(`vendor-match/favorite`, request)
          .then((response) => {
            resolve(response.data); // Resolve the promise with the API response data
          })
          .catch((error) => {
            reject(error); // Reject the promise if the API request fails
          });
      });
    },

    // Action to delete the favorite product
    DeleteFavoriteProduct(request) {
      return new Promise((resolve, reject) => {
        // Make a DELETE request to delete product in the database products table
        api.delete(`vendor-match/favorite/${request.id}`, { data: request }).then((response) => {
          resolve(response.data); // Resolve the promise with the API response data
        }).catch((response) => {
          reject(response.data); // Reject the promise if the API request fails
        });
      });
    },
  },
})
