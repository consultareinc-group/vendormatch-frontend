<template>
  <q-dialog v-model="triggerStore.DeleteProductDialog">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">Confirm Deletion</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Are you sure you want to delete <b>{{ productStore.ProductDetails.name }}?</b>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
        <q-btn
          flat
          label="OK"
          color="primary bg-primary text-white"
          @click="deleteProduct()"
          :loading="btnDeleteLoadingState"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
// Import Vue's reactive and lifecycle utilities
import { ref } from 'vue'

// Import the store for dashboard-related state management
import { useProductStore } from 'src/stores/products'
import { useTriggerStore } from 'src/stores/triggers'

// Import Quasar framework utilities
import { useQuasar } from 'quasar'

// Initialize Quasar for UI utilities
const $q = useQuasar()

// Initialize the dashboard store for state and actions related to the dashboard
const productStore = useProductStore()

// Initialize the trigger store for state and actions related to the triggers
const triggerStore = useTriggerStore()

const deleteProductDialog = ref(false)
const btnDeleteLoadingState = ref(false)

const deleteProduct = () => {
  btnDeleteLoadingState.value = true
  // Handle product deletion
  productStore
    .DeleteProduct({ id: productStore.ProductDetails.id })
    .then((response) => {
      let status = Boolean(response.status === 'success') // Determine the status of the response
      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the product ${status ? 'has been' : 'was not'} deleted.</p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })

      if (status) {
        const index = productStore.Products.findIndex(
          (product) => product.id === productStore.ProductDetails.id,
        )
        if (index !== -1) {
          productStore.Products.splice(index, 1) // Remove the product at the found index
        }
        deleteProductDialog.value = false
      }
    })
    .catch((error) => {
      // Notify user of the error
      $q.notify({
        message: `<p class='q-mb-none'>${error.message}</p>`,
        color: `red-2`,
        position: 'top-right',
        textColor: `red`,
        html: true,
      })
    })
    .finally(() => {
      btnDeleteLoadingState.value = false
      triggerStore.DeleteProductDialog = false
    })
}
</script>
