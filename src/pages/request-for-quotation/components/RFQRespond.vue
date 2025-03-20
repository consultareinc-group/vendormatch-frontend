<template>
  <div>
    <!-- Response Form Dialog -->
    <q-dialog
      v-model="rfqStore.ShowRFQRespondDialog"
      persistent
      :position="rfqStore.ShowRFQDetailsDialog ? 'right' : 'standard'"
      :allow-focus-outside="rfqStore.ShowRFQDetailsDialog"
      :no-shake="rfqStore.ShowRFQDetailsDialog"
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Respond to RFQ</div>
          <div class="text-subtitle2" v-if="rfqStore.RFQDetails">
            {{ rfqStore.RFQDetails.product_name }} - {{ rfqStore.RFQDetails.id }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitResponse" class="q-gutter-md">
            <q-input
              v-model.number="form.quotedPrice"
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
              v-model.number="form.minQuantity"
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
              v-model="form.leadTime"
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
              v-model="form.paymentTerms"
              :options="paymentTermsOptions"
              label="Payment Terms *"
              :rules="[(val) => !!val || 'Payment terms are required']"
              outlined
              dense
            />

            <q-input
              v-model="form.shippingTerms"
              label="Shipping Terms *"
              :rules="[(val) => !!val || 'Shipping terms are required']"
              outlined
              dense
            />

            <q-input
              class="additional-notes"
              v-model="form.additionalNotes"
              type="textarea"
              label="Additional Notes"
              outlined
              dense
              autogrow
            />

            <q-toggle
              v-model="form.canMeetSpecs"
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'

const $q = useQuasar()
const rfqStore = useRFQStore()

const form = ref({
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

const responseLoadingState = ref(false)
const submitResponse = async () => {
  if (!form.value.canMeetSpecs) {
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
        const rfq = rfqStore.RFQs.find((r) => r.id === rfqStore.RFQDetails.id)
        if (rfq) {
          rfq.status = 'Responded'
        }

        rfqStore.ShowRFQRespondDialog = false
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
