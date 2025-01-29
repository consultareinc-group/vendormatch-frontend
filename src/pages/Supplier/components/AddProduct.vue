<template>
  <q-dialog v-model="triggerStore.AddProductDialog">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Add Product</div>
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

          <div v-for="(size, size_index) in productForm.size" :key="size_index">
            <div class="flex justify-between q-mb-sm">
              <label>Product Size</label>
              <q-icon
                v-if="size_index !== 0"
                name="close"
                size="sm"
                color="red"
                class="cursor-pointer"
                @click="removeProductSize(size_index)"
              />
            </div>
            <q-card class="q-pa-md q-mb-md">
              <q-input
                outlined
                v-model="size.size"
                dense
                label="Size"
                :rules="[(val) => !!val || 'Size is required']"
                lazy-rules
                class="q-mb-md"
              />
              <q-input
                outlined
                v-model="size.upc"
                dense
                label="UPC"
                :rules="[(val) => !!val || 'UPC is required']"
                lazy-rules
                class="q-mb-md"
              />
              <q-input
                outlined
                v-model.number="size.cost"
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
                outlined
                v-model.number="size.srp"
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

              <div class="q-px-md q-mb-md">
                <div class="q-mb-sm"><label class="text-grey-7">Landed Cost</label></div>
                <div v-for="(cost, cost_index) in size.landed_cost" :key="cost_index">
                  <div class="flex justify-end q-mb-md">
                    <q-icon
                      v-if="cost_index !== 0"
                      name="close"
                      size="sm"
                      color="red"
                      class="cursor-pointer"
                      @click="removeLandedCost(size_index, cost_index)"
                    />
                  </div>
                  <q-input
                    outlined
                    v-model.number="cost.country"
                    dense
                    label="Destination/Country"
                    :rules="[(val) => !!val || 'Destination/Country is required']"
                    lazy-rules
                    class="q-mb-md"
                  />
                  <q-input
                    outlined
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
                  @click="addLandedCost(size_index)"
                />
              </div>
            </q-card>
          </div>

          <q-btn
            icon="add"
            dense
            label="Add Product Size"
            class="q-px-sm"
            no-caps
            @click="addProductSize()"
          />

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
                accept=".pdf"
                label="Upload file"
                color="secondary"
                class="q-mb-md full-width"
              />

              <q-input
                outlined
                v-model="certificate.description"
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
                accept=".pdf"
                label="Upload file"
                color="secondary"
                class="q-mb-md full-width"
              />

              <q-input
                outlined
                v-model="certificate.description"
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
</template>

<script setup lang="ts">
// Import Vue's reactive and lifecycle utilities
import { ref } from 'vue'

// Import the store for dashboard-related state management
import { useProductStore } from 'src/stores/product'
import { useTriggerStore } from 'src/stores/triggers'

// Import Quasar framework utilities
import { useQuasar } from 'quasar'

// Initialize Quasar for UI utilities
const $q = useQuasar()

// Initialize the dashboard store for state and actions related to the dashboard
const productStore = useProductStore()
// Initialize the trigger store for state and actions related to the triggers
const triggerStore = useTriggerStore()

// Reactive object to manage the product form data
const productForm = ref({
  name: '', // Name of the product
  description: '', // Description of the product
  category: [], // Categories associated with the product
  size: [
    {
      size: '', // Size of the product
      upc: '', // Upc code of the product
      cost: '', // Cost of the product
      srp: '', // Suggested retail price of the product
      landed_cost: [
        {
          country: '',
          amount: '',
        },
      ], // Landed cost of the product
    },
  ],
  status: '', // Status of the product (e.g., Draft or Publish)
  images: [], // Array to store uploaded product images
  product_certificates: [
    {
      file: '', // File associated with the certificate
      description: '', // Name of the certificate document
      issue_date: '', // Issue date of the certificate
      expiry_date: '', // Expiry date of the certificate
    },
  ], // Array to store certificates related to the product
  facility_certificates: [
    {
      file: '', // File associated with the certificate
      description: '', // Name of the certificate document
      issue_date: '', // Issue date of the certificate
      expiry_date: '', // Expiry date of the certificate
    },
  ], // Array to store facility-related certificates
})

// Array of predefined product categories
const categories = ['Food', 'Non-Food', 'Organic', 'Non-Organic']

