<template>
  <q-dialog v-model="triggerStore.EditProductDialog">
    <q-card style="min-width: 1300px">
      <q-card-section class="flex justify-between">
        <div class="text-h6">Edit Product</div>
        <div><q-btn v-close-popup icon="close" round size="sm"></q-btn></div>
      </q-card-section>

      <q-card-section>
        <div v-if="formLoadingState">
          <div class="row q-gutter-x-md">
            <div class="col-12 col-md">
              <q-skeleton height="45px" class="q-mb-md" />
              <q-skeleton height="500px" class="q-mb-md" />
            </div>
            <div class="col-12 col-md">
              <q-skeleton height="45px" class="q-mb-md" />
              <q-skeleton height="500px" class="q-mb-md" />
            </div>
            <div class="col-12 col-md">
              <q-skeleton height="45px" class="q-mb-md" />
              <q-skeleton height="500px" class="q-mb-md" />
            </div>
          </div>
        </div>
        <q-form v-show="!formLoadingState" greedy ref="productQForm">
          <div class="row q-gutter-x-md">
            <div class="col-12 col-md">
              <div class="q-pa-sm bg-grey-4 q-my-lg rounded-borders">
                <h6 class="q-ma-none font-sm">Basic Information</h6>
              </div>
              <q-input
                v-model="productForm.name"
                dense
                label="Product Name"
                :rules="[(val) => !!val || 'Product Name is required']"
                lazy-rules
                outlined
                class="q-mb-md"
              />

              <!-- <q-input
            v-model="productForm.description"
            dense
            type="textarea"
            label="Description"
            :rules="[(val) => !!val || 'Description is required']"
            lazy-rules
            autogrow
            class="q-mb-md"
          /> -->
              <q-uploader
                ref="imageUploadRef"
                @vue:updated="productForm.images = imageUploadRef.files"
                max-file-size="2097152"
                @rejected="onRejected"
                hide-upload-btn
                multiple
                accept=".jpg,.png,.jpeg"
                label="Upload image file"
                color="white"
                text-color="grey"
                class="q-mb-md full-width"
              />

              <q-input
                v-model="productForm.description"
                dense
                type="textarea"
                label="Description"
                autogrow
                outlined
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
                outlined
                multiple
              />

              <q-file
                ref="attachmentRef"
                v-model="productForm.attachments"
                outlined
                label="Attachments (PDF file)"
                multiple
                accept=".pdf, .png, .jpg, .jpeg"
                dense
                class="q-mb-md"
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
                outlined
                dense
                class="q-mb-md"
              />
            </div>
            <div class="col-12 col-md">
              <div class="q-pa-sm bg-grey-4 q-my-lg rounded-borders">
                <h6 class="q-ma-none font-sm">Product Size / Parameters</h6>
              </div>
              <div v-for="(size, size_index) in productForm.size" :key="size_index">
                <div class="flex justify-end">
                  <q-icon
                    v-if="size_index !== 0"
                    name="close"
                    size="sm"
                    color="red"
                    class="cursor-pointer q-mb-sm"
                    @click="removeProductSize(size_index)"
                  />
                </div>
                <q-card class="q-pa-md q-mb-md">
                  <!-- <q-input
                outlined
                v-model="size.size"
                dense
                label="Size"
                :rules="
                  productForm.status === 'Publish' ? [(val) => !!val || 'Size is required'] : []
                "
                lazy-rules
                class="q-mb-md"
              /> -->
                  <q-input outlined v-model="size.size" dense label="Size" class="q-mb-md" />
                  <!-- <q-input
                outlined
                v-model="size.upc"
                dense
                label="UPC"
                :rules="
                  productForm.status === 'Publish' ? [(val) => !!val || 'UPC is required'] : []
                "
                lazy-rules
                class="q-mb-md"
              /> -->
                  <q-input outlined v-model="size.upc" dense label="UPC" class="q-mb-md" />
                  <!-- <q-toggle
                @click="checkProductStatus()"
                v-model="size.is_cost_negotiable"
                label="Negotiable"
                class="q-mb-md"
              /> -->
                  <q-toggle v-model="size.is_cost_negotiable" label="Negotiable" class="q-mb-md" />
                  <!-- <q-input
                :disable="size.is_cost_negotiable"
                outlined
                v-model.number="size.cost"
                dense
                type="number"
                label="Cost"
                prefix="$"
                :rules="
                  productForm.status === 'Publish'
                    ? [
                        (val) => !!val || 'Cost is required',
                        (val) => val > 0 || 'Cost must be greater than 0',
                      ]
                    : []
                "
                lazy-rules
                class="q-mb-md"
              /> -->

                  <q-input
                    :disable="size.is_cost_negotiable"
                    outlined
                    v-model.number="size.cost"
                    dense
                    type="number"
                    label="Cost"
                    prefix="$"
                    class="q-mb-md"
                  />

                  <!-- <q-input
                :disable="size.is_cost_negotiable"
                outlined
                v-model.number="size.srp"
                dense
                type="number"
                label="SRP"
                prefix="$"
                :rules="
                  productForm.status === 'Publish'
                    ? [
                        (val) => !!val || 'SRP is required',
                        (val) => val > 0 || 'SRP must be greater than 0',
                      ]
                    : []
                "
                lazy-rules
                class="q-mb-md"
              /> -->
                  <q-input
                    :disable="size.is_cost_negotiable"
                    outlined
                    v-model.number="size.srp"
                    dense
                    type="number"
                    label="SRP"
                    prefix="$"
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
                      <!-- <q-input
                    outlined
                    v-model.number="cost.country"
                    dense
                    label="Destination/Country"
                    :rules="
                      productForm.status === 'Publish'
                        ? [(val) => !!val || 'Destination/Country is required']
                        : []
                    "
                    lazy-rules
                    class="q-mb-md"
                  /> -->
                      <q-input
                        outlined
                        v-model.number="cost.country"
                        dense
                        label="Destination/Country"
                        class="q-mb-md"
                      />
                      <!-- <q-input
                    outlined
                    :disable="size.is_cost_negotiable"
                    v-model.number="cost.amount"
                    dense
                    type="number"
                    label="Landed Cost"
                    prefix="$"
                    :rules="
                      productForm.status === 'Publish'
                        ? [
                            (val) => !!val || 'Landed cost is required',
                            (val) => val > 0 || 'Landed cost must be greater than 0',
                          ]
                        : []
                    "
                    lazy-rules
                  /> -->
                      <q-input
                        outlined
                        :disable="size.is_cost_negotiable"
                        v-model.number="cost.amount"
                        dense
                        type="number"
                        label="Landed Cost"
                        prefix="$"
                      />
                    </div>

                    <q-btn
                      icon="add"
                      dense
                      label="Add Destination/Country"
                      class="q-px-sm q-mt-md"
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
            </div>
            <div class="col-12 col-md">
              <div class="q-pa-sm bg-grey-4 q-my-lg rounded-borders">
                <h6 class="q-ma-none font-sm">Certifications</h6>
              </div>

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
                    max-file-size="2097152"
                    @rejected="onRejected"
                    hide-upload-btn
                    accept=".pdf"
                    label="Upload pdf file"
                    color="white"
                    text-color="grey"
                    class="q-mb-md full-width"
                  />
                  <div v-if="certificate?.file?.length">
                    <q-input
                      outlined
                      v-model="certificate.description"
                      label="Document Name"
                      :rules="
                        productForm.status === 'Publish'
                          ? [(val) => !!val || 'Document name is required']
                          : []
                      "
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
                      :rules="
                        productForm.status === 'Publish'
                          ? [
                              (val) => !!val || 'Field is required', // Ensure the field is not empty
                              (val) =>
                                /^\d{4}-\d{2}-\d{2}$/.test(val) ||
                                'Invalid date format (YYYY-MM-DD)', // Validate date format
                            ]
                          : []
                      "
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
                      :rules="
                        productForm.status === 'Publish'
                          ? [
                              (val) => !!val || 'Field is required', // Ensure the field is not empty
                              (val) =>
                                /^\d{4}-\d{2}-\d{2}$/.test(val) ||
                                'Invalid date format (YYYY-MM-DD)', // Validate date format
                            ]
                          : []
                      "
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
                  </div>

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
                    max-file-size="2097152"
                    @rejected="onRejected"
                    hide-upload-btn
                    accept=".pdf"
                    label="Upload pdf file"
                    color="white"
                    text-color="grey"
                    class="q-mb-md full-width"
                  />
                  <div v-if="certificate?.file?.length">
                    <q-input
                      outlined
                      v-model="certificate.description"
                      label="Document Name"
                      :rules="
                        productForm.status === 'Publish'
                          ? [(val) => !!val || 'Document name is required']
                          : []
                      "
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
                      :rules="
                        productForm.status === 'Publish'
                          ? [
                              (val) => !!val || 'Field is required', // Ensure the field is not empty
                              (val) =>
                                /^\d{4}-\d{2}-\d{2}$/.test(val) ||
                                'Invalid date format (YYYY-MM-DD)', // Validate date format
                            ]
                          : []
                      "
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
                      :rules="
                        productForm.status === 'Publish'
                          ? [
                              (val) => !!val || 'Field is required', // Ensure the field is not empty
                              (val) =>
                                /^\d{4}-\d{2}-\d{2}$/.test(val) ||
                                'Invalid date format (YYYY-MM-DD)', // Validate date format
                            ]
                          : []
                      "
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
                  </div>

                  <div
                    v-if="index !== productForm.facility_certificates.length - 1"
                    class="q-pb-sm"
                  >
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
            </div>
          </div>

          <div class="row justify-end q-mt-md">
            <q-btn flat label="Close" color="negative" v-close-popup class="q-mr-sm" />
            <q-btn
              @click="updateProduct"
              label="Update"
              color="primary"
              :loading="btnLoadingState"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// Import Vue's reactive and lifecycle utilities
