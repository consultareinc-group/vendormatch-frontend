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
                  :options="['All', 'Unread', 'Read']"
                  label="Status"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filter.buyer"
                  :options="['All', 'John Doe', 'Jane Smith', 'Bob Wilson']"
                  label="Buyer"
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

      <!-- Inquiries Table -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Inquiries</div>
          </q-card-section>

          <q-table
            :rows="inquiries"
            :columns="columns"
            row-key="id"
            :loading="inquiryTableLoadingState"
            color="primary"
          >
            <template v-slot:body-cell-is_read="props">
              <q-td :props="props">
                <q-chip
                  :color="!props.value ? 'negative' : 'positive'"
                  text-color="white"
                  size="sm"
                >
                  {{ !props.value ? 'Unread' : 'Read' }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn flat round color="primary" icon="chat" @click="openChat(props.row)">
                  <q-tooltip>Open Chat</q-tooltip>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { date } from 'quasar'
import { useMessageStore } from 'src/stores/chat'

const $q = useQuasar()
const messageStore = useMessageStore()

const filter = ref({
  status: 'All',
  buyer: 'All',
  search: '',
})

const columns = [
  {
    name: 'buyer',
    label: 'Buyer',
    field: (row) =>
      `${row.first_name}  ${row.middle_name ?? ''} ${row.last_name} ${row.suffix_name ?? ''}`,
    sortable: true,
    align: 'left',
  },
  {
    name: 'product_name',
    label: 'Product Name',
    field: 'product_name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'is_read',
    label: 'Status',
    field: 'is_read',
    sortable: true,
    align: 'left',
  },
  {
    name: 'date_time',
    label: 'Date',
    field: (row) => date.formatDate(row.date_time, 'MMMM D, YYYY h:mm A'),
    sortable: true,
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  },
]

const inquiryTableLoadingState = ref(false)
const inquiries = computed(() => {
  if (messageStore.SearchedMessages.length) {
    return messageStore.SearchedMessages
  } else {
    return messageStore.Messages
  }
})

const getMessages = () => {
  inquiryTableLoadingState.value = true
  if (messageStore.Messages.length) {
    inquiryTableLoadingState.value = false
  }
  messageStore
    .GetMessages(`offset=${messageStore.Messages.length}`)
    .then((response) => {
      if (response.status === 'success') {
        response.data.forEach((data) => {
          messageStore.Messages.push(data)
        })

        if (response.data.length) {
          getMessages() // Continue fetching if more data is available
        }
      }
    })
    .catch((error) => {
      // Show a notification based on the response status
      $q.notify({
        message: `<p class='q-mb-none'>${error.message}</p>`,
        color: `red-2`, // Set notification color
        position: 'top-right', // Notification position
        textColor: `red`, // Set text color
        html: true, // Enable HTML content
      })
    })
    .finally(() => {
      inquiryTableLoadingState.value = false
    })
}

onMounted(() => {
  getMessages()
})

const openChat = (inquiry) => {
  $q.notify({
    message: `Opening chat with ${inquiry.buyer} about ${inquiry.productName}`,
    color: 'info',
  })
}

const applyFilters = () => {
  inquiryTableLoadingState.value = true
  // Simulate API call with filters
  setTimeout(() => {
    inquiryTableLoadingState.value = false
  }, 1000)
}
</script>

<style lang="scss" scoped>
.q-table__card {
  box-shadow: none;
}
</style>
