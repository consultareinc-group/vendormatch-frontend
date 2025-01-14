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
            <div class="text-h6">Connected Suppliers</div>
            <div class="text-h4">{{ connectedSuppliers }}</div>
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
            <q-list separator>
              <q-item v-for="product in savedProductsList" :key="product.id" clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="product.image" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ product.name }}</q-item-label>
                  <q-item-label caption>{{ product.supplier }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    round
                    color="secondary"
                    icon="message"
                    @click="contactSupplier(product)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Product Recommendations -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recommended Products</div>
            <div class="row q-col-gutter-md q-mt-md">
              <div
                v-for="product in recommendedProducts"
                :key="product.id"
                class="col-12 col-sm-6 col-md-3"
              >
                <q-card class="product-card">
                  <q-img :src="product.image" :ratio="1" />
                  <q-card-section>
                    <div class="text-subtitle1">{{ product.name }}</div>
                    <div class="text-caption">{{ product.supplier }}</div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat round color="grey" icon="favorite_border" />
                    <q-btn flat color="primary" no-caps label="Connect to Vendor" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Statistics
const viewedProducts = ref(45)
const savedProducts = ref(12)
const activeInquiries = ref(3)
const connectedSuppliers = ref(8)

// Recent Activity
const recentActivity = ref([
  {
    id: 1,
    title: 'Product Viewed',
    date: '2 hours ago',
    icon: 'visibility',
    description: 'You viewed Organic Coffee Beans from Green Mountain Coffee',
  },
  {
    id: 2,
    title: 'Message Sent',
    date: '1 day ago',
    icon: 'message',
    description: 'You sent a message to Natural Foods Co. about their Quinoa product',
  },
  {
    id: 3,
    title: 'Product Saved',
    date: '2 days ago',
    icon: 'favorite',
    description: 'You saved Bamboo Cutlery Set to your favorites',
  },
])

// Saved Products
const savedProductsList = ref([
  {
    id: 1,
    name: 'Organic Coffee Beans',
    supplier: 'Green Mountain Coffee',
    image: 'https://cdn.quasar.dev/img/mountains.jpg',
  },
  {
    id: 2,
    name: 'Bamboo Cutlery Set',
    supplier: 'Eco Essentials',
    image: 'https://cdn.quasar.dev/img/parallax2.jpg',
  },
  {
    id: 3,
    name: 'Natural Honey',
    supplier: 'Beekeepers Co',
    image: 'https://cdn.quasar.dev/img/parallax1.jpg',
  },
])

// Recommended Products
const recommendedProducts = ref([
  {
    id: 1,
    name: 'Organic Tea Selection',
    supplier: 'Tea Masters Inc',
    image: 'https://cdn.quasar.dev/img/mountains.jpg',
  },
  {
    id: 2,
    name: 'Reusable Food Wraps',
    supplier: 'Green Living',
    image: 'https://cdn.quasar.dev/img/parallax2.jpg',
  },
  {
    id: 3,
    name: 'Organic Quinoa',
    supplier: 'Natural Foods Co',
    image: 'https://cdn.quasar.dev/img/parallax1.jpg',
  },
  {
    id: 4,
    name: 'Hemp Protein Powder',
    supplier: 'Wellness Foods',
    image: 'https://cdn.quasar.dev/img/mountains.jpg',
  },
])

const contactSupplier = (product) => {
  $q.notify({
    message: `Opening chat with ${product.supplier}`,
    color: 'positive',
  })
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