import { ref, onMounted, watch } from 'vue'

// Import the store for dashboard-related state management
import { useProductStore } from 'src/stores/products'
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
  id: null,
  name: null, // Name of the product
  description: null, // Description of the product
  category: [], // Categories associated with the product
  size: [
    {
      size: null, // Size of the product
      upc: null, // Upc code of the product
      cost: null, // Cost of the product
      srp: null, // Suggested retail price of the product
      landed_cost: [
        {
          country: null,
          amount: null,
        },
      ], // Landed cost of the product
      is_cost_negotiable: false,
    },
  ],
  status: 'Draft', // Status of the product (e.g., Draft or Publish)
  images: [], // Array to store uploaded product images
  product_certificates: [
    {
      file: null, // File associated with the certificate
      description: null, // Name of the certificate document
      issue_date: null, // Issue date of the certificate
      expiry_date: null, // Expiry date of the certificate
    },
  ], // Array to store certificates related to the product
  facility_certificates: [
    {
      file: null, // File associated with the certificate
      description: null, // Name of the certificate document
      issue_date: null, // Issue date of the certificate
      expiry_date: null, // Expiry date of the certificate
    },
  ], // Array to store facility-related certificates
  attachments: [],
})

// Array of predefined product categories
const categories = ['Food', 'Non-Food', 'Organic', 'Non-Organic', 'Dietary Supplements']

