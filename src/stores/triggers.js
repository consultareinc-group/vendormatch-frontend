import { defineStore } from 'pinia'

export const useTriggerStore = defineStore('triggers', {
  state: () => ({
    RightDrawerOpen: false,
    AddProductDialog: false,
    EditProductDialog: false,
    ViewProductDetailsDialog: false,
    DeleteProductDialog: false,
    SavedProductsLoadingState: false
  }),

  getters: {
  },

  actions: {

  }
})
