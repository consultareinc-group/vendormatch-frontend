import { defineStore } from 'pinia'

export const useTriggerStore = defineStore('triggers', {
  state: () => ({
    RightDrawerOpen: true,
    AddProductDialog: false,
    EditProductDialog: false,
    ViewProductDetailsDialog: false,
    DeleteProductDialog: false
  }),

  getters: {
  },

  actions: {

  }
})
