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
                  label="Add Product"
                  @click="showAddProductDialog = true"
                  no-caps
                />
              </div>

              <q-table
                :rows="products"
                :columns="productColumns"
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
                        @click="confirmDelete(props.row)"
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
                  @click="showAddProductDialog = true"
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
                        @click="confirmDelete(props.row)"
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
    <q-dialog v-model="showAddProductDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ editingProduct ? 'Edit' : 'Add' }} Product</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveProduct" greedy ref="productQForm">
            <q-input
              v-model="productForm.name"
              label="Product Name"
              :rules="[(val) => !!val || 'Name is required']"
              lazy-rules
              class="q-mb-md"
            />

            <q-input
              v-model="productForm.description"
              type="textarea"
              label="Description"
              :rules="[(val) => !!val || 'Description is required']"
              lazy-rules
              class="q-mb-md"
            />

            <q-select
              v-model="productForm.category"
              :options="categories"
              label="Category"
              :rules="[(val) => (Array.isArray(val) && val.length > 0) || 'Category is required']"
              lazy-rules
              class="q-mb-md"
              multiple
            />

            <q-input
              v-model.number="productForm.cost"
              type="number"
              label="Cost"
              prefix="$"
              :rules="[
                (val) => !!val || 'Cost is required',
                (val) => val > 0 || 'Cost must be greater than 0',
              ]"
              lazy-rules
              class="q-mb-md"
            />

            <q-input
              v-model.number="productForm.landed_cost"
              type="number"
              label="Landed Cost"
              prefix="$"
              :rules="[
                (val) => !!val || 'Cost is required',
                (val) => val > 0 || 'Cost must be greater than 0',
              ]"
              lazy-rules
              class="q-mb-md"
            />

            <q-input
              v-model.number="productForm.srp"
              type="number"
              label="SRP"
              prefix="$"
              :rules="[
                (val) => !!val || 'Cost is required',
                (val) => val > 0 || 'Cost must be greater than 0',
              ]"
              lazy-rules
              class="q-mb-md"
            />

            <q-file
              v-model="productForm.images"
              label="Product Images"
              multiple
              accept=".jpg,.png,.jpeg"
              class="q-mb-md"
              :rules="[
                (val) => (Array.isArray(val) && val.length > 0) || 'Product Image is required',
              ]"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <q-file
              v-model="productForm.product_certificates"
              label="Product Certificates"
              multiple
              accept=".jpg,.png,.jpeg.,.pdf"
              class="q-mb-md"
              :rules="[
                (val) =>
                  (Array.isArray(val) && val.length > 0) || 'Product certificate is required',
              ]"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <q-file
              v-model="productForm.facility_certificates"
              label="Facility/Process Certificates"
              multiple
              accept=".jpg,.png,.jpeg.,.pdf"
              class="q-mb-md"
              :rules="[
                (val) =>
                  (Array.isArray(val) && val.length > 0) ||
                  'Facility/Process certificate is required',
              ]"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <q-select
              v-model="productForm.status"
              :options="statuses"
              label="Status"
              :rules="[(val) => !!val || 'Status is required']"
              lazy-rules
              class="q-mb-md"
            />

            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="negative" v-close-popup class="q-mr-sm" />
              <q-btn type="submit" label="Save" color="primary" :loading="formLoadingState" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDashboardStore } from 'src/stores/dashboard'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const dashboardStore = useDashboardStore()

const showAddProductDialog = ref(false)
const editingProduct = ref(null)

const totalProducts = ref(0)
const activeListings = ref(0)
const retailerViews = ref(0)
const inquiries = ref(0)

const categories = ['Food', 'Non-Food', 'Organic', 'Non-Organic']
const statuses = ['Draft', 'Publish']
const productForm = ref({
  name: '',
  description: '',
  category: [],
  cost: 0,
  landed_cost: 0,
  srp: 0,
  status: '',
  images: [],
  product_certificates: [],
  facility_certificates: [],
})

const tab = ref('products')
const tableLoadingState = ref(false)
const products = ref([])
const productColumns = [
  { name: 'name', label: 'Product Name', field: 'name', sortable: true, align: 'left' },
  { name: 'category', label: 'Category', field: 'category', sortable: true, align: 'left' },
  { name: 'cost', label: 'Cost', field: 'cost', sortable: true, align: 'left' },
  {
    name: 'landed_cost',
    label: 'Landed Cost',
    field: 'landed_cost',
    sortable: true,
    align: 'left',
  },
  { name: 'srp', label: 'SRP', field: 'srp', sortable: true, align: 'left' },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions' },
]

// Function to fetch the list of products, recursively fetching until all are loaded
const getProducts = () => {
  dashboardStore
    .GetProducts({ offset: products.value.length })
    .then((response) => {
      if (response.status === 'success') {
        response.data.forEach((data) => {
          products.value.push(data)
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

onMounted(() => {
  tableLoadingState.value = true
  getProducts()
})

const services = ref([])
const serviceColumns = []

const formLoadingState = ref(false)
const productQForm = ref(null)
const saveProduct = () => {
  productQForm.value.validate().then((success) => {
    if (success) {
      formLoadingState.value = true

      const formData = new FormData()

      // Loop through the `productForm` object keys and append them dynamically
      Object.entries(productForm.value).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Convert arrays to JSON strings
          formData.append(key, JSON.stringify(value))
        } else {
          // Convert numbers and other types to strings
          formData.append(key, String(value))
        }
      })

      dashboardStore
        .InsertProduct(productForm.value)
        .then((response) => {
          let status = Boolean(response.status === 'success')
          $q.notify({
            message: `<p class='q-mb-none'>${status ? 'Success' : 'Fail'}! the product ${status ? 'has been' : 'was not'} saved.</p>`,
            color: `${status ? 'green' : 'red'}-2`,
            position: 'center',
            textColor: `${status ? 'green' : 'red'}`,
            html: true,
          })
        })
        .catch((error) => {
          // Show a notification based on the response status
          $q.notify({
            message: `<p class='q-mb-none'>${error.message}</p>`,
            color: `red-2`,
            position: 'top-right',
            textColor: `red`,
            html: true,
          })
        })
        .finally(() => {
          formLoadingState.value = false
        })
    }
  })

  console.log('product form ', productForm.value)
}

const editProduct = (product) => {
  editingProduct.value = product.id
  productForm.value = { ...product }
  showAddProductDialog.value = true
}

const confirmDelete = (product) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete ${product.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // Handle product deletion
  })
}
</script>

<style lang="scss" scoped>
.stats-card {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
}
</style>
