<template>
  <div>
    <div v-if="triggerStore.SavedProductsLoadingState">
      <q-list v-for="n in 3" :key="n" separator>
        <q-item v-ripple>
          <q-item-section avatar>
            <q-avatar>
              <q-skeleton type="QAvatar" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-skeleton height="40px" />
          </q-item-section>

          <q-item-section side>
            <q-skeleton width="30px" height="30px" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-list v-else separator>
      <q-item
        @click="showProductDetailsDialog(product)"
        v-for="product in productStore.SavedProducts"
        :key="product.id"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="`data:image/jpeg;base64,${product.image[0].binary ?? ''}`" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="ellipsis">{{ product.product_name ?? product.name }}</q-item-label>
          <q-item-label caption>{{ product.enterprise_name }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn flat round color="secondary" icon="message" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { useProductStore } from 'src/stores/products'
import { useTriggerStore } from 'src/stores/triggers' // Import trigger store for managing UI triggers
// Import component for viewing product details

// Initialize product and trigger stores
const productStore = useProductStore()
const triggerStore = useTriggerStore()

// Function to show product details in a dialog
const showProductDetailsDialog = (product_details) => {
  triggerStore.ViewProductDetailsDialog = true // Open the product details dialog
  product_details.id = product_details.product_id
  productStore.ProductDetails = product_details // Set the selected product details in the store
}
</script>
