<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Products Grid -->
      <div v-if="!productStore.Products.length" class="col-12">
        <div class="row q-col-gutter-sm">
          <div v-for="n in 8" :key="n" class="col-12 col-sm-6 col-md-3">
            <q-card class="product-card q-pr-sm">
              <q-skeleton height="192px" width="190px"></q-skeleton>

              <q-card-section class="q-pa-none q-pl-sm q-mt-sm">
                <q-skeleton square></q-skeleton>
                <q-skeleton square></q-skeleton>
                <q-skeleton square></q-skeleton>
              </q-card-section>

              <q-card-actions align="right" class="q-pa-none q-mt-sm q-mb-sm">
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
            v-for="product in productStore.Products"
            :key="product.id"
            class="col-12 col-sm-6 col-md-3 cursor-pointer"
          >
            <q-card class="product-card">
              <q-img
                :src="`data:image/jpeg;base64,${product?.image[0]?.binary ?? ''}`"
                :ratio="1"
                alt="Product Image"
              />

              <q-card-section>
                <div class="text-weight-medium product-name">{{ product?.name }}</div>
                <div class="text-subtitle2">{{ product?.category }}</div>
                <div class="text-body2 q-mt-sm">
                  <span class="text-grey">Cost:</span> ${{ product?.size[0]?.cost ?? 0 }}
                </div>
              </q-card-section>

              <q-card-actions class="flex justify-between items-center cursor-pointer">
                <q-icon name="favorite_border" color="secondary" size="sm" />
                <q-btn flat color="primary" no-caps label="Connect to Vendor" />
                <!-- <q-btn
                  v-if="authStore.user?.role === 'retailer'"
                  color="primary"
                  label="Contact Supplier"
                /> -->
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      <ViewProductDetails v-if="triggerStore.ViewProductDetailsDialog" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useProductStore } from 'src/stores/products'
import { useTriggerStore } from 'src/stores/triggers'
// import { useAuthStore } from 'src/stores/auth'
// Import Quasar framework utilities
import { useQuasar } from 'quasar'
import ViewProductDetails from './components/ViewProductDetails.vue'

const productStore = useProductStore()
const triggerStore = useTriggerStore()
// Initialize Quasar for UI utilities
const $q = useQuasar()
// const authStore = useAuthStore()

onMounted(() => {
  triggerStore.RightDrawerOpen = true
  productStore
    .GetProducts(`offset=${productStore.Products.length}&include_image=1`)
    .then((response) => {
      if (response.status === 'success') {
        response.data.forEach((product) => {
          productStore.Products.push(product)
        })
      }
    })
    .catch((error) => {
      // Show a notification based on the response status
      $q.notify({
        message: `<p class='q-mb-none'>${error.message}</p>`,
        color: `red-2`, // Set notification color
        position: 'top-right', // Notification position
        textColor: `red`, // Set text color
        html: true, // Enable HTML content
      })
    })
})
onBeforeRouteLeave(() => {
  triggerStore.RightDrawerOpen = false
})

const showProductDetailsDialog = (product_details) => {
  triggerStore.ViewProductDetailsDialog = true
  productStore.ProductDetails = product_details
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
