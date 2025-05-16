<template>
  <div>
    <!-- Buyer Response Dialog -->
    <q-dialog class="rfq-reply" v-model="rfqStore.ShowBuyerReplyFormDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Reply to Vendor Response</div>
          <div class="text-subtitle2" v-if="selectedRFQ">
            {{ selectedRFQ.productName }} - {{ selectedRFQ.id }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle2 q-mb-md">Vendor's Response</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Quoted Price</q-item-label>
                    <q-item-label
                      >${{ rfqStore.RFQResponseDetails?.quoted_price }} per unit</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Minimum Order Quantity</q-item-label>
                    <q-item-label
                      >{{ rfqStore.RFQResponseDetails?.minimum_order_quantity }} units</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Lead Time</q-item-label>
                    <q-item-label
                      >{{ rfqStore.RFQResponseDetails?.lead_time_days }} days</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12 col-md-6">
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Payment Terms</q-item-label>
                    <q-item-label>{{ rfqStore.RFQResponseDetails?.payment_terms }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Shipping Terms</q-item-label>
                    <q-item-label>{{ rfqStore.RFQResponseDetails?.shipping_terms }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Status</q-item-label>
                    <q-item-label
                      ><q-chip
                        :color="
                          rfqStore.RFQResponseDetails?.status === 'Pending'
                            ? 'warning'
                            : rfqStore.RFQResponseDetails?.status === 'Accepted'
                              ? 'positive'
                              : rfqStore.RFQResponseDetails?.status === 'Declined'
                                ? 'negative'
                                : 'primary'
                        "
                        text-color="white"
                        size="sm"
                        class="q-ma-none"
                      >
                        {{ rfqStore.RFQResponseDetails?.status }}
                      </q-chip></q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12">
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Notes</q-item-label>
                    <q-item-label>{{ rfqStore.RFQResponseDetails?.additional_notes }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle2 q-mb-md">Your Reply</div>
          <q-form @submit="submitBuyerResponse" class="q-gutter-md">
            <q-select
              v-model="buyerResponseForm.status"
              :options="statusOptions"
              :label="`Decision ${rfqStore.RFQResponseDetails?.status === 'Pending' ? '*' : ''}`"
              :rules="
                rfqStore.RFQResponseDetails?.status === 'Pending'
                  ? [(val) => !!val || 'Please select a decision']
                  : []
              "
              emit-value
              map-options
              option-label="label"
              option-value="value"
              outlined
              dense
            />

            <q-input
              v-if="buyerResponseForm.status === 'Counter Offer'"
              v-model.number="buyerResponseForm.counter_offer_price"
              type="number"
              label="Counter Offer Price per Unit *"
              prefix="$"
              :rules="[
                (val) => !!val || 'Price is required',
                (val) => val > 0 || 'Price must be greater than 0',
              ]"
              outlined
              dense
            />

            <q-input
              v-if="buyerResponseForm.status === 'Counter Offer'"
              v-model.number="buyerResponseForm.counter_offer_quantity"
              type="number"
              label="Counter Offer Quantity *"
              :rules="[
                (val) => !!val || 'Quantity is required',
                (val) => val > 0 || 'Quantity must be greater than 0',
              ]"
              outlined
              dense
            />

            <q-input
              v-model="buyerResponseForm.message"
              type="textarea"
              label="Message to Vendor *"
              :rules="[(val) => !!val || 'Please provide a message']"
              outlined
              dense
              autogrow
            />

            <div class="row justify-end q-mt-md">
              <q-btn no-caps flat label="Cancel" color="negative" v-close-popup class="q-mr-sm" />
              <q-btn
                no-caps
                type="submit"
                label="Send Reply"
                color="primary"
                :loading="submitting"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'

const rfqStore = useRFQStore()
const $q = useQuasar()

const submitting = ref(false)
const selectedRFQ = ref(null)

const buyerResponseForm = ref({
  status: '',
  counter_offer_price: null,
  counter_offer_quantity: null,
  message: '',
})

const statusOptions = [
  { label: 'Accept', value: 'Accepted' },
  { label: 'Decline', value: 'Declined' },
  { label: 'Counter Offer', value: 'Counter Offer' },
]

const submitBuyerResponse = () => {
  submitting.value = true
  buyerResponseForm.value.rfq_response_id = rfqStore.RFQResponseDetails.id
  rfqStore
    .ReplyToRFQResponse(buyerResponseForm.value)
    .then((response) => {
      let status = Boolean(response.status === 'success')
      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> your reply ${status ? 'has been' : 'was not'} sent.</p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })

      if (status) {
        let index = rfqStore.RFQResponseMessages.findIndex(
          (response) => response.id === rfqStore.RFQResponseDetails.id,
        )
        index !== -1 &&
          (rfqStore.RFQResponseMessages[index].status = buyerResponseForm.value.status)

        console.log('rfqStore.RFQResponseMessages ', rfqStore.RFQResponseMessages)
        console.log('index ', index)
      }
    })
    .finally(() => {
      submitting.value = false
      rfqStore.ShowBuyerReplyFormDialog = false
    })
}
</script>

<style lang="scss">
.rfq-reply {
  .q-textarea.q-field--dense.q-field--labeled .q-field__native {
    min-height: 100px;
  }
}
</style>
