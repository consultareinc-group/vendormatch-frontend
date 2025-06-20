<template>
  <div>
    <!-- RFQ Details Dialog -->
    <q-dialog v-model="rfqStore.ShowRFQDetailsDialog" full-width>
      <q-card>
        <q-card-section id="rfq-details-content">
          <q-card-section>
            <div class="flex justify-between items-center">
              <div class="text-h6">RFQ Details</div>
              <q-btn
                dense
                class="q-px-md"
                icon="download"
                label="Download PDF"
                no-caps
                @click="downloadPDF()"
                :loading="downloadLoadingState"
              />
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Product Name</q-item-label>
                      <q-item-label>{{ rfqStore.RFQDetails.product_name }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Category</q-item-label>
                      <q-item-label>{{ rfqStore.RFQDetails.category }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Quantity</q-item-label>
                      <q-item-label
                        >{{ rfqStore.RFQDetails.quantity }}
                        {{ rfqStore.RFQDetails.unit }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div class="col-12 col-md-4">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Target Price</q-item-label>
                      <q-item-label>${{ rfqStore.RFQDetails.target_price }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Delivery Location</q-item-label>
                      <q-item-label>{{ rfqStore.RFQDetails.delivery_location }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Delivery Date</q-item-label>
                      <q-item-label>{{
                        formatDate(rfqStore.RFQDetails.required_delivery_date)
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
                      <q-item-label>{{ rfqStore.RFQDetails.specifications }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label overline>Required Certifications</q-item-label>
                      <div class="q-gutter-xs">
                        <div v-if="rfqStore.RFQDetails.required_certifications">
                          <q-chip
                            v-for="cert in rfqStore.RFQDetails.required_certifications
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
                        <div v-if="rfqStore.RFQDetails.packaging_requirements">
                          <q-chip
                            v-for="pkg in rfqStore.RFQDetails.packaging_requirements
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
                      <q-item-label>{{ rfqStore.RFQDetails.additional_notes }}</q-item-label>
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
            <q-table
              color="primary"
              :rows="rfqStore.RFQResponseMessages"
              :columns="columns"
              :loading="rfqResponsesLoadingState"
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="
                      props.value === 'Pending'
                        ? 'warning'
                        : props.value === 'Accepted'
                          ? 'positive'
                          : props.value === 'Declined'
                            ? 'negative'
                            : 'primary'
                    "
                    text-color="white"
                    size="sm"
                  >
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn-group flat>
                    <q-btn
                      v-if="
                        authStore.UserInformation.id == props.row.vendor_id ||
                        authStore.UserInformation.role == 1 ||
                        authStore.UserInformation.role == 2
                      "
                      flat
                      round
                      color="positive"
                      icon="chat"
                      @click="showReplyForm(props.row)"
                    >
                      <q-tooltip>Respond</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="negative" v-close-popup no-caps />
          <q-btn
            v-if="
              route.name === 'request-for-quotation-cards' && authStore.UserInformation.role === 0
            "
            color="primary"
            icon="chat"
            label="Respond"
            no-caps
            @click="respondToRFQ()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <BuyerReplyForm v-if="rfqStore.ShowBuyerReplyFormDialog" />
    <VendorReplyForm v-if="rfqStore.ShowVendorReplyFormDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'
import { useHelperStore } from 'src/stores/helper'
import { useAuthStore } from 'src/stores/auth'
import { useRoute } from 'vue-router'
import html2pdf from 'html2pdf.js'

import BuyerReplyForm from './BuyerReplyForm.vue'
import VendorReplyForm from './VendorReplyForm.vue'

const rfqStore = useRFQStore()
const authStore = useAuthStore()
const route = useRoute()
const helperStore = useHelperStore()

const rfqResponsesLoadingState = ref(false)
const columns = [
  {
    name: 'quoted_price',
    label: 'Quoted Price',
    field: 'quoted_price',
    format: (val) => `$${val}`,
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
    name: 'lead_time_days',
    label: 'Lead Time Days',
    field: 'lead_time_days',
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
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
  },
  {
    name: 'additional_notes',
    label: 'Additional Notes',
    field: 'additional_notes',
    sortable: true,
    align: 'left',
  },
  { name: 'actions', label: 'Actions', field: 'actions' },
]

const getRFQResponses = () => {
  rfqStore
    .GetRFQResponses(
      `id=${rfqStore.RFQDetails.request_for_quotation_id ?? rfqStore.RFQDetails.id}&offset=${rfqStore.RFQResponseMessages.length}`,
    )
    .then((response) => {
      if (response.status === 'success') {
        rfqStore.RFQResponseMessages.push(...response.data)

        if (response.data.length) {
          getRFQResponses()
        }
      }
    })
    .finally(() => {
      rfqResponsesLoadingState.value = false
    })
}

const formatDate = (dateStr) => {
  return date.formatDate(dateStr, 'MMMM D, YYYY')
}

const attachment = ref({ attachment_name: '' })
const attachmentLoadingState = ref(false)

onMounted(() => {
  attachmentLoadingState.value = true
  attachment.value = { attachment_name: '' }
  rfqStore
    .GetRFQAttachment(`id=${rfqStore.RFQDetails.id}&attachment=true`)
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

  rfqResponsesLoadingState.value = true
  rfqStore.RFQResponseMessages = []
  getRFQResponses()
})

const respondToRFQ = () => {
  rfqStore.ShowRFQRespondDialog = true
}

const downloadLoadingState = ref(false)
const downloadPDF = () => {
  downloadLoadingState.value = true
  const element = document.getElementById('rfq-details-content')
  const elementsToHide = document.querySelectorAll('.no-print')
  // Hide elements before generating PDF
  elementsToHide.forEach((el) => (el.style.display = 'none'))

  html2pdf()
    .set({
      margin: 10,
      filename: `${rfqStore.RFQDetails.product_name} - ${rfqStore.RFQDetails.category} - ${rfqStore.RFQDetails.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    })
    .from(element)
    .save()
    .then(() => {
      // Restore hidden elements after PDF generation
      elementsToHide.forEach((el) => (el.style.display = ''))
      downloadLoadingState.value = false
    })
}

const showReplyForm = (response) => {
  rfqStore.RFQResponseDetails = response
  const role = authStore.UserInformation.role
  if (role == 1 || (role != 2 && role != 0)) {
    rfqStore.ShowBuyerReplyFormDialog = true
  } else if (route.name === 'rfq-responses') {
    rfqStore.ShowVendorReplyFormDialog = true
  } else {
    rfqStore.ShowBuyerReplyFormDialog = true
  }
}
</script>
