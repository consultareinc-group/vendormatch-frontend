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

          <q-select
            v-model="selectedCategories"
            dense
            :options="categories"
            label="Category"
            use-input
            input-debounce="0"
            @filter="filterFn"
            class="q-mb-md"
            outlined
            multiple
          />

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

// Array of predefined product categories
const categoryOptions = [
  'Food',
  'Non-Food',
  'Organic',
  'Non-Organic',
  'Dietary Supplements',
  'Alcoholic Beverages',
  'Animal/Pet Food and Feed',
  'Baby/Toddler Foods and Infant Formulas',
  'Bakery Products, Dough Mixes or Icings',
  'Beverage Bases',
  'Botanicals And Herbs',
  'Brewer Products',
  'Candies and Chewing Gums',
  'Cannabis',
  'Chemical Preservatives',
  'Cosmetics',
  'Biologics',
  'Breakfast Foods and Cereals',
  'Cheese and Cheese Products',
  'Chocolate and Cocoa Products',
  'Coffee and Tea',
  'Color Additives',
  'Dietary Conventional Foods',
  'Dressings and Condiments',
  'Drugs and Pharmaceuticals',
  'Fishery/Seafood Products',
  'Food Additives',
  'Food Sweeteners',
  'Fruits and Fruit Products',
  'Fruit or Vegetable Juices and Concentrates',
  'Gelatin, Rennet, Pudding mixes or Pie Fillings',
  'Ice Cream',
  'Pasta and Noodles',
  'Meat, Meat Products and Poultry',
  'Medical Devices',
  'Milk and Milk Products',
  'Nuts and Edible Seeds',
  'Prepared Salad Products',
  'Shell Eggs and Egg Products',
  'Snack Foods',
  'Spices, Flavors and Salts',
  'Soups',
  'Soft Drinks and Waters',
  'Tobacco Products',
  'Vegetable and Vegetable Products',
  'Vegetable Oils',
  'Vegetable Proteins',
  'Whole Grain and Miller Grain Products',
  'Yeast Products',
]

const categories = ref(categoryOptions)

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      categories.value = categoryOptions
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    categories.value = categoryOptions.filter((v) => v.toLowerCase().indexOf(needle) > -1)
  })
}

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
        productStore.SearchedProducts = response.data
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
