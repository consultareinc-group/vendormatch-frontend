<template>
  <q-drawer show-if-above v-model="triggerStore.RightDrawerOpen" side="right" bordered>
    <!-- Filters Sidebar -->
    <div class="q-px-sm">
      <q-card class="filter-card no-shadow">
        <q-card-section>
          <div class="text-h6">Filters</div>
          <q-input v-model="searchQuery" label="Search" outlined dense class="q-mb-md">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="text-subtitle2 q-mb-sm">Categories</div>
          <q-list dense>
            <q-item v-for="category in categories" :key="category" tag="label" v-ripple>
              <q-item-section avatar>
                <q-checkbox v-model="selectedCategories" :val="category" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ category }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 q-mb-sm">Price Range</div>
          <div class="flex justify-between">
            <div>${{ priceRange.min }}</div>
            <div>${{ priceRange.max }}</div>
          </div>
          <q-range v-model="priceRange" :min="0" :max="1000" label class="q-mt-md" />
        </q-card-section>
        <q-card-section>
          <div class="text-weight-medium q-mb-md">Search Preview:</div>
          <div>Keywords: {{ searchQuery }}</div>
          <div>Categories: {{ selectedCategories.join(', ') }}</div>
          <div>Price Range: ${{ priceRange.min }} - ${{ priceRange.max }}</div>
        </q-card-section>
        <q-card-section>
          <q-btn
            @click="filterProducts()"
            :loading="btnLoadingState"
            no-caps
            label="Submit"
            color="primary"
            class="full-width"
          ></q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useTriggerStore } from 'src/stores/triggers'
import { useProductStore } from 'src/stores/products'
import { useQuasar } from 'quasar'

const productStore = useProductStore()
const triggerStore = useTriggerStore()
const $q = useQuasar()

const searchQuery = ref('')
const selectedCategories = ref([])
const priceRange = ref({ min: 1, max: 1000 })

const categories = ['Food', 'Non-Food', 'Organic', 'Non-Organic']

const btnLoadingState = ref(false)

const filterProducts = () => {
  btnLoadingState.value = true
  productStore
    .SearchProducts(
      `keyword=${searchQuery.value}&category=${selectedCategories.value.join(', ')}&price_range=${JSON.stringify(priceRange.value)}&include_image=1`,
    )
    .then((response) => {
      let status = Boolean(response.status === 'success') // Determine the status of the response
      if (status) {
        productStore.Products = response.data
      }

      $q.notify({
        message: `<p class='q-mb-none'>Your search returned <b class="text-primary">${response.data.length.toLocaleString()}</b> result(s) </p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })
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
      btnLoadingState.value = false
    })
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
}
</style>
