<template>
  <q-dialog v-model="triggerStore.EditProductDialog">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Edit Product</div>
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
          <!-- <q-skeleton v-if="!productForm.product_certificates[0].name" height="432px"></q-skeleton> -->
          <div>
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
          </div>

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
import { ref, onMounted } from 'vue'

// Import the store for dashboard-related state management
import { useDashboardStore } from 'src/stores/dashboard'
import { useTriggerStore } from 'src/stores/triggers'

// Import Quasar framework utilities
import { useQuasar } from 'quasar'

// Initialize Quasar for UI utilities
const $q = useQuasar()

// Initialize the dashboard store for state and actions related to the dashboard
const dashboardStore = useDashboardStore()
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

onMounted(() => {
  dashboardStore
    .GetProduct({ id: dashboardStore.ProductDetails.id })
    .then((response) => {
      if (response.status === 'success') {
        productForm.value = response.data
        // Restructure the  category value
        productForm.value.category = productForm.value.category.split(', ')

        // convert base64 to real file and add to q-uploader
        productForm.value.images.forEach((image) => {
          fetchAndAddFile(image.binary, image.name)
        })
        // convert base64 to real file and add to q-uploader
        productForm.value.product_certificates.forEach((cert, index) => {
          fetchAndAddFile(cert.binary, cert.name, `productCertificateUploadRef${index}`)
        })
        // convert base64 to real file and add to q-uploader
        productForm.value.facility_certificates.forEach((cert, index) => {
          fetchAndAddFile(cert.binary, cert.name, `facilityCertificateUploadRef${index}`)
        })
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
})

// General function to fetch and add a file (image or PDF)
const fetchAndAddFile = async (base64, fileName, ref = 'imageUploadRef') => {
  try {
    // Determine MIME type based on file extension
    const fileExtension = fileName.split('.').pop().toLowerCase()
    let mimeType

    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
      mimeType = 'image/jpeg'
    } else if (fileExtension === 'png') {
      mimeType = 'image/png'
    } else if (fileExtension === 'pdf') {
      mimeType = 'application/pdf'
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`)
    }

    // Convert Base64 to Blob
    const blob = await base64ToBlob(base64, mimeType)

    // Create a File object
    const file = new File([blob], fileName, { type: mimeType })

    // Use q-uploader's addFiles method to add the file
    if (fileExtension === 'pdf') {
      refs[ref].addFiles([file])
    } else {
      imageUploadRef.value.addFiles([file])
    }
  } catch (error) {
    console.error('Error in fetchAndAddFile:', error.message)
  }
}

// Async utility function: Convert Base64 string to Blob
const base64ToBlob = async (base64, mimeType) => {
  return new Promise((resolve, reject) => {
    try {
      // Decode Base64 string
      const byteString = atob(base64)
      const arrayBuffer = new ArrayBuffer(byteString.length)
      const uint8Array = new Uint8Array(arrayBuffer)

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i)
      }

      const blob = new Blob([uint8Array], { type: mimeType })
      resolve(blob)
    } catch (error) {
      reject(new Error('Error converting Base64 to Blob: ' + error.message))
    }
  })
}
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
  // Create a FormData object to prepare the data for submission
  const formData = new FormData()

  // Append product images to FormData
  productForm.value.images.forEach((file) => {
    formData.append('images[]', file)
  })

  console.log('productForm.value.images ', productForm.value.images)

  // Call the API to insert the product
  //   }
  // })
}
</script>
