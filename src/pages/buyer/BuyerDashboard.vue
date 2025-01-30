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
            <q-list separator>
              <q-item v-for="product in savedProductsList" :key="product.id" clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="product.image" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ product.name }}</q-item-label>
                  <q-item-label caption>{{ product.vendor }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    round
                    color="secondary"
                    icon="message"
                    @click="contactvendor(product)"
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
                    <div class="text-caption">{{ product.vendor }}</div>
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
const connectedvendors = ref(8)

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
    vendor: 'Green Mountain Coffee',
    image: 'src/assets/vinegar.jpg',
  },
  {
    id: 2,
    name: 'Bamboo Cutlery Set',
    vendor: 'Eco Essentials',
    image: 'src/assets/vinegar.jpg',
  },
  {
    id: 3,
    name: 'Natural Honey',
    vendor: 'Beekeepers Co',
    image: 'src/assets/vinegar.jpg',
  },
])

// Recommended Products
const recommendedProducts = ref([
  {
    id: 1,
    name: 'Vinegar',
    vendor: 'Tea Masters Inc',
    image: 'src/assets/vinegar.jpg',
  },
  {
    id: 2,
    name: 'Vinegar',
    vendor: 'Green Living',
    image: 'src/assets/vinegar.jpg',
  },
  {
    id: 3,
    name: 'Vinegar',
    vendor: 'Natural Foods Co',
    image: 'src/assets/vinegar.jpg',
  },
  {
    id: 4,
    name: 'Vinegar',
    vendor: 'Wellness Foods',
    image: 'src/assets/vinegar.jpg',
  },
])

const contactvendor = (product) => {
  $q.notify({
    message: `Opening chat with ${product.vendor}`,
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
