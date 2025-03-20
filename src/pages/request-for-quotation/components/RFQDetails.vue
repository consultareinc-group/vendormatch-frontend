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
            <q-table color="primary" :rows="rfq_responses" :columns="columns" />
          </q-card-section>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="negative" v-close-popup no-caps />
          <q-btn
            v-if="route.name === 'request-for-quotation-cards'"
            color="primary"
            icon="chat"
            label="Respond"
            no-caps
            @click="respondToRFQ()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'
import { useHelperStore } from 'src/stores/helper'
import { useRoute } from 'vue-router'
import html2pdf from 'html2pdf.js'

const rfqStore = useRFQStore()
const route = useRoute()
const helperStore = useHelperStore()

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
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(element)
    .save()
    .then(() => {
      // Restore hidden elements after PDF generation
      elementsToHide.forEach((el) => (el.style.display = ''))
      downloadLoadingState.value = false
    })
}
  
</script>
