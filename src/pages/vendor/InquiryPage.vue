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
                  use-input
                  :options="buyerOptions"
                  @filter="filterBuyer"
                  label="Buyer"
                  outlined
                  clearable
                  option-label="full_name"
                  option-value="id"
                  emit-value
                  map-options
                  input-debounce="1000"
                  :loading="searchBuyerLoadingState"
                  dense
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey"> No results </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filter.search"
                  use-input
                  :options="productOptions"
                  @filter="filterProduct"
                  label="Product"
                  outlined
                  clearable
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  input-debounce="1000"
                  :loading="searchProductLoadingState"
                  dense
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey"> No results </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-3 flex justify-end">
                <q-btn
                  color="primary"
                  icon="filter_list"
                  label="Filter"
                  class="full-"
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
import { useBuyerStore } from 'src/stores/buyer'
import { useProductStore } from 'src/stores/products'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const messageStore = useMessageStore()
const buyerStore = useBuyerStore()
const productStore = useProductStore()
const authStore = useAuthStore()

const filter = ref({
  status: 'All',
  buyer: 0,
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
          // Avoid redundant record
          let index = messageStore.Messages.findIndex((message) => message.id === data.id)
          index === -1 && messageStore.Messages.push(data)
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
const buyerOptions = ref([{ id: 0, full_name: 'All' }])
const searchBuyerLoadingState = ref(false)

const fetchBuyers = async (val, update) => {
  searchBuyerLoadingState.value = true
  try {
    const response = await buyerStore.SearchBuyer(`keyword=${val}`)
    if (response.status === 'success') {
      // Use a Set to avoid duplicate buyer entries
      const existingIds = new Set(buyerStore.Buyers.map((buyer) => buyer.id))
      response.data.forEach((buyer) => {
        if (!existingIds.has(buyer.id)) {
          buyerStore.Buyers.push(buyer)
        }
      })

      update(() => {
        buyerOptions.value = [{ id: 0, full_name: 'All' }, ...buyerStore.Buyers]
      })
    }
  } finally {
    searchBuyerLoadingState.value = false
  }
}

const filterBuyer = (val, update) => {
  if (!val) {
    update(() => (buyerOptions.value = [{ id: 0, full_name: 'All' }, ...buyerStore.Buyers]))
    return
  }

  update(() => {
    buyerOptions.value = buyerStore.Buyers.filter((buyer) =>
      buyer.full_name.toLowerCase().includes(val.toLowerCase()),
    )
  })

  if (!buyerOptions.value.length) {
    buyerStore.Buyers = [] // Clear old data before fetching
    fetchBuyers(val, update)
  }
}

const productOptions = ref([{ id: 0, name: 'All' }])
const searchProductLoadingState = ref(false)

const fetchProducts = async (val, update) => {
  searchProductLoadingState.value = true
  try {
    const response = await productStore.SearchProducts(
      `keyword=${val}&enterprise_id=${authStore.UserInformation.enterpise_id}`,
    )
    if (response.status === 'success') {
      // Use a Set to avoid duplicate buyer entries
      const existingIds = new Set(productStore.SearchedInquiryProducts.map((buyer) => buyer.id))
      response.data.forEach((buyer) => {
        if (!existingIds.has(buyer.id)) {
          productStore.SearchedInquiryProducts.push(buyer)
        }
      })

      update(() => {
        productOptions.value = [{ id: 0, name: 'All' }, ...productStore.SearchedInquiryProducts]
      })
    }
  } finally {
    searchProductLoadingState.value = false
  }
}

const filterProduct = (val, update) => {
  if (!val) {
    update(
      () =>
        (productOptions.value = [{ id: 0, name: 'All' }, ...productStore.SearchedInquiryProducts]),
    )
    return
  }

  update(() => {
    productOptions.value = productStore.SearchedInquiryProducts.filter((buyer) =>
      buyer.name.toLowerCase().includes(val.toLowerCase()),
    )
  })

  if (!productOptions.value.length) {
    productStore.SearchedInquiryProducts = [] // Clear old data before fetching
    fetchProducts(val, update)
  }
}
</script>

<style lang="scss" scoped>
.q-table__card {
  box-shadow: none;
}
</style>