// Array of predefined product statuses
const statuses = ['Draft', 'Publish']

const formLoadingState = ref(false)
onMounted(() => {
  formLoadingState.value = true
  productStore
    .GetProductToEdit({ id: productStore.ProductDetails.id })
    .then((response) => {
      if (response.status === 'success') {
        productForm.value = response.data
        // Restructure the  category value
        productForm.value.category = productForm.value.category.split(', ')

        productForm.value.size.forEach((size) => {
          if (size.size === 'null') size.size = null
          if (size.upc === 'null') size.upc = null

          size.landed_cost.forEach((cost) => {
            if (cost.country === 'null') cost.country = null
          })
        })

        // convert base64 to real file and add to q-uploader
        productForm.value.images.forEach((image) => {
          fetchAndAddFile(image.binary, image.name)
        })

        // convert base64 to real file and add to q-uploader
        productForm.value.attachments.forEach((attachment) => {
          fetchAndAddFile(attachment.binary, attachment.name, 'attachmentRef')
        })

        // convert base64 to real file and add to q-uploader
        productForm.value.product_certificates.forEach((cert, index) => {
          // set default file value
          cert.file = []
          fetchAndAddFile(cert.binary, cert.name, `productCertificateUploadRef${index}`)
        })

        // set default empty fields if there is no product certificate fetch from the database
        if (!productForm.value.product_certificates.length) {
          productForm.value.product_certificates = [
            {
              file: null,
              description: null,
              issue_date: null,
              expiry_date: null,
            },
          ]
        }
        // convert base64 to real file and add to q-uploader
        productForm.value.facility_certificates.forEach((cert, index) => {
          // set default file value
          cert.file = []
          fetchAndAddFile(cert.binary, cert.name, `facilityCertificateUploadRef${index}`)
        })

        // set default empty fields if there is no facility certificate fetch from the database
        if (!productForm.value.facility_certificates.length) {
          productForm.value.facility_certificates = [
            {
              file: null,
              description: null,
              issue_date: null,
              expiry_date: null,
            },
          ]
        }

        productForm.value.size.forEach((size) => {
          // set is_cost_negotiable value
          if (!size.cost || size.cost === '0.00') {
            size.is_cost_negotiable = true
          } else {
            size.is_cost_negotiable = false
          }
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
    .finally(() => {
      formLoadingState.value = false
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
      if (ref === 'attachmentRef') {
        attachmentRef.value.addFiles([file])
      } else {
        refs[ref].addFiles([file])
      }
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
const attachmentRef = ref(null)

// Function to add a certificate to the specified type (product or facility)
const addCertificate = (type) => {
  // Define the structure of the certificate data
  let data = {
    file: null, // File reference for the certificate
    description: null, // Name of the document
    issue_date: null, // Issue date of the certificate
    expiry_date: null, // Expiry date of the certificate
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
    size: null,
    upc: null,
    cost: null,
    srp: null,
    landed_cost: [
      {
        country: null,
        amount: null,
      },
    ],
    is_cost_negotiable: false,
  })
}

const addLandedCost = (index) => {
  productForm.value.size[index].landed_cost.push({
    country: null,
    amount: null,
  })
}

// Watch for changes in the productForm object
watch(
  productForm,
  () => {
    // Require cost, SRP, and landed cost if the status is "Publish"
    // if (productForm.value.status === 'Publish') {
    //   // Loop through each size in the productForm and set is_cost_negotiable to false
    //   productForm.value.size.forEach((size) => {
    //     size.is_cost_negotiable = false
    //   })
    // } else {
    //   // If the status is not "Publish", check if cost negotiation is enabled
    //   productForm.value.size.forEach((size) => {
    //     if (size.is_cost_negotiable) {
    //       // Reset cost and SRP to null when cost is negotiable
    //       size.cost = null
    //       size.srp = null

    //       // Loop through each landed_cost and reset its amount to null
    //       size.landed_cost.forEach((cost) => {
    //         cost.amount = null
    //       })
    //     }
    //   })
    // }

    // If the status is not "Publish", check if cost negotiation is enabled
    productForm.value.size.forEach((size) => {
      if (size.is_cost_negotiable) {
        // Reset cost and SRP to null when cost is negotiable
        size.cost = null
        size.srp = null

        // Loop through each landed_cost and reset its amount to null
        size.landed_cost.forEach((cost) => {
          cost.amount = null
        })
      }
    })
  },
  { deep: true }, // Deep watch to track changes in nested properties
)

// Function to check product status and display a notification if status is "Publish"
// const checkProductStatus = () => {
//   if (productForm.value.status === 'Publish') {
//     // Show a notification to the user that enabling a negotiable cost is not allowed
//     $q.notify({
//       message: `<p class='q-mb-none'>Enabling a negotiable cost is not allowed when the product status is set to "Publish."</p>`,
//       color: `red-2`, // Set the notification background color
//       position: 'top', // Display the notification at the bottom
//       textColor: `red`, // Set the notification text color
//       html: true, // Allow HTML in the notification message
//     })
//   }
// }

// Reactive state to track loading status of the form
const btnLoadingState = ref(false)
// Reference for the Quasar product form component
const productQForm = ref(null)
// Function to handle product saving
const updateProduct = () => {
  // Validate the product form
  productQForm.value.validate().then((success) => {
    if (success) {
      // Check if at least one image is uploaded
      // if (!productForm.value.images.length) {
      //   $q.notify({
      //     message: `<p class='q-mb-none'>Product image is required.</p>`,
      //     color: `red-2`,
      //     position: 'top',
      //     textColor: `red`,
      //     html: true,
      //   })
      //   return // Exit if no image is uploaded
      // }

      // Initialize error flag for certificate validation
      // let error = false

      // Validate product certificates
      // productForm.value.product_certificates.forEach((cert) => {
      //   if (!cert.file.length && productForm.value.status === 'Publish') {
      //     $q.notify({
      //       message: `<p class='q-mb-none'>Product certificate is required.</p>`,
      //       color: `red-2`,
      //       position: 'top',
      //       textColor: `red`,
      //       html: true,
      //     })
      //     error = true // Set error flag to true if validation fails
      //   }
      // })

      // Validate facility certificates
      // productForm.value.facility_certificates.forEach((cert) => {
      //   if (!cert.file.length && productForm.value.status === 'Publish') {
      //     $q.notify({
      //       message: `<p class='q-mb-none'>Facility certificate is required.</p>`,
      //       color: `red-2`,
      //       position: 'top',
      //       textColor: `red`,
      //       html: true,
      //     })
      //     error = true // Set error flag to true if validation fails
      //   }
      // })

      // Exit if any certificate validation failed
      // if (error) {
      //   return
      // }

      btnLoadingState.value = true // Set loading state to true

      // Create a FormData object to prepare the data for submission
      const formData = new FormData()

      // Append product details to FormData
      formData.append('id', productForm.value.id)
      formData.append('name', productForm.value.name)
      formData.append('description', productForm.value.description)
      formData.append('category', productForm.value.category.join(', '))
      formData.append('status', productForm.value.status)

      // Append product attachments to FormData
      productForm.value.attachments.forEach((file) => {
        formData.append('attachments[]', file)
      })

      if (!productForm.value.attachments.length) {
        formData.append('attachments[]', null)
      }

      // Append product images to FormData
      productForm.value.images.forEach((file) => {
        formData.append('images[]', file)
      })

      if (!productForm.value.images.length) {
        formData.append('images[]', null)
      }

      // Append product certificates to FormData
      productForm.value.product_certificates.forEach((cert, index) => {
        formData.append(`product_certificates[${index}][file]`, cert.file[0] ?? null) // Add file
        formData.append(`product_certificates[${index}][description]`, cert.description) // Add document name
        formData.append(`product_certificates[${index}][issue_date]`, cert.issue_date) // Add issue date
        formData.append(`product_certificates[${index}][expiry_date]`, cert.expiry_date) // Add expiry date
      })

      // Append facility certificates to FormData
      productForm.value.facility_certificates.forEach((cert, index) => {
        formData.append(`facility_certificates[${index}][file]`, cert.file[0] ?? null) // Add file
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
        .UpdateProduct({ id: productForm.value.id, form: formData })
        .then((response) => {
          let status = Boolean(response.status === 'success') // Determine the status of the response
          $q.notify({
            message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the product ${status ? 'has been' : 'was not'} updated.</p>`,
            color: `${status ? 'green' : 'red'}-2`,
            position: 'top-right',
            textColor: `${status ? 'green' : 'red'}`,
            html: true,
          })

          // Add the new product to the table if successful
          if (status) {
            let index = productStore.VendorProducts.findIndex(
              (product) => product.id == productForm.value.id,
            )

            productStore.VendorProducts[index].id = response.data.id
            productStore.VendorProducts[index].name = productForm.value.name
            productStore.VendorProducts[index].size = productForm.value.size
            productStore.VendorProducts[index].category = productForm.value.category.join(', ')
            productStore.VendorProducts[index].status = productForm.value.status
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
          btnLoadingState.value = false // Reset loading state
        })
    } else {
      $q.notify({
        message: `<p class='q-mb-none'>Please fill out the required fields.</p>`,
        color: `red-2`,
        position: 'top',
        textColor: `red`,
        html: true,
      })
    }
  })
}
const onRejected = () => {
  $q.notify({
    type: 'negative',
    message: `Upload failed: The file size exceeds 2MB or the file type is invalid.`,
  })
}
</script>
