<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Statistics Cards -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Total Products</div>
            <div class="text-h4">{{ totalProducts }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Publish Listings</div>
            <div class="text-h4">{{ activeListings }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Buyer Views</div>
            <div class="text-h4">{{ retailerViews }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Inquiries</div>
            <div class="text-h4">{{ inquiries }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Product Management -->
      <div class="col-12">
        <q-card>
          <q-tabs
            v-model="tab"
            no-caps
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="products" label="My Products" />
            <q-tab name="services" label="My Services" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="products">
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">My Products</div>
                <q-btn
                  color="primary"
                  icon="add"
                  dense
                  class="q-px-sm"
                  label="Add Product"
                  @click="triggerStore.AddProductDialog = true"
                  no-caps
                />
              </div>

              <q-table
                :rows="dashboardStore.Products"
                :columns="productColumns"
                row-key="id"
                :loading="tableLoadingState"
                class="sticky-table-header"
                color="primary"
              >
                <template v-slot:body-cell-landed_cost="props">
                  <q-td :props="props">
                    <div
                      class="flex justify-between full-width"
                      v-for="cost in props.row.landed_cost"
                      :key="cost"
                    >
                      <div>{{ cost.country }}</div>
                      <div>${{ cost.amount }}</div>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn-group flat>
                      <q-btn
                        flat
                        round
                        color="secondary"
                        icon="visibility"
                        @click="showProductDetailsDialog(props.row)"
                      />
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="edit"
                        @click="editProduct(props.row)"
                      />
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        @click="showDeleteDialog(props.row)"
                      />
                    </q-btn-group>
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>
            <q-tab-panel name="services">
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">My Services</div>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Add Service"
                  @click="addProductDialog = true"
                  no-caps
                />
              </div>

              <q-table
                :rows="services"
                :columns="serviceColumns"
                row-key="id"
                :loading="tableLoadingState"
                class="sticky-table-header"
                color="primary"
              >
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn-group flat>
                      <q-btn
                        flat
                        round
                        color="secondary"
                        icon="visibility"
                        @click="editProduct(props.row)"
                      />
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="edit"
                        @click="editProduct(props.row)"
                      />
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        @click="showDeleteDialog(props.row)"
                      />
                    </q-btn-group>
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>

        <!-- <q-card>
          <q-card-section>

          </q-card-section>
        </q-card> -->
      </div>
    </div>

    <!-- Add/Edit Product Dialog -->
    <AddProduct />
    <ViewProductDetails v-if="triggerStore.ViewProductDetailsDialog" />

    <q-dialog v-model="deleteProductDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Deletion</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete <b>{{ productDetails.name }}?</b>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
          <q-btn
            flat
            label="OK"
            color="primary bg-primary text-white"
            @click="deleteProduct()"
            :loading="btnDeleteLoadingState"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
// Import Vue's reactive and lifecycle utilities
import { ref, onMounted } from 'vue'

// Import the store for dashboard-related state management
import { useDashboardStore } from 'src/stores/dashboard'
import { useTriggerStore } from 'src/stores/triggers'

// Import Quasar framework utilities
import { useQuasar } from 'quasar'

import AddProduct from './components/AddProduct.vue'
import ViewProductDetails from './components/ViewProductDetails.vue'

// Initialize Quasar for UI utilities
const $q = useQuasar()

// Initialize the dashboard store for state and actions related to the dashboard
const dashboardStore = useDashboardStore()

// Initialize the trigger store for state and actions related to the triggers
const triggerStore = useTriggerStore()

// Reactive reference to control the visibility of the "Add Product" dialog
const addProductDialog = ref(false)

// Reactive reference to track the total number of products
const totalProducts = ref(0)

// Reactive reference to track the number of active product listings
const activeListings = ref(0)

// Reactive reference to track the number of views from retailers
const retailerViews = ref(0)

// Reactive reference to track the number of inquiries made
const inquiries = ref(0)

// Reactive reference to track the active tab in the UI
const tab = ref('products')

// Reactive reference to manage the loading state of the product table
const tableLoadingState = ref(false)

const productColumns = [
  { name: 'name', label: 'Product Name', field: 'name', sortable: true, align: 'left' },
  { name: 'category', label: 'Category', field: 'category', sortable: true, align: 'left' },
  {
    name: 'cost',
    label: 'Cost',
    field: 'cost',
    sortable: true,
    align: 'left',
    format: (val) => `$${val}`,
  },
  {
    name: 'srp',
    label: 'SRP',
    field: 'srp',
    sortable: true,
    align: 'left',
    format: (val) => `$${val}`,
  },
  {
    name: 'landed_cost',
    label: 'Landed Cost',
    field: 'landed_cost',
    sortable: true,
    align: 'left',
  },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions' },
]

// Function to fetch the list of products, recursively fetching until all are loaded
const getProducts = () => {
  dashboardStore
    .GetProducts({ offset: dashboardStore.Products.length })
    .then((response) => {
      if (response.status === 'success') {
        response.data.forEach((data) => {
          dashboardStore.Products.push(data)
        })

        if (response.data.length) {
          getProducts() // Continue fetching if more data is available
        }
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
    .finally(() => {
      tableLoadingState.value = false
    })
}

// Execute when the component is mounted
onMounted(() => {
  tableLoadingState.value = true // Set the table loading state to true to show a loading indicator
  getProducts() // Fetch the list of products
})

// Reference to store service data
const services = ref([])

// Define columns for the service table (currently empty)
const serviceColumns = []

const showProductDetailsDialog = (product_details) => {
  dashboardStore.ProductDetails = product_details
  triggerStore.ViewProductDetailsDialog = true
}

const deleteProductDialog = ref(false)
const btnDeleteLoadingState = ref(false)

const productDetails = ref({ images: [] })
const showDeleteDialog = (product_details) => {
  deleteProductDialog.value = true
  productDetails.value = product_details
}
const deleteProduct = () => {
  btnDeleteLoadingState.value = true
  // Handle product deletion
  dashboardStore
    .DeleteProduct({ id: productDetails.value.id })
    .then((response) => {
      let status = Boolean(response.status === 'success') // Determine the status of the response
      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the product ${status ? 'has been' : 'was not'} deleted.</p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })

      if (status) {
        const index = dashboardStore.Products.findIndex(
          (product) => product.id === productDetails.value.id,
        )
        if (index !== -1) {
          dashboardStore.Products.splice(index, 1) // Remove the product at the found index
        }
        deleteProductDialog.value = false
      }
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
      btnDeleteLoadingState.value = false
    })
}
</script>

<style lang="scss" scoped>
.stats-card {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
}
</style>
