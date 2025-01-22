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
                        @click="showDialog(props.row)"
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
                        @click="showDialog(props.row)"
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
              dense
              label="Product Name"
              :rules="[(val) => !!val || 'Name is required']"
              lazy-rules
              class="q-mb-md"
            />

            <q-input
              v-model="productForm.description"
              dense
              type="textarea"
              label="Description"
              :rules="[(val) => !!val || 'Description is required']"
              lazy-rules
              class="q-mb-md"
            />

            <q-select
              v-model="productForm.category"
              dense
              :options="categories"
              label="Category"
              :rules="[(val) => (Array.isArray(val) && val.length > 0) || 'Category is required']"
              lazy-rules
              class="q-mb-md"
              multiple
            />

            <q-input
              v-model.number="productForm.cost"
              dense
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
              v-model.number="productForm.srp"
              dense
              type="number"
              label="SRP"
              prefix="$"
              :rules="[
                (val) => !!val || 'SRP is required',
                (val) => val > 0 || 'SRP must be greater than 0',
              ]"
              lazy-rules
              class="q-mb-md"
            />

            <div class="q-mb-sm"><label class="text-grey-7">Landed Cost</label></div>
            <q-card class="q-pa-md q-mb-md">
              <div v-for="(cost, index) in productForm.landed_cost" :key="index">
                <div class="flex justify-end q-mb-md">
                  <q-icon
                    v-if="index !== 0"
                    name="close"
                    size="sm"
                    color="red"
                    class="cursor-pointer"
                    @click="removeLandedCost(index)"
                  />
                </div>
                <q-input
                  v-model.number="cost.country"
                  dense
                  label="Destination/Country"
                  :rules="[(val) => !!val || 'Destination/Country is required']"
                  lazy-rules
                  class="q-mb-md"
                />
                <q-input
                  v-model.number="cost.amount"
                  dense
                  type="number"
                  label="Landed Cost"
                  prefix="$"
                  :rules="[
                    (val) => !!val || 'Landed cost is required',
                    (val) => val > 0 || 'Landed cost must be greater than 0',
                  ]"
                  lazy-rules
                />
              </div>

              <q-btn
                icon="add"
                dense
                label="Add Destination/Country"
                class="q-px-sm"
                no-caps
                @click="addLandedCost()"
              />
            </q-card>

            <h6 class="q-mt-lg text-grey-14">Product Image</h6>
            <q-uploader
              ref="imageUploadRef"
              @vue:updated="productForm.images = imageUploadRef.files"
              hide-upload-btn
              multiple
              accept=".jpg,.png,.jpeg"
              label="Upload file"
              color="secondary"
              class="q-mb-md full-width"
            />

            <h6 class="text-grey-14">Certifications</h6>
            <q-card class="q-pa-md q-mb-md">
              <div v-for="(certificate, index) in productForm.product_certificates" :key="index">
                <div class="flex justify-between q-mb-md">
                  <label>Product Certificate</label>
                  <q-icon
                    v-if="index !== 0"
                    name="close"
                    size="sm"
                    color="red"
                    class="cursor-pointer"
                    @click="removeCertificate(index, 'product')"
                  />
                </div>
                <q-uploader
                  :ref="(el) => (refs[`productCertificateUploadRef${index}`] = el)"
                  @vue:updated="() => updateCertificateFile(index, 'product')"
                  hide-upload-btn
                  accept=".jpg,.png,.jpeg,.pdf"
                  label="Upload file"
                  color="secondary"
                  class="q-mb-md full-width"
                />

                <q-input
                  outlined
                  v-model="certificate.document_name"
                  label="Document Name"
                  :rules="[(val) => !!val || 'Document name is required']"
                  lazy-rules
                  dense
                  class="q-mb-md"
                />
                <q-input
                  outlined
                  v-model="certificate.issue_date"
                  lazy-rules
                  label="Issuance Date"
                  dense
                  class="q-mt-sm q-mb-md"
                  :rules="[
                    (val) => !!val || 'Field is required', // Ensure the field is not empty
                    (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) || 'Invalid date format (YYYY-MM-DD)', // Validate date format
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        :ref="(el) => (refs[`productCertificateIssuanceDate${index}`] = el)"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          minimal
                          v-model="certificate.issue_date"
                          @update:model-value="
                            () => refs[`productCertificateIssuanceDate${index}`]?.hide()
                          "
                          mask="YYYY-MM-DD"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input
                  outlined
                  v-model="certificate.expiry_date"
                  lazy-rules
                  label="Expiry Date"
                  dense
                  class="q-mt-sm q-mb-md"
                  :rules="[
                    (val) => !!val || 'Field is required', // Ensure the field is not empty
                    (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) || 'Invalid date format (YYYY-MM-DD)', // Validate date format
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        :ref="(el) => (refs[`productCertificateExpiryDate${index}`] = el)"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          minimal
                          v-model="certificate.expiry_date"
                          @update:model-value="
                            () => refs[`productCertificateExpiryDate${index}`]?.hide()
                          "
                          mask="YYYY-MM-DD"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div v-if="index !== productForm.product_certificates.length - 1" class="q-pb-sm">
                  <hr class="q-mb-lg q-pb-xs bg-primary" />
                </div>
              </div>
              <q-btn
                icon="add"
                dense
                class="q-px-sm"
                label="Add Certificate"
                no-caps
                @click="addCertificate('product')"
              />
            </q-card>

            <q-card class="q-pa-md q-mb-md">
              <div v-for="(certificate, index) in productForm.facility_certificates" :key="index">
                <div class="flex justify-between q-mb-md">
                  <label>Facility/Process Certificate</label>
                  <q-icon
                    v-if="index !== 0"
                    name="close"
                    size="sm"
                    color="red"
                    class="cursor-pointer"
                    @click="removeCertificate(index, 'facility')"
                  />
                </div>
                <q-uploader
                  :ref="(el) => (refs[`facilityCertificateUploadRef${index}`] = el)"
                  @vue:updated="() => updateCertificateFile(index, 'facility')"
                  hide-upload-btn
                  accept=".jpg,.png,.jpeg,.pdf"
                  label="Upload file"
                  color="secondary"
                  class="q-mb-md full-width"
                />

                <q-input
                  outlined
                  v-model="certificate.document_name"
                  label="Document Name"
                  :rules="[(val) => !!val || 'Document name is required']"
                  lazy-rules
                  dense
                  class="q-mb-md"
                />
                <q-input
                  outlined
                  v-model="certificate.issue_date"
                  lazy-rules
                  label="Issuance Date"
                  dense
                  class="q-mt-sm q-mb-md"
                  :rules="[
                    (val) => !!val || 'Field is required', // Ensure the field is not empty
                    (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) || 'Invalid date format (YYYY-MM-DD)', // Validate date format
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        :ref="(el) => (refs[`facilityCertificateIssuanceDate${index}`] = el)"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          minimal
                          v-model="certificate.issue_date"
                          @update:model-value="
                            () => refs[`facilityCertificateIssuanceDate${index}`]?.hide()
                          "
                          mask="YYYY-MM-DD"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input
                  outlined
                  v-model="certificate.expiry_date"
                  lazy-rules
                  label="Expiry Date"
                  dense
                  class="q-mt-sm q-mb-md"
                  :rules="[
                    (val) => !!val || 'Field is required', // Ensure the field is not empty
                    (val) => /^\d{4}-\d{2}-\d{2}$/.test(val) || 'Invalid date format (YYYY-MM-DD)', // Validate date format
                  ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        :ref="(el) => (refs[`facilityCertificateExpiryDate${index}`] = el)"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          minimal
                          v-model="certificate.expiry_date"
                          @update:model-value="
                            () => refs[`facilityCertificateExpiryDate${index}`]?.hide()
                          "
                          mask="YYYY-MM-DD"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div v-if="index !== productForm.facility_certificates.length - 1" class="q-pb-sm">
                  <hr class="q-mb-lg q-pb-xs bg-primary" />
                </div>
              </div>
              <q-btn
                icon="add"
                dense
                class="q-px-sm"
                label="Add Certificate"
                no-caps
                @click="addCertificate('facility')"
              />
            </q-card>

            <q-select
              v-model="productForm.status"
              :options="statuses"
              label="Status"
              :rules="[(val) => !!val || 'Status is required']"
              lazy-rules
              class="q-mb-md"
            />

            <div class="row justify-end q-mt-md">
              <q-btn flat label="Close" color="negative" v-close-popup class="q-mr-sm" />
              <q-btn type="submit" label="Save" color="primary" :loading="formLoadingState" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteDialog">
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

