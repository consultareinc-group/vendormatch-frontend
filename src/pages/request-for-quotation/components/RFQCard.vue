<template>
  <!-- RFQ Cards Grid -->
  <div class="col-12">
    <div v-if="rfqStore.RFQCardLoading" class="row q-col-gutter-md">
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
      <div v-for="rfq in rfqStore.RFQs" :key="rfq.id" class="col-12 col-sm-6 col-md-4">
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
                  v-for="cert in rfq.required_certifications.split(', ').map((item) => item.trim())"
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
            <q-btn color="primary" icon="chat" label="Respond" no-caps @click="respondToRFQ(rfq)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
  <div
    v-if="!rfqStore.RFQSearchResults.length && rfqStore.RFQSearching"
    class="text-center q-mt-xl full-width"
  >
    No Results Found!
  </div>
  <div v-if="rfqStore.RFQs.length > 100" class="flex justify-center full-width q-my-md">
    <q-btn
      @click="getRFQs()"
      label="View More"
      class="bg-white"
      no-caps
      :loading="viewMoreLoadingState"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'

const rfqStore = useRFQStore()

const viewMoreLoadingState = ref(false)
const getRFQs = () => {
  rfqStore.RFQCardLoading = true
  if (rfqStore.RFQs.length) {
    rfqStore.RFQCardLoading = false
  }
  viewMoreLoadingState.value = true
  rfqStore
    .GetRFQs(`offset=${rfqStore.RFQs.length}&is_not_closed=true`)
    .then((response) => {
      if (response.status === 'success') {
        rfqStore.RFQs.push(...response.data)
      }
    })
    .finally(() => {
      rfqStore.RFQCardLoading = false
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

const viewRFQDetails = (rfq) => {
  rfqStore.RFQDetails = rfq
  rfqStore.ShowRFQDetailsDialog = true
}

const respondToRFQ = (rfq) => {
  rfqStore.RFQDetails = rfq
  rfqStore.ShowRFQRespondDialog = true
  // Reset form
  // responseForm.value = {
  //   quotedPrice: null,
  //   minQuantity: null,
  //   leadTime: null,
  //   paymentTerms: null,
  //   shippingTerms: '',
  //   additionalNotes: '',
  //   canMeetSpecs: false,
  // }
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
