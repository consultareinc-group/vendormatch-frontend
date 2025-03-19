<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Filters -->
      <div class="col-12">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filter.status"
                  :options="['All', 'Pending', 'Responded', 'Closed']"
                  label="Status"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filter.category"
                  :options="['All', ...categories]"
                  label="Category"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="filter.search" label="Search" outlined dense>
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  color="primary"
                  icon="filter_list"
                  label="Filter"
                  class="full-width"
                  @click="applyFilters"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- RFQ Cards Grid -->
      <div class="col-12">
        <div v-if="rfqLoadingState" class="row q-col-gutter-md">
          <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
            <q-card class="rfq-card">
              <q-card-section>
                <q-skeleton height="40px"></q-skeleton>
                <q-skeleton height="20px" class="q-mt-sm"></q-skeleton>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-skeleton height="20px"></q-skeleton>
                  </div>
                  <div class="col-6">
                    <q-skeleton height="20px"></q-skeleton>
                  </div>
                  <div class="col-12">
                    <q-skeleton height="20px"></q-skeleton>
                  </div>
                  <div class="col-12">
                    <q-skeleton height="20px"></q-skeleton>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="q-gutter-xs">
                  <q-skeleton height="20px"></q-skeleton>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-skeleton width="100px" height="40px"></q-skeleton>
              </q-card-actions>
            </q-card>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div v-for="rfq in rfqs" :key="rfq.id" class="col-12 col-sm-6 col-md-4">
            <q-card class="rfq-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6 ellipsis">{{ rfq.product_name }}</div>
                    <q-tooltip anchor="top left" self="top left" class="bg-primary">{{
                      rfq.product_name
                    }}</q-tooltip>
                    <div class="text-subtitle2">{{ rfq.category }}</div>
                  </div>
                  <div class="col-auto">
                    <q-chip :color="getStatusColor(rfq.status)" text-color="white" size="sm">
                      {{ rfq.status }}
                    </q-chip>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <div class="text-caption text-grey">Quantity</div>
                    <div>{{ rfq.quantity }} {{ rfq.unit }}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-caption text-grey">Target Price</div>
                    <div>${{ rfq.target_price }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption text-grey">Delivery Location</div>
                    <div>{{ rfq.delivery_location }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption text-grey">Delivery Date</div>
                    <div>{{ formatDate(rfq.required_delivery_date) }}</div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="text-caption text-grey">Required Certifications</div>
                <div class="q-gutter-xs">
                  <div v-if="rfq.required_certifications">
                    <q-chip
                      v-for="cert in rfq.required_certifications
                        .split(', ')
                        .map((item) => item.trim())"
                      :key="cert"
                      size="sm"
                      outline
                    >
                      {{ cert }}
                    </q-chip>
                  </div>
                  <div v-else><q-chip size="sm" outline>none</q-chip></div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  flat
                  color="primary"
                  icon="visibility"
                  label="View Details"
                  no-caps
                  @click="viewRFQDetails(rfq)"
                />
                <q-btn
                  color="primary"
                  icon="chat"
                  label="Respond"
                  no-caps
                  @click="respondToRFQ(rfq)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      <div v-if="!searchResults.length && isSearching" class="text-center q-mt-xl full-width">
        No Results Found!
      </div>
      <div v-if="rfqs.length > 100" class="flex justify-center full-width q-my-md">
        <q-btn
          @click="getRFQs()"
          label="View More"
          class="bg-white"
          no-caps
          :loading="viewMoreLoadingState"
        />
      </div>
    </div>

    <!-- RFQ Details Dialog -->
    <q-dialog v-model="showDetailsDialog" full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">RFQ Details</div>
        </q-card-section>

        <q-card-section v-if="selectedRFQ">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Product Name</q-item-label>
                    <q-item-label>{{ selectedRFQ.product_name }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Category</q-item-label>
                    <q-item-label>{{ selectedRFQ.category }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Quantity</q-item-label>
                    <q-item-label>{{ selectedRFQ.quantity }} {{ selectedRFQ.unit }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-12 col-md-4">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Target Price</q-item-label>
                    <q-item-label>${{ selectedRFQ.target_price }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Delivery Location</q-item-label>
                    <q-item-label>{{ selectedRFQ.delivery_location }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Delivery Date</q-item-label>
                    <q-item-label>{{
                      formatDate(selectedRFQ.required_delivery_date)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-12 col-md-4">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Specifications</q-item-label>
                    <q-item-label>{{ selectedRFQ.specifications }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Required Certifications</q-item-label>
                    <div class="q-gutter-xs">
                      <div v-if="selectedRFQ.required_certifications">
                        <q-chip
                          v-for="cert in selectedRFQ.required_certifications
                            .split(',')
                            .map((item) => item.trim())"
                          :key="cert"
                          size="sm"
                        >
                          {{ cert }}
                        </q-chip>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Packaging Requirements</q-item-label>
                    <div class="q-gutter-xs">
                      <div v-if="selectedRFQ.packaging_requirements">
                        <q-chip
                          v-for="pkg in selectedRFQ.packaging_requirements
                            .split(',')
                            .map((item) => item.trim())"
                          :key="pkg"
                          size="sm"
                        >
                          {{ pkg }}
                        </q-chip>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Additional Notes</q-item-label>
                    <q-item-label>{{ selectedRFQ.additional_notes }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Attachment</q-item-label>
                    <q-spinner
                      v-if="attachmentLoadingState"
                      color="primary"
                      size="3em"
                      :thickness="2"
                      class="q-mt-sm"
                    />
                    <div v-else class="q-mt-sm">
                      <div id="attachment"></div>
                      <q-tooltip anchor="bottom left" self="bottom middle" class="bg-primary"
                        >Click Me!</q-tooltip
                      >
                    </div>

                    <q-item-label></q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6 q-my-md">RFQ Responses</div>
          <q-table color="primary" :rows="rfq_responses" :columns="columns" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="negative" v-close-popup no-caps />
          <q-btn
            color="primary"
            icon="chat"
            label="Respond"
            no-caps
            @click="respondToRFQ(selectedRFQ)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Response Form Dialog -->
    <q-dialog
      v-model="showResponseDialog"
      persistent
      :position="showDetailsDialog ? 'right' : 'standard'"
      :allow-focus-outside="showDetailsDialog"
      :no-shake="showDetailsDialog"
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Respond to RFQ</div>
          <div class="text-subtitle2" v-if="selectedRFQ">
            {{ selectedRFQ.product_name }} - {{ selectedRFQ.id }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitResponse" class="q-gutter-md">
            <q-input
              v-model.number="responseForm.quotedPrice"
              type="number"
              label="Quoted Price per Unit *"
              prefix="$"
              :rules="[
                (val) => !!val || 'Price is required',
                (val) => val > 0 || 'Price must be greater than 0',
              ]"
              outlined
              dense
            />

            <q-input
              v-model.number="responseForm.minQuantity"
              type="number"
              label="Minimum Order Quantity *"
              :rules="[
                (val) => !!val || 'Minimum quantity is required',
                (val) => val > 0 || 'Quantity must be greater than 0',
              ]"
              outlined
              dense
            />

            <q-input
              v-model="responseForm.leadTime"
              type="number"
              label="Lead Time (days) *"
              :rules="[
                (val) => !!val || 'Lead time is required',
                (val) => val > 0 || 'Lead time must be greater than 0',
              ]"
              outlined
              dense
            />

            <q-select
              v-model="responseForm.paymentTerms"
              :options="paymentTermsOptions"
              label="Payment Terms *"
              :rules="[(val) => !!val || 'Payment terms are required']"
              outlined
              dense
            />

            <q-input
              v-model="responseForm.shippingTerms"
              label="Shipping Terms *"
              :rules="[(val) => !!val || 'Shipping terms are required']"
              outlined
              dense
            />

            <q-input
              class="additional-notes"
              v-model="responseForm.additionalNotes"
              type="textarea"
              label="Additional Notes"
              outlined
              dense
              autogrow
            />

            <q-toggle
              v-model="responseForm.canMeetSpecs"
              label="I confirm that I can meet all specified requirements"
            />

            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="negative" no-caps v-close-popup class="q-mr-sm" />
              <q-btn
                type="submit"
                label="Submit Response"
                no-caps
                color="primary"
                :loading="responseLoadingState"
                @click="submitResponse()"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { date } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'
import { useHelperStore } from 'src/stores/helper'

const $q = useQuasar()
const rfqStore = useRFQStore()
const helperStore = useHelperStore()

const showDetailsDialog = ref(false)
const selectedRFQ = ref(null)

const filter = ref({
  status: 'All',
  category: 'All',
  search: '',
})

const categories = ['Food & Beverage', 'Health & Beauty', 'Home & Garden', 'Electronics', 'Apparel']
const rfq_responses = ref([])
const columns = [
  {
    name: 'quoted_price',
    label: 'Quoted Price',
    field: 'quoted_price',
    sortable: true,
    align: 'left',
  },
  {
    name: 'minimum_order_quantity',
    label: 'Minimum Order Quantity',
    field: 'minimum_order_quantity',
    sortable: true,
    align: 'left',
  },
  {
    name: 'lead_time',
    label: 'Lead Time',
    field: 'lead_time',
    sortable: true,
    align: 'left',
  },
  {
    name: 'payment_terms',
    label: 'Payment Terms',
    field: 'payment_terms',
    sortable: true,
    align: 'left',
  },
  {
    name: 'shipping_terms',
    label: 'Shipping Terms',
    field: 'shipping_terms',
    sortable: true,
    align: 'left',
  },
]

const rfqs = ref(rfqStore.RFQs)

const rfqLoadingState = ref(false)
const viewMoreLoadingState = ref(false)
const getRFQs = () => {
  rfqLoadingState.value = true
  if (rfqStore.RFQs.length) {
    rfqLoadingState.value = false
  }
  viewMoreLoadingState.value = true
  rfqStore
    .GetRFQs(`offset=${rfqs.value.length}&is_not_closed=true`)
    .then((response) => {
      if (response.status === 'success') {
        rfqStore.RFQs.push(...response.data)
      }
    })
    .finally(() => {
      rfqLoadingState.value = false
      viewMoreLoadingState.value = false
    })
}

onMounted(() => {
  if (!rfqStore.RFQs.length) {
    getRFQs()
  }
})

const getStatusColor = (status) => {
  const colors = {
    Pending: 'warning',
    Responded: 'info',
    Closed: 'grey',
  }

  return colors[status] || 'grey'
}

const formatDate = (dateStr) => {
  return date.formatDate(dateStr, 'MMMM D, YYYY')
}

const searchResults = ref([])
const isSearching = ref(false)
const searchRFQs = () => {
  isSearching.value = true
  rfqStore
    .SearchRFQs(
      `offset=${rfqs.value.length}&search_keyword=${filter.value.search}&status=${filter.value.status}&category=${encodeURIComponent(filter.value.category)}&is_not_closed=true`,
    )
    .then((response) => {
      if (response.status === 'success') {
        rfqs.value.push(...response.data)
        searchResults.value.push(...response.data)

        if (response.data.length) {
          searchRFQs()
        }
      }
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: error.message,
      })
    })
    .finally(() => {
      rfqLoadingState.value = false
    })
}

const applyFilters = () => {
  rfqs.value = []
  rfqLoadingState.value = true
  searchRFQs()
}

const attachment = ref({ attachment_name: '' })
const attachmentLoadingState = ref(false)
const viewRFQDetails = (rfq) => {
  selectedRFQ.value = rfq
  showDetailsDialog.value = true
  attachmentLoadingState.value = true
  attachment.value = { attachment_name: '' }
  rfqStore
    .GetRFQAttachment(`id=${rfq.id}&attachment=true`)
    .then((response) => {
      if (response.status === 'success') {
        attachment.value = response.data

        if (attachment.value.attachment_name) {
          helperStore.createPdfThumbnail(attachment.value.binary, 'attachment')
        }
      }
    })
    .finally(() => {
      attachmentLoadingState.value = false
    })
}

const showResponseDialog = ref(false)
const responseForm = ref({
  quotedPrice: null,
  minQuantity: null,
  leadTime: null,
  paymentTerms: null,
  shippingTerms: '',
  additionalNotes: '',
  canMeetSpecs: false,
})

const paymentTermsOptions = [
  'Net 30',
  'Net 60',
  'Net 90',
  'Payment in advance',
  'Letter of credit',
  'Cash on delivery',
]

const respondToRFQ = (rfq) => {
  selectedRFQ.value = rfq
  showResponseDialog.value = true
  // Reset form
  responseForm.value = {
    quotedPrice: null,
    minQuantity: null,
    leadTime: null,
    paymentTerms: null,
    shippingTerms: '',
    additionalNotes: '',
    canMeetSpecs: false,
  }
}

const responseLoadingState = ref(false)
const submitResponse = async () => {
  if (!responseForm.value.canMeetSpecs) {
    $q.notify({
      type: 'warning',
      message: 'Please confirm that you can meet all specifications',
      position: 'top',
    })
    return
  }

  responseLoadingState.value = true

  rfqStore
    .InsertRFQResponse()
    .then((response) => {
      let status = Boolean(response.status === 'success') // Determine the status of the response
      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the RFQ ${status ? 'has been' : 'was not'} submitted.</p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })

      if (status) {
        // Update RFQ status
        const rfq = rfqs.value.find((r) => r.id === selectedRFQ.value.id)
        if (rfq) {
          rfq.status = 'Responded'
        }

        showResponseDialog.value = false
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
      responseLoadingState.value = false
    })
}
</script>

<style lang="scss" scoped>
.rfq-card {
  height: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}
</style>
