<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Products Grid -->
      <div class="col-12">
        <div class="row q-col-gutter-sm">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="col-12 col-sm-6 col-md-3"
          >
            <q-card class="product-card">
              <q-img :src="product.images[0].__key" :ratio="1" class="product-image" />

              <q-card-section>
                <div class="text-h6">{{ product.name }}</div>
                <div class="text-subtitle2">{{ product.category }}</div>
                <div class="text-body2 q-mt-sm">
                  <span class="text-grey">Cost:</span> ${{ product.cost }}
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat color="primary" label="Connect to Vendor" />
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from 'src/stores/products'
// import { useAuthStore } from 'src/stores/auth'

const productStore = useProductStore()
// const authStore = useAuthStore()

const searchQuery = ref('')
const selectedCategories = ref([])
const costRange = ref({ min: 0, max: 1000 })

const filteredProducts = computed(() => {
  return productStore.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory =
      selectedCategories.value.length === 0 || selectedCategories.value.includes(product.category)

    const matchesCost = product.cost >= costRange.value.min && product.cost <= costRange.value.max

    return matchesSearch && matchesCategory && matchesCost
  })
})
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
}
</style>
