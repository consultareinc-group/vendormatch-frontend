<template>
  <div>
    <!-- Buyer Response Dialog -->
    <q-dialog class="rfq-reply" v-model="rfqStore.ShowRFQReplyDialog" persistent>
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

                <q-item>
                  <q-item-section>
                    <q-item-label caption>Notes</q-item-label>
                    <q-item-label>{{ rfqStore.RFQResponseDetails?.additional_notes }}</q-item-label>
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
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle2 q-mb-md">Your Reply</div>
          <q-form @submit="submitBuyerResponse" class="q-gutter-md">
            <q-select
              v-model="buyerResponseForm.decision"
              :options="decisionOptions"
              label="Decision *"
              :rules="[(val) => !!val || 'Please select a decision']"
              outlined
              dense
            />

            <q-input
              v-if="buyerResponseForm.decision === 'Counter Offer'"
              v-model.number="buyerResponseForm.counterOfferPrice"
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
              v-if="buyerResponseForm.decision === 'Counter Offer'"
              v-model.number="buyerResponseForm.counterOfferQuantity"
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
// import { useQuasar } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'

const rfqStore = useRFQStore()
// const $q = useQuasar()

const submitting = ref(false)
const selectedRFQ = ref(null)

const buyerResponseForm = ref({
  decision: null,
  counterOfferPrice: null,
  counterOfferQuantity: null,
  message: '',
})

const decisionOptions = ['Accept', 'Decline', 'Counter Offer']

const submitBuyerResponse = () => {}
</script>

<style lang="scss">
.rfq-reply {
  .q-textarea.q-field--dense.q-field--labeled .q-field__native {
    min-height: 100px;
  }
}
</style>
