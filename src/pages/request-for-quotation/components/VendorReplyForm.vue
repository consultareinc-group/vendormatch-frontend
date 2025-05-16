<template>
  <div>
    <!-- Vendor Response Dialog -->
    <q-dialog class="rfq-reply" v-model="rfqStore.ShowVendorReplyFormDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Reply to Buyer</div>
          <div class="text-subtitle2" v-if="selectedRFQ">
            {{ selectedRFQ.productName }} - {{ selectedRFQ.id }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section> </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle2 q-mb-md">Your Reply</div>
          <q-form @submit="submitBuyerResponse" class="q-gutter-md">
            <q-input
              v-model="vendorResponseForm.message"
              type="textarea"
              label="Message to Buyer *"
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

const vendorResponseForm = ref({
  message: '',
})

const submitBuyerResponse = () => {
  submitting.value = true
  vendorResponseForm.value.rfq_response_id = rfqStore.RFQResponseDetails.id
  rfqStore
    .ReplyToRFQResponse(vendorResponseForm.value)
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
          (rfqStore.RFQResponseMessages[index].status = vendorResponseForm.value.status)

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
