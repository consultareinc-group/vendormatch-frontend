<template>
  <div class="row q-col-gutter-md">
    <!-- Products Grid -->
    <div v-if="cardLoadingState" class="col-12">
      <div class="row q-col-gutter-sm">
        <div v-for="n in 8" :key="n" class="col-12 col-sm-6 col-md-3">
          <q-card class="product-card">
            <q-skeleton height="192px" width="100%"></q-skeleton>

            <q-card-section class="q-pa-none q-pl-sm q-mt-sm q-pr-sm">
              <q-skeleton square></q-skeleton>
              <q-skeleton square></q-skeleton>
              <q-skeleton square></q-skeleton>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-none q-mt-sm q-mb-sm q-pr-sm">
              <q-skeleton square width="158px" height="24px"></q-skeleton>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <div v-else class="col-12">
      <div class="row q-col-gutter-sm">
        <div
          @click="showProductDetailsDialog(product)"
          v-for="product in products"
          :key="product.id"
          class="col-12 col-sm-6 col-md-3 cursor-pointer"
        >
          <q-card class="product-card">
            <q-img
              :src="`data:image/jpeg;base64,${product?.image?.[0]?.binary}`"
              :ratio="1"
              alt="Product Image"
            />

            <q-card-section>
              <div class="text-weight-medium ellipsis">
                {{ product?.name }}
                <q-tooltip>
                  {{ product?.name }}
                </q-tooltip>
              </div>
              <div class="text-subtitle2">{{ product?.category }}</div>
              <div class="text-body2 q-mt-sm">
                <span class="text-grey">Cost:</span> ${{ product?.size?.[0]?.cost }}
              </div>
            </q-card-section>

            <q-card-actions class="flex justify-between items-center cursor-pointer">
              <q-spinner-hearts v-if="showHeartLoadingState(product.id)" size="lg" color="grey" />
              <q-icon
                v-else
                @click.stop="addToFavorite(product)"
                :name="isSavedToProduct(product.id) ? 'favorite' : 'favorite_border'"
                color="secondary"
                size="sm"
              />
              <q-btn flat color="primary" no-caps label="Connect to Vendor" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <ViewProductDetails v-if="triggerStore.ViewProductDetailsDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue' // Import Vue's ref and onMounted for reactivity and lifecycle handling
import { useProductStore } from 'src/stores/products' // Import product store for managing product-related state
import { useTriggerStore } from 'src/stores/triggers' // Import trigger store for managing UI triggers
// import { useAuthStore } from 'src/stores/auth' // Import auth store (commented out, possibly unused)

// Import Quasar framework utilities
import { useQuasar } from 'quasar'

// Import component for viewing product details
import ViewProductDetails from './ViewProductDetails.vue'

// Initialize product and trigger stores
const productStore = useProductStore()
const triggerStore = useTriggerStore()

// Initialize Quasar for UI utilities like notifications
const $q = useQuasar()

// const authStore = useAuthStore() // Commented out, possibly for future use

// Reactive variable to track loading state of the card
const cardLoadingState = ref(false)

const products = computed(() => {
  if (productStore.SearchedProducts.length) {
    return productStore.SearchedProducts
  } else {
    return productStore.Products
  }
})

// Fetch products when the component is mounted
onMounted(() => {
  cardLoadingState.value = true // Set loading state to true while fetching data
  if (productStore.Products.length) {
    cardLoadingState.value = false
  }
  // set search products to empty on page load
  productStore.SearchedProducts = []
  productStore
    .GetProducts(`offset=${productStore.Products.length}&include_image=1`) // Fetch products with offset and include images
    .then((response) => {
      if (response.status === 'success') {
        // Check if API call was successful
        response.data.forEach((product) => {
          productStore.Products.push(product) // Add each product to the store
        })
      }
    })
    .catch((error) => {
      // Show a notification if an error occurs
      $q.notify({
        message: `<p class='q-mb-none'>${error.message}</p>`, // Display error message
        color: `red-2`, // Set notification background color
        position: 'top-right', // Set notification position on the screen
        textColor: `red`, // Set text color
        html: true, // Enable HTML content in the message
      })
    })
    .finally(() => {
      cardLoadingState.value = false // Reset loading state after API call is completed
    })

  if (!productStore.SavedProducts.length) {
    productStore.GetFavoriteProducts(`offset=0&limit=3`).then((response) => {
      if (response.status === 'success') {
        productStore.SavedProducts = response.data // Add each product to the saved product store
      }
    })
  }
})

// Function to show product details in a dialog
const showProductDetailsDialog = (product_details) => {
  triggerStore.ViewProductDetailsDialog = true // Open the product details dialog
  productStore.ProductDetails = product_details // Set the selected product details in the store
}

// Reactive variable to track selected product ID
const selected_product_id = ref(0)

// Reactive variable to track loading state for adding to favorites
const favoriteLoadingState = ref(false)

// Function to add a product to favorites
const addToFavorite = (product) => {
  selected_product_id.value = product.id // Store the selected product ID
  favoriteLoadingState.value = true // Set loading state to true while processing

  if (!isSavedToProduct(product.id)) {
    productStore
      .AddProductToFavorites({ product_id: product.id }) // Call store action to add product to favorites
      .then((response) => {
        if (response.status === 'success') {
          // Check if API call was successful
          product.product_id = product.id // Assign product ID to the object
          if (productStore.SavedProducts.length !== 3) {
            productStore.SavedProducts.push(product) // Add product to saved products list
          }
        }
      })
      .finally(() => {
        favoriteLoadingState.value = false // Reset loading state after API call is completed
      })
  } else {
    productStore
      .DeleteFavoriteProduct({ id: product.id })
      .then((response) => {
        if (response.status === 'success') {
          let index = productStore.SavedProducts.findIndex((sp) => sp.product_id === product.id)

          if (index !== -1) {
            productStore.SavedProducts.splice(index, 1)
          }
        }
      })
      .finally(() => {
        favoriteLoadingState.value = false // Reset loading state after API call is completed
      })
  }
}

// Function to check if a product is already saved to favorites
const isSavedToProduct = (product_id) => {
  let result = productStore.SavedProducts.findIndex((product) => product.product_id === product_id)
  return Boolean(result !== -1) // Return true if product is found in saved list, otherwise false
}

// Function to check if heart icon should show loading state
const showHeartLoadingState = (product_id) => {
  if (selected_product_id.value === product_id && favoriteLoadingState.value) {
    return true // Show loading if the selected product is being processed
  } else {
    return false // Otherwise, return false
  }
}
</script>

<style lang="scss" scoped>
.filter-card {
  position: sticky;
  top: 20px;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  .product-image {
    height: 200px;
    object-fit: cover;
  }

  .product-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