// Array of predefined product statuses
const statuses = ['Draft', 'Publish']

// Reference for the image upload component
const imageUploadRef = ref(null)

// Function to add a certificate to the specified type (product or facility)
const addCertificate = (type) => {
  // Define the structure of the certificate data
  let data = {
    file: '', // File reference for the certificate
    description: '', // Name of the document
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

// Function to remove a product size value by its index
const removeProductSize = (size_index) => {
  // Remove the product size at the specified index from the product size array
  productForm.value.size.splice(size_index, 1)
}

// Function to remove a landed cost value by its index
const removeLandedCost = (size_index, cost_index) => {
  // Remove the landed cost at the specified index from the landed_cost array
  productForm.value.size[size_index].landed_cost.splice(cost_index, 1)
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

const addProductSize = () => {
  productForm.value.size.push({
    size: '',
    upc: '',
    cost: '',
    srp: '',
    landed_cost: [
      {
        country: '',
        amount: '',
      },
    ],
  })
}

const addLandedCost = (index) => {
  productForm.value.size[index].landed_cost.push({
    country: '',
    amount: '',
  })
}

// Reactive state to track loading status of the form
const formLoadingState = ref(false)
// Reference for the Quasar product form component
const productQForm = ref(null)
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

      // Append product details to FormData
      formData.append('name', productForm.value.name)
      formData.append('description', productForm.value.description)
      formData.append('category', productForm.value.category.join(', '))
      formData.append('status', productForm.value.status)

      // Append product images to FormData
      productForm.value.images.forEach((file) => {
        formData.append('images[]', file)
      })

      // Append product certificates to FormData
      productForm.value.product_certificates.forEach((cert, index) => {
        formData.append(`product_certificates[${index}][file]`, cert.file[0]) // Add file
        formData.append(`product_certificates[${index}][description]`, cert.description) // Add document name
        formData.append(`product_certificates[${index}][issue_date]`, cert.issue_date) // Add issue date
        formData.append(`product_certificates[${index}][expiry_date]`, cert.expiry_date) // Add expiry date
      })

      // Append facility certificates to FormData
      productForm.value.facility_certificates.forEach((cert, index) => {
        formData.append(`facility_certificates[${index}][file]`, cert.file[0]) // Add file
        formData.append(`facility_certificates[${index}][description]`, cert.description) // Add document name
        formData.append(`facility_certificates[${index}][issue_date]`, cert.issue_date) // Add issue date
        formData.append(`facility_certificates[${index}][expiry_date]`, cert.expiry_date) // Add expiry date
      })

      // Append sizes to FormData
      // Append sizes to FormData
      productForm.value.size.forEach((size, size_index) => {
        formData.append(`size[${size_index}][size]`, size.size) // Add size
        formData.append(`size[${size_index}][upc]`, size.upc) // Add upc
        formData.append(`size[${size_index}][cost]`, size.cost) // Add cost
        formData.append(`size[${size_index}][srp]`, size.srp) // Add cost

        size.landed_cost.forEach((cost, cost_index) => {
          formData.append(`size[${size_index}][landed_cost][${cost_index}][country]`, cost.country) // Add country
          formData.append(`size[${size_index}][landed_cost][${cost_index}][amount]`, cost.amount) // Add amount
        })
      })

      // Call the API to insert the product
      productStore
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
            productStore.Products.unshift({
              id: response.data.id,
              name: productForm.value.name,
              size: productForm.value.size,
              category: productForm.value.category.join(', '),
              status: productForm.value.status,
            })

            // Reset the product form

            imageUploadRef.value.reset()

            // loop each file upload to reset
            const references = Object.keys(refs).filter((key) => key.includes('Upload'))
            references.forEach((ref) => {
              refs[ref].reset()
            })

            productForm.value = {
              name: '',
              description: '',
              category: [],
              size: [
                {
                  size: '',
                  upc: '',
                  cost: '',
                  srp: '',
                  landed_cost: [
                    {
                      country: '',
                      amount: '',
                    },
                  ],
                },
              ],
              status: '',
              images: [],
              product_certificates: [
                {
                  file: '',
                  description: '',
                  issue_date: '',
                  expiry_date: '',
                },
              ],
              facility_certificates: [
                {
                  file: '',
                  description: '',
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
</script>
