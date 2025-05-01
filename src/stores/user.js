import { defineStore } from 'pinia';
import { api } from 'boot/axios';


export const useUserStore = defineStore('user', {
  state: () => ({
    Users: [],
    UserDetails: {},
    ShowUserDetailsDialog: false,
    ShowUserEditDialog: false,
    ShowPasswordDialog: false,

  }),
  actions: {

    SearchUser(request) {
      return new Promise((resolve, reject) => {

        api.get(`vendor-match/user?${request}`).then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        });
      });
    },

    UpdateUser(request) {
      return new Promise((resolve, reject) => {
        api
          .put(`user-information/${request.id}`, request)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ChangePassword(request) {
      return new Promise((resolve, reject) => {

        api
          .put(`user-information/${request.id}`, request)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ChangeStatus(request) {
      return new Promise((resolve, reject) => {
        api
          .put(`user-information/${request.id}`, request)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
})
