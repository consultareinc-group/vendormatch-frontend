<template>
  <q-dialog v-model="rfqStore.ShowRFQEditDialog" persistent>
    <div class="edit-request-for-quotation" style="max-width: 900px !important">
      <q-card>
        <q-card-section>
          <div class="q-ml-sm text-h6">Edit Request For Quotation</div>
        </q-card-section>

        <q-card-section>
          <div v-if="rfqLoadingState && attachmentLoadingState">
            <div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-skeleton type="QInput" />
                </div>
                <div class="col-12 col-md-6">
                  <q-skeleton type="QInput" />
                </div>
              </div>
            </div>

            <!-- Quantity Requirements -->
            <div class="q-mt-lg">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4">
                  <q-skeleton type="QInput" />
                </div>
                <div class="col-12 col-md-4">
                  <q-skeleton type="QInput" />
                </div>
                <div class="col-12 col-md-4">
                  <q-skeleton type="QInput" />
                </div>
              </div>
            </div>

            <!-- Specifications -->
            <div class="q-mt-lg">
              <q-skeleton type="QInput" width="529px" />
            </div>

            <div class="q-mt-lg">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-skeleton type="QInput" />
                </div>
                <div class="col-12 col-md-6">
                  <q-skeleton type="QInput" />
                </div>
              </div>
            </div>

            <!-- Delivery Information -->
            <div class="q-mt-lg">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-skeleton type="QInput" />
                </div>
                <div class="col-12 col-md-6">
                  <q-skeleton type="QInput" />
                </div>
              </div>
            </div>

            <!-- Additional Notes -->
            <div class="q-mt-lg">
              <q-skeleton type="QInput" />
            </div>

            <!-- Attachments -->
            <div class="q-mt-lg">
              <q-skeleton type="QInput" />
            </div>

            <!-- Submit Button -->
            <div class="row justify-end q-mt-lg">
              <q-skeleton type="QBtn" class="q-mr-md" />
              <q-skeleton type="QBtn" />
            </div>
          </div>
          <q-form v-else @submit="editRFQ" greedy ref="rfqForm">
            <!-- Basic Information -->
            <div class="text-primary text-weight-medium q-mb-sm">Basic Information</div>
            <div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.product_name"
                    label="Product Name *"
                    :rules="[(val) => !!val || 'Product name is required']"
                    lazy-rules
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.category"
                    :options="categories"
                    label="Category *"
                    :rules="[(val) => !!val || 'Category is required']"
                    lazy-rules
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>

            <!-- Quantity Requirements -->
            <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">Quantity Requirements</div>
            <div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="form.quantity"
                    type="number"
                    label="Quantity *"
                    :rules="[
                      (val) => !!val || 'Quantity is required',
                      (val) => val > 0 || 'Quantity must be greater than 0',
                    ]"
                    lazy-rules
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="form.unit"
                    :options="units"
                    label="Unit *"
                    :rules="[(val) => !!val || 'Unit is required']"
                    lazy-rules
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="form.target_price"
                    type="number"
                    label="Target Price (Optional)"
                    prefix="$"
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>

            <!-- Specifications -->
            <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">Specifications</div>
            <q-input
              v-model="form.specifications"
              type="textarea"
              label="Product Specifications *"
              :rules="[(val) => !!val || 'Specifications are required']"
              lazy-rules
              outlined
              autogrow
              dense
            />

            <!-- Requirements -->
            <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">
              Additional Requirements
            </div>
            <div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.required_certifications"
                    :options="certificationOptions"
                    label="Required Certifications"
                    multiple
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.packaging_requirements"
                    :options="packagingOptions"
                    label="Packaging Requirements"
                    multiple
                    outlined
                    dense
                  />
                </div>
              </div>
            </div>

            <!-- Delivery Information -->
            <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">Delivery Information</div>
            <div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <!-- <q-input
                      v-model="form.delivery_location"
                      label="Delivery Location *"
                      :rules="[(val) => !!val || 'Delivery location is required']"
                      lazy-rules
                      outlined
                      dense
                    /> -->
                  <q-input
                    v-model="form.delivery_location"
                    label="Delivery Location"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-md-6">
                  <!-- <q-input
                      outlined
                      v-model="form.required_delivery_date"
                      label="Required Delivery Date *"
                      dense
                      :rules="[(val) => !!val || 'Delivery date is required']"
                      lazy-rules
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="required_delivery_date"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              minimal
                              v-model="form.required_delivery_date"
                              @update:model-value="() => $refs.required_delivery_date.hide()"
                              mask="YYYY-MM-DD"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input> -->
                  <q-input
                    outlined
                    v-model="form.required_delivery_date"
                    label="Required Delivery Date"
                    dense
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="required_delivery_date"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            minimal
                            v-model="form.required_delivery_date"
                            @update:model-value="() => $refs.required_delivery_date.hide()"
                            mask="YYYY-MM-DD"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <!-- Additional Notes -->
            <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">Additional Notes</div>
            <q-input
              v-model="form.additional_notes"
              type="textarea"
              label="Additional Notes"
              outlined
              autogrow
              dense
            />

            <!-- Attachments -->
            <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">Attachment</div>
            <q-file
              v-model="form.attachment"
              label="Upload PDF File"
              outlined
              accept=".pdf"
              dense
              ref="attachment"
            >
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <!-- Submit Button -->
            <div class="row justify-end q-mt-lg">
              <q-btn label="Close" no-caps v-close-popup class="q-mr-md" />
              <q-btn
                type="submit"
                no-caps
                color="primary"
                label="Edit RFQ"
                :loading="btnLoadingState"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'

