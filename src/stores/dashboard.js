import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a state management store
import { api } from 'boot/axios'; // Import the axios instance for API requests

// Define a Pinia store named 'dashboard' for managing data summary
export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
  }),
  actions: {
    GetTotalProducts() {
      return new Promise((resolve, reject) => {
        api.get(`vendor-match/dashboard/products/count`).then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    GetTotalPublishedProducts() {
      return new Promise((resolve, reject) => {
        api.get(`vendor-match/dashboard/products/count?status=Publish`).then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    GetTotalRFQs() {
      return new Promise((resolve, reject) => {
        api.get(`vendor-match/dashboard/rfq/count`).then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    GetTotalInquiries() {
      return new Promise((resolve, reject) => {
        api.get(`vendor-match/dashboard/inquiry/count?is_verified=0`).then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    GetTotalEnterprises() {
      return new Promise((resolve, reject) => {
        api.get(`vendor-match/dashboard/enterprise/count`).then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    GetTotalUsers() {
      return new Promise((resolve, reject) => {
        api.get(`vendor-match/dashboard/user/count`).then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        });
      });
    },
  },
})
