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
                :text="[message.message]"
                :sent="message.sent_by == authStore.UserInformation.id"
                :stamp="timeAgo(message.date_time_added)"
              />
            </div>
          </div>
        </q-card-section>

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
import { ref, watch, nextTick, onMounted } from 'vue' // Import Vue composition API functions
import { useQuasar } from 'quasar' // Import Quasar composable for UI utilities
import { useRFQStore } from 'src/stores/rfq' // Import RFQ store
import { useAuthStore } from 'src/stores/auth' // Import Auth store

const rfqStore = useRFQStore() // Initialize RFQ store
const authStore = useAuthStore() // Initialize Auth store
const $q = useQuasar() // Initialize Quasar utilities

const submitting = ref(false) // Track form submission state
const selectedRFQ = ref(null) // Store selected RFQ details

const vendorResponseForm = ref({
  message: '', // Message input for vendor's reply
})

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

const submitBuyerResponse = () => {
  // Handle reply form submission
  submitting.value = true // Set submitting state to true
  vendorResponseForm.value.rfq_response_id = rfqStore.RFQResponseDetails.id // Attach RFQ response ID to form
  rfqStore
    .ReplyToRFQResponse(vendorResponseForm.value) // Send reply to store
    .then((response) => {
      let status = Boolean(response.status == 'success') // Check if reply was successful
      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> your reply ${status ? 'has been' : 'was not'} sent.</p>`,
        color: `${status ? 'green' : 'red'}-2`, // Set notification color
        position: 'top-right', // Notification position
        textColor: `${status ? 'green' : 'red'}`, // Notification text color
        html: true, // Enable HTML in notification
      })

      if (status) {
        // If reply was successful
        let index = rfqStore.RFQResponseMessages.findIndex(
          (response) => response.id == rfqStore.RFQResponseDetails.id,
        )
        index != -1 &&
          (rfqStore.RFQResponseMessages[index].status = vendorResponseForm.value.status) // Update message status in store
      }
    })
    .finally(() => {
      submitting.value = false // Reset submitting state
      rfqStore.ShowBuyerReplyFormDialog = false // Close reply dialog
    })
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
  messages,
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
</script>

<style lang="scss">
.rfq-reply {
  .q-textarea.q-field--dense.q-field--labeled .q-field__native {
    min-height: 100px;
  }
}
</style>