const $q = useQuasar()
const rfqStore = useRFQStore()
const btnLoadingState = ref(false)

const categories = ['Food & Beverage', 'Health & Beauty', 'Home & Garden', 'Electronics', 'Apparel']

const units = ['Pieces', 'Boxes', 'Cartons', 'Pallets', 'Kilograms', 'Liters']

const certificationOptions = [
  'ISO 9001',
  'ISO 14001',
  'HACCP',
  'FDA',
  'CE',
  'ROHS',
  'Fair Trade',
  'Organic',
]

const packagingOptions = ['Retail Ready', 'Bulk', 'Custom Packaging', 'Eco-friendly', 'Standard']

const form = ref({
  product_name: '',
  category: null,
  quantity: null,
  unit: null,
  target_price: null,
  specifications: '',
  required_certifications: [],
  packaging_requirements: [],
  delivery_location: '',
  required_delivery_date: '',
  additional_notes: '',
  attachment: null,
})

const rfqLoadingState = ref(false)
const attachment = ref(null)
const attachmentLoadingState = ref(false)
onMounted(() => {
  rfqLoadingState.value = true
  rfqStore
    .GetRFQ({ id: rfqStore.RFQDetails.id })
    .then((response) => {
      if (response.status === 'success') {
        form.value = {
          product_name: response.data.product_name,
          category: response.data.category,
          quantity: response.data.quantity,
          unit: response.data.unit,
          target_price: response.data.target_price,
          specifications: response.data.specifications,
          required_certifications: response.data.required_certifications,
          packaging_requirements: response.data.packaging_requirements,
          delivery_location: response.data.delivery_location,
          required_delivery_date: response.data.required_delivery_date,
          additional_notes: response.data.additional_notes,
          attachment: null, // Reset attachment
        }
      }
    })
    .finally(() => {
      rfqLoadingState.value = false
    })

  attachmentLoadingState.value = true
  rfqStore
    .GetRFQAttachment(`id=${rfqStore.RFQDetails.id}&attachment=true`)
    .then((response) => {
      if (response.status === 'success') {
        fetchAndAddFile(response.data.binary, response.data.attachment_name)
      }
    })
    .finally(() => {
      attachmentLoadingState.value = false
    })
})

const rfqForm = ref(null)
const editRFQ = () => {
  rfqForm.value.validate().then((success) => {
    if (success) {
      btnLoadingState.value = true

      // Create a FormData object to prepare the data for submission
      const formData = new FormData()
      Object.keys(form.value).forEach((key) => {
        formData.append(key, form.value[key] ? form.value[key] : '')
      })

      rfqStore
        .UpdateRFQ({ id: rfqStore.RFQDetails.id, form: formData })
        .then((response) => {
          let status = Boolean(response.status === 'success') // Determine the status of the response
          $q.notify({
            message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the RFQ ${status ? 'has been' : 'was not'} updated.</p>`,
            color: `${status ? 'green' : 'red'}-2`,
            position: 'top-right',
            textColor: `${status ? 'green' : 'red'}`,
            html: true,
          })

          if (status) {
            let index = rfqStore.RFQRequests.findIndex((item) => item.id === rfqStore.RFQDetails.id)
            if (index !== -1) {
              rfqStore.RFQRequests[index].product_name = response.data.product_name
              rfqStore.RFQRequests[index].category = response.data.category
              rfqStore.RFQRequests[index].quantity = response.data.quantity
            }
            rfqStore.ShowRFQEditDialog = false // Close the edit dialog
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
          btnLoadingState.value = false
        })
    }
  })
}

// General function to fetch and add a file (image or PDF)
const fetchAndAddFile = async (base64, fileName) => {
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
    attachment.value.addFiles([file])
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
</script>

<style lang="scss">
.edit-request-for-quotation {
  textarea {
    min-height: 100px !important;
  }
}
</style>
