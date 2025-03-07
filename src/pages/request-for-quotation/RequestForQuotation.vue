<template>
  <div class="q-pa-md request-for-quotation">
    <div class="row q-col-gutter-md">
      <!-- RFQ Form -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="flex justify-start items-center">
              <q-icon name="arrow_back" size="sm" class="cursor-pointer" @click="router.go(-1)" />
              <div class="q-ml-sm text-h6">Request For Quotation</div>
            </div>
            <div class="text-subtitle2 text-grey-7">
              Fill in the details below to request a quote
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="submitRFQ" class="q-gutter-md">
              <!-- Basic Information -->
              <div class="text-primary text-weight-medium q-mb-sm">Basic Information</div>
              <div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="form.productName"
                      label="Product Name *"
                      :rules="[(val) => !!val || 'Product name is required']"
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
                      outlined
                      dense
                    />
                  </div>
                </div>
              </div>

              <!-- Quantity Requirements -->
              <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">
                Quantity Requirements
              </div>
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
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model.number="form.targetPrice"
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
                      v-model="form.certifications"
                      :options="certificationOptions"
                      label="Required Certifications"
                      multiple
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="form.packaging"
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
              <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">
                Delivery Information
              </div>
              <div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="form.deliveryLocation"
                      label="Delivery Location *"
                      :rules="[(val) => !!val || 'Delivery location is required']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="form.deliveryDate"
                      label="Required Delivery Date *"
                      :rules="[(val) => !!val || 'Delivery date is required']"
                      type="date"
                      outlined
                      dense
                    />
                  </div>
                </div>
              </div>

              <!-- Additional Notes -->
              <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">Additional Notes</div>
              <q-input
                v-model="form.notes"
                type="textarea"
                label="Additional Notes"
                outlined
                autogrow
                dense
              />

              <!-- Attachments -->
              <div class="text-primary text-weight-medium q-mb-sm q-mt-lg">Attachments</div>
              <q-file
                v-model="form.attachments"
                label="Upload Documents"
                multiple
                outlined
                accept=".pdf,.doc,.docx,.xls,.xlsx, .png, .jpg, .jpeg"
                max-files="5"
                dense
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <!-- Submit Button -->
              <div class="row justify-end q-mt-lg">
                <q-btn type="submit" color="primary" label="Submit RFQ" :loading="submitting" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Guidelines -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">RFQ Guidelines</div>
          </q-card-section>

          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="check_circle" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Be specific about product requirements</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="check_circle" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Include all relevant specifications</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="check_circle" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Specify quantity and packaging needs</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="check_circle" color="positive" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Provide realistic delivery timeframes</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Need Help?</div>
            <p class="text-grey-7">
              Contact our support team for assistance with your RFQ submission.
            </p>
            <q-btn
              flat
              color="primary"
              label="Contact Support"
              icon="help"
              @click="contactSupport"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const submitting = ref(false)

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
  productName: '',
  category: null,
  quantity: null,
  unit: null,
  targetPrice: null,
  specifications: '',
  certifications: [],
  packaging: [],
  deliveryLocation: '',
  deliveryDate: '',
  notes: '',
  attachments: null,
})

const submitRFQ = async () => {
  submitting.value = true
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    $q.notify({
      type: 'positive',
      message: 'RFQ submitted successfully',
    })

    // Reset form
    form.value = {
      productName: '',
      category: null,
      quantity: null,
      unit: null,
      targetPrice: null,
      specifications: '',
      certifications: [],
      packaging: [],
      deliveryLocation: '',
      deliveryDate: '',
      notes: '',
      attachments: null,
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Failed to submit RFQ. ${error.message} Please try again.`,
    })
  } finally {
    submitting.value = false
  }
}

const contactSupport = () => {
  $q.notify({
    type: 'info',
    message: 'Support contact feature coming soon',
  })
}
</script>

<style lang="scss">
.request-for-quotation {
  textarea {
    min-height: 100px !important;
  }
}
</style>
