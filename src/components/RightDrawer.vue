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
          <q-btn label="Submit" color="primary" class="full-width"></q-btn>
        </q-card-section>
      </q-card>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useTriggerStore } from 'src/stores/triggers'

const triggerStore = useTriggerStore()

const searchQuery = ref('')
const selectedCategories = ref([])
const priceRange = ref({ min: 0, max: 1000 })

const categories = ['Food', 'Non-Food', 'Organic', 'Non-Organic']
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
