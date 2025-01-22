import { defineStore } from 'pinia'

export const useTriggerStore = defineStore('triggers', {
  state: () => ({
    RightDrawerOpen: false,
    AddProductDialog: false,
    ViewProductDetailsDialog: false
  }),

  getters: {
  },

  actions: {

  }
})