<script setup lang="ts">
// Import Vue's reactive and lifecycle utilities
import { ref, onMounted } from 'vue'

// Import the store for dashboard-related state management
import { useDashboardStore } from 'src/stores/dashboard'

// Import Quasar framework utilities
import { useQuasar } from 'quasar'

// Initialize Quasar for UI utilities
const $q = useQuasar()

// Initialize the dashboard store for state and actions related to the dashboard
const dashboardStore = useDashboardStore()

// Reactive reference to control the visibility of the "Add Product" dialog
const showAddProductDialog = ref(false)

// Reactive reference to hold the product being edited, if any
const editingProduct = ref(null)

// Reactive reference to track the total number of products
const totalProducts = ref(0)

// Reactive reference to track the number of active product listings
const activeListings = ref(0)

// Reactive reference to track the number of views from retailers
const retailerViews = ref(0)

// Reactive reference to track the number of inquiries made
const inquiries = ref(0)

// Array of predefined product categories
const categories = ['Food', 'Non-Food', 'Organic', 'Non-Organic']

// Array of predefined product statuses
const statuses = ['Draft', 'Publish']

// Reactive object to manage the product form data
const productForm = ref({
  name: '', // Name of the product
  description: '', // Description of the product
  category: [], // Categories associated with the product
  cost: '', // Cost of the product
  landed_cost: [
    {
      country: '',
      amount: '',
    },
  ], // Landed cost of the product
  srp: '', // Suggested retail price of the product
  status: '', // Status of the product (e.g., Draft or Publish)
  images: [], // Array to store uploaded product images
  product_certificates: [
    {
      file: '', // File associated with the certificate
      document_name: '', // Name of the certificate document
      issue_date: '', // Issue date of the certificate
      expiry_date: '', // Expiry date of the certificate
    },
  ], // Array to store certificates related to the product
  facility_certificates: [
    {
      file: '', // File associated with the certificate
      document_name: '', // Name of the certificate document
      issue_date: '', // Issue date of the certificate
      expiry_date: '', // Expiry date of the certificate
    },
  ], // Array to store facility-related certificates
})

