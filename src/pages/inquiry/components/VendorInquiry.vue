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
                  :options="statusOptions"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
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
                  v-model="filter.product"
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
    <ViewProductDetails v-if="triggerStore.ViewProductDetailsDialog" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { date } from 'quasar'
import { useMessageStore } from 'src/stores/chat'
import { useBuyerStore } from 'src/stores/buyer'
import { useProductStore } from 'src/stores/products'
import { useAuthStore } from 'src/stores/auth'
import { useTriggerStore } from 'src/stores/triggers' // Import trigger store for managing UI triggers

// Import component for viewing product details
import ViewProductDetails from '../../../components/ViewProductDetails.vue'

const $q = useQuasar()
const messageStore = useMessageStore()
const buyerStore = useBuyerStore()
const productStore = useProductStore()
const authStore = useAuthStore()
const triggerStore = useTriggerStore()

const filter = ref({
  status: 3,
  buyer: 0,
  product: 0,
})

const statusOptions = [
  {
    id: 3,
    name: 'All',
  },
  {
    id: 0,
    name: 'Unread',
  },
  {
    id: 1,
    name: 'Read',
  },
]

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
const inquiries = ref(messageStore.Messages)

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
  if (authStore.UserInformation.role == 0) {
    triggerStore.HideChatSection = false
  }
})

const openChat = (inquiry) => {
  productStore.ProductDetails.id = inquiry.product_id
  productStore.ProductDetails.buyer_id = inquiry.buyer_id
  triggerStore.ViewProductDetailsDialog = true // Open the product details dialog
}

const searchMessage = () => {
  messageStore
    .SearchMessages(
      `offset=${inquiries.value.length}&status=${filter.value.status}&buyer=${filter.value.buyer}&product=${filter.value.product}`,
    )
    .then((response) => {
      if (response.status === 'success') {
        response.data.forEach((data) => {
          // Avoid redundant record
          let index = inquiries.value.findIndex((message) => message.id === data.id)
          index === -1 && inquiries.value.push(data)
        })

        if (response.data.length) {
          searchMessage() // Continue fetching if more data is available
        }
      }
    })
    .finally(() => {
      inquiryTableLoadingState.value = false
    })
}
const applyFilters = () => {
  inquiryTableLoadingState.value = true
  inquiries.value = []
  searchMessage()
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
      `keyword=${val}&enterprise_id=${authStore.UserInformation.enterprise_id}`,
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
