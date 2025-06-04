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
          <div
            ref="chatContainer"
            class="q-pa-md full-width"
            style="border: 1px solid #dfdfdf; max-height: 400px; overflow-y: scroll"
          >
            <div v-if="messageLoadingState">
              <div>
                <q-skeleton width="100px" type="text" />
                <q-skeleton width="150px" height="50px" />
              </div>
              <div class="flex justify-end">
                <div>
                  <div class="flex justify-end"><q-skeleton width="100px" type="text" /></div>
                  <q-skeleton width="150px" height="50px" />
                </div>
              </div>
            </div>
            <div v-else>
              <div v-if="messages.length">
                <q-chat-message
                  v-for="message in messages"
                  :key="message"
                  :bg-color="message.sent_by == message.buyer_id ? 'accent' : 'grey-4'"
                  :name="
                    message.sent_by != message.buyer_id
                      ? message.enterprise_name
                      : message.buyer_id == authStore.UserInformation.id
                        ? 'You'
                        : message.buyer_name
                  "
                  :text="constructedMessage(message)"
                  :sent="message.sent_by == authStore.UserInformation.id"
                  :stamp="timeAgo(message.date_time)"
                />
              </div>
              <div v-else class="text-center text-grey">
                <q-icon name="chat" size="50px" />
                <div class="text-subtitle2">No messages yet</div>
              </div>
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
              lazy-rules
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
              lazy-rules
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
              lazy-rules
              outlined
              dense
            />

            <q-input
              v-model="buyerResponseForm.message"
              type="textarea"
              label="Message to Vendor *"
              :rules="[(val) => !!val || 'Please provide a message']"
              lazy-rules
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
import { ref, onMounted, watch, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'
import { useAuthStore } from 'src/stores/auth'

const rfqStore = useRFQStore()
const authStore = useAuthStore()
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

const messages = ref([]) // Store chat messages

const messageLoadingState = ref(false) // Track loading state for messages

const getMessages = () => {
  // Fetch messages from the store
  rfqStore
    .GetMessages(
      `offset=${messages.value.length}&rfq_response_id=${rfqStore.RFQResponseDetails.id}`,
    )
    .then((response) => {
      if (response.status == 'success') {
        // If fetch is successful
        messages.value.push(...response.data) // Add new messages to the list
      }

      if (response.data.length) {
        // If more messages exist, fetch again (pagination)
        getMessages()
      }

      scrollToBottom() // Scroll to the bottom of the chat
    })
    .finally(() => {
      messageLoadingState.value = false // Set loading state to false after fetch
    })
}
onMounted(() => {
  // When component is mounted
  messageLoadingState.value = true // Set loading state to true
  getMessages() // Start fetching messages
})

const constructedMessage = (message) => {
  if (message.counter_offer_price && message.counter_offer_quantity) {
    return [
      `Counter Offer Price: $${message.counter_offer_price}`,
      `Counter Offer Quantity: ${message.counter_offer_quantity}`,
      message.message,
    ]
  }
  return [message.message]
}

const chatContainer = ref(null) // Reference to chat container DOM element

const scrollToBottom = () => {
  // Scroll chat to bottom
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
// Watch for changes in messages and scroll to bottom when updated
watch(
  () => messages.value.length,
  async () => {
    await nextTick() // Wait for DOM update
    scrollToBottom() // Scroll chat to bottom
  },
  { deep: true },
)
const timeAgo = (timestamp) => {
  // Format timestamp as "time ago"
  const now = new Date()
  const past = new Date(timestamp)
  const diffInSeconds = Math.floor((now - past) / 1000)

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`
    }
  }
  return 'just now'
}

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
        position: 'top',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })

      if (status) {
        if (buyerResponseForm.value.status) {
          let index = rfqStore.RFQResponseMessages.findIndex(
            (response) => response.id === rfqStore.RFQResponseDetails.id,
          )
          index !== -1 &&
            (rfqStore.RFQResponseMessages[index].status = buyerResponseForm.value.status)
        }

        messages.value.push({
          message: buyerResponseForm.value.message, // Add new message to chat
          sent_by: authStore.UserInformation.id, // Set sender ID
          buyer_id: rfqStore.RFQResponseDetails.buyer_id, // Set buyer ID
          date_time: new Date().toISOString(), // Set current timestamp
          buyer_name: `${authStore.UserInformation.first_name} ${authStore.UserInformation.last_name}`, // Set sender's name
          enterprise_name: '',
        })

        buyerResponseForm.value = {
          status: '',
          counter_offer_price: null,
          counter_offer_quantity: null,
          message: '',
        }
      }
    })
    .finally(() => {
      submitting.value = false
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