// Reactive reference to track the active tab in the UI
const tab = ref('products')

// Reactive reference to manage the loading state of the product table
const tableLoadingState = ref(false)

// Reactive reference to store the list of products fetched from the backend
const products = ref([])

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

// Execute when the component is mounted
onMounted(() => {
  tableLoadingState.value = true // Set the table loading state to true to show a loading indicator
  getProducts() // Fetch the list of products
})

// Reference to store service data
const services = ref([])

// Define columns for the service table (currently empty)
const serviceColumns = []

// Reactive state to track loading status of the form
const formLoadingState = ref(false)

// Reference for the Quasar product form component
const productQForm = ref(null)

// Reference for the image upload component
const imageUploadRef = ref(null)

const addLandedCost = () => {
  productForm.value.landed_cost.push({
    country: '',
    amount: '',
  })
}

// Function to add a certificate to the specified type (product or facility)
const addCertificate = (type) => {
  // Define the structure of the certificate data
  let data = {
    file: '', // File reference for the certificate
    document_name: '', // Name of the document
    issue_date: '', // Issue date of the certificate
    expiry_date: '', // Expiry date of the certificate
  }

  // Check the type of certificate and push it to the respective list
  if (type === 'product') {
    productForm.value.product_certificates.push(data) // Add to product certificates
  } else {
    productForm.value.facility_certificates.push(data) // Add to facility certificates
  }
}

// Function to remove a certificate by its index and type (product or facility)
const removeCertificate = (index, type) => {
  if (type === 'product') {
    // Remove the certificate at the specified index from the product_certificates array
    productForm.value.product_certificates.splice(index, 1)
  } else {
    // Remove the certificate at the specified index from the facility_certificates array
    productForm.value.facility_certificates.splice(index, 1)
  }
}

// Function to remove a landed cost value by its index
const removeLandedCost = (index) => {
  // Remove the landed cost at the specified index from the landed_cost array
  productForm.value.landed_cost.splice(index, 1)
}

// Dynamic refs (stores all uploader refs)
const refs = {}
const updateCertificateFile = (index, type) => {
  // Access the specific uploader ref dynamically
  const uploaderRef =
    type === 'product'
      ? refs[`productCertificateUploadRef${index}`]
      : refs[`facilityCertificateUploadRef${index}`]
  if (uploaderRef) {
    // Assign files to the corresponding certificate
    if (type === 'product') {
      productForm.value.product_certificates[index].file = uploaderRef.files
    } else {
      productForm.value.facility_certificates[index].file = uploaderRef.files
    }
  }
}

