<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Statistics Cards -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Viewed Products</div>
            <div class="text-h4">{{ viewedProducts }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Saved Products</div>
            <div class="text-h4">{{ savedProducts }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Active Inquiries</div>
            <div class="text-h4">{{ activeInquiries }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Connected vendors</div>
            <div class="text-h4">{{ connectedvendors }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Recent Activity -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
            <q-timeline color="secondary">
              <q-timeline-entry
                v-for="activity in recentActivity"
                :key="activity.id"
                :title="activity.title"
                :subtitle="activity.date"
                :icon="activity.icon"
              >
                {{ activity.description }}
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
        </q-card>
      </div>

      <!-- Saved Products -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Saved Products</div>
            <SavedProducts />
          </q-card-section>
        </q-card>
      </div>

      <!-- Product Recommendations -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recommended Products</div>
            <div class="row q-col-gutter-md q-mt-md">
              <!-- Products Grid -->
              <div v-if="!recommendedProducts.length" class="col-12">
                <div class="row q-col-gutter-sm">
                  <div v-for="n in 8" :key="n" class="col-12 col-sm-6 col-md-3">
                    <q-card class="product-card">
                      <q-skeleton height="192px" width="190px" class="full-width"></q-skeleton>

                      <q-card-section class="q-pa-none q-pl-sm q-mt-sm q-pr-sm">
                        <q-skeleton square></q-skeleton>
                        <q-skeleton square></q-skeleton>
                        <q-skeleton square></q-skeleton>
                      </q-card-section>

                      <q-card-actions align="right" class="q-pa-none q-mt-sm q-pb-sm q-pr-sm">
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
                    v-for="product in recommendedProducts"
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
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from 'src/stores/products'
import { useTriggerStore } from 'src/stores/triggers'
// import { useAuthStore } from 'src/stores/auth'
// Import Quasar framework utilities
import { useQuasar } from 'quasar'
import ViewProductDetails from '../product/components/ViewProductDetails.vue'
import SavedProducts from './components/SavedProducts.vue'

const productStore = useProductStore()
const triggerStore = useTriggerStore()
// Initialize Quasar for UI utilities
const $q = useQuasar()

// Statistics
const viewedProducts = ref(0)
const savedProducts = ref(0)
const activeInquiries = ref(0)
const connectedvendors = ref(0)

// Recent Activity
const recentActivity = ref([
  {
    id: 1,
    title: 'Product Viewed',
    date: '2 hours ago',
    icon: 'visibility',
    description: 'You viewed Organic Coffee Beans from Green Mountain Coffee',
  },
  // {
  //   id: 2,
  //   title: 'Message Sent',
  //   date: '1 day ago',
  //   icon: 'message',
  //   description: 'You sent a message to Natural Foods Co. about their Quinoa product',
  // },
  // {
  //   id: 3,
  //   title: 'Product Saved',
  //   date: '2 days ago',
  //   icon: 'favorite',
  //   description: 'You saved Bamboo Cutlery Set to your favorites',
  // },
])

// Recommended Products
const recommendedProducts = ref([])

onMounted(() => {
  productStore
    .GetProducts(`offset=${productStore.Products.length}&include_image=1`)
    .then((response) => {
      if (response.status === 'success') {
        response.data.forEach((product) => {
          recommendedProducts.value.push(product)
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

const showProductDetailsDialog = (product_details) => {
  triggerStore.ViewProductDetailsDialog = true
  productStore.ProductDetails = product_details
}
</script>

<style lang="scss" scoped>
.stats-card {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
}

.product-card {
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
  }
}
</style>