// Function to handle product saving
const saveProduct = () => {
  // Validate the product form
  productQForm.value.validate().then((success) => {
    if (success) {
      // Check if at least one image is uploaded
      if (!productForm.value.images.length) {
        $q.notify({
          message: `<p class='q-mb-none'>Product image is required.</p>`,
          color: `red-2`,
          position: 'bottom',
          textColor: `red`,
          html: true,
        })
        return // Exit if no image is uploaded
      }

      // Initialize error flag for certificate validation
      let error = false

      // Validate product certificates
      productForm.value.product_certificates.forEach((cert) => {
        if (!cert.file.length) {
          $q.notify({
            message: `<p class='q-mb-none'>Product certificate is required.</p>`,
            color: `red-2`,
            position: 'bottom',
            textColor: `red`,
            html: true,
          })
          error = true // Set error flag to true if validation fails
        }
      })

      // Validate facility certificates
      productForm.value.facility_certificates.forEach((cert) => {
        if (!cert.file.length) {
          $q.notify({
            message: `<p class='q-mb-none'>Facility certificate is required.</p>`,
            color: `red-2`,
            position: 'bottom',
            textColor: `red`,
            html: true,
          })
          error = true // Set error flag to true if validation fails
        }
      })

      // Exit if any certificate validation failed
      if (error) {
        return
      }

      formLoadingState.value = true // Set loading state to true

      // Create a FormData object to prepare the data for submission
      const formData = new FormData()

      // Append product images to FormData
      productForm.value.images.forEach((file) => {
        formData.append('images[]', file)
      })

      // Append product certificates to FormData
      productForm.value.product_certificates.forEach((cert, index) => {
        formData.append(`product_certificates[${index}][file]`, cert.file[0]) // Add file
        formData.append(`product_certificates[${index}][document_name]`, cert.document_name) // Add document name
        formData.append(`product_certificates[${index}][issue_date]`, cert.issue_date) // Add issue date
        formData.append(`product_certificates[${index}][expiry_date]`, cert.expiry_date) // Add expiry date
      })

      // Append facility certificates to FormData
      productForm.value.facility_certificates.forEach((cert, index) => {
        formData.append(`facility_certificates[${index}][file]`, cert.file[0]) // Add file
        formData.append(`facility_certificates[${index}][document_name]`, cert.document_name) // Add document name
        formData.append(`facility_certificates[${index}][issue_date]`, cert.issue_date) // Add issue date
        formData.append(`facility_certificates[${index}][expiry_date]`, cert.expiry_date) // Add expiry date
      })

      // Append landed_costs to FormData
      productForm.value.landed_cost.forEach((cost, index) => {
        formData.append(`landed_cost[${index}][country]`, cost.country) // Add country
        formData.append(`landed_cost[${index}][amount]`, cost.amount) // Add amount
      })

      // Append product details to FormData
      formData.append('name', productForm.value.name)
      formData.append('description', productForm.value.description)
      formData.append('category', productForm.value.category.join(', '))
      formData.append('cost', productForm.value.cost)
      formData.append('srp', productForm.value.srp)
      formData.append('status', productForm.value.status)

      // Call the API to insert the product
      dashboardStore
        .InsertProduct(formData)
        .then((response) => {
          let status = Boolean(response.status === 'success') // Determine the status of the response
          $q.notify({
            message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the product ${status ? 'has been' : 'was not'} saved.</p>`,
            color: `${status ? 'green' : 'red'}-2`,
            position: 'top-right',
            textColor: `${status ? 'green' : 'red'}`,
            html: true,
          })

          // Add the new product to the table if successful
          if (status) {
            products.value.unshift({
              id: response.data.id,
              name: productForm.value.name,
              category: productForm.value.category.join(', '),
              cost: productForm.value.cost.toFixed(2),
              srp: productForm.value.srp.toFixed(2),
              status: productForm.value.status,
            })

            // Reset the product form
            productForm.value = {
              name: '',
              description: '',
              category: [],
              cost: '',
              landed_cost: [
                {
                  country: '',
                  amount: '',
                },
              ],
              srp: '',
              status: '',
              images: [],
              product_certificates: [
                {
                  file: '',
                  document_name: '',
                  issue_date: '',
                  expiry_date: '',
                },
              ],
              facility_certificates: [
                {
                  file: '',
                  document_name: '',
                  issue_date: '',
                  expiry_date: '',
                },
              ],
            }
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
          formLoadingState.value = false // Reset loading state
        })
    }
  })
}

const editProduct = (product) => {
  editingProduct.value = product.id
  productForm.value = { ...product }
  showAddProductDialog.value = true
}

const deleteDialog = ref(false)
const btnDeleteLoadingState = ref(false)
const productDetails = ref({})

const showDialog = (product_details) => {
  deleteDialog.value = true
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
        const index = products.value.findIndex((product) => product.id === productDetails.value.id)
        if (index !== -1) {
          products.value.splice(index, 1) // Remove the product at the found index
        }
        deleteDialog.value = false
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
