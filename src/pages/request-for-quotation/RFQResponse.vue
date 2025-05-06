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
                  :options="['All', 'Pending', 'Responded', 'Closed']"
                  label="Status"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filter.category"
                  :options="['All', ...categories]"
                  label="Category"
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

      <!-- RFQ List -->
      <div class="col-12">
        <q-card>
          <q-card-section class="row items-center">
            <div class="text-h6">RFQ Responses</div>
          </q-card-section>

          <q-table
            :rows="rfq_responses"
            :columns="columns"
            row-key="id"
            :loading="rfqLoadingState"
            :pagination="pagination"
            color="primary"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip :color="getStatusColor(props.value)" text-color="white" size="sm">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-date_time_added="props">
              <q-td :props="props">
                {{ formatDate(props.value) }}
              </q-td>
            </template>

            <template v-slot:body-cell-time="props">
              <q-td :props="props">
                {{ formatTime(props.value) }}
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn-group flat>
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="visibility"
                    @click="viewRFQDetails(props.row)"
                  >
                    <q-tooltip>View Details</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="props.row.status === 'Pending'"
                    flat
                    round
                    color="positive"
                    icon="chat"
                    @click="respondToRFQ(props.row)"
                  >
                    <q-tooltip>Respond</q-tooltip>
                  </q-btn>
                </q-btn-group>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>

    <!-- RFQ Details Dialog -->
    <q-dialog v-model="showDetailsDialog" full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6">RFQ Details</div>
        </q-card-section>

        <q-card-section v-if="selectedRFQ">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Product Name</q-item-label>
                    <q-item-label>{{ selectedRFQ.product_name }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Category</q-item-label>
                    <q-item-label>{{ selectedRFQ.category }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Quantity</q-item-label>
                    <q-item-label>{{ selectedRFQ.quantity }} {{ selectedRFQ.unit }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-12 col-md-6">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Target Price</q-item-label>
                    <q-item-label>${{ selectedRFQ.target_price }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Delivery Location</q-item-label>
                    <q-item-label>{{ selectedRFQ.delivery_location }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Delivery Date</q-item-label>
                    <q-item-label>{{
                      formatDate(selectedRFQ.required_delivery_date)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-12">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Specifications</q-item-label>
                    <q-item-label>{{ selectedRFQ.specifications }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Required Certifications</q-item-label>
                    <div class="q-gutter-xs">
                      <q-chip
                        v-for="cert in selectedRFQ.required_certifications"
                        :key="cert"
                        size="sm"
                      >
                        {{ cert }}
                      </q-chip>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Packaging Requirements</q-item-label>
                    <div class="q-gutter-xs">
                      <q-chip
                        v-for="pkg in selectedRFQ.packaging_requirements"
                        :key="pkg"
                        size="sm"
                      >
                        {{ pkg }}
                      </q-chip>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Additional Notes</q-item-label>
                    <q-item-label>{{ selectedRFQ.additional_notes }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
          <q-btn
            v-if="selectedRFQ?.status === 'Pending'"
            color="primary"
            label="Respond"
            @click="respondToRFQ(selectedRFQ)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
// import { useRouter } from 'vue-router'
import { date } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'

const $q = useQuasar()
// const router = useRouter()
const rfqStore = useRFQStore()

const showDetailsDialog = ref(false)
const selectedRFQ = ref(null)

const pagination = ref({
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 10,
})

const filter = ref({
  status: 'All',
  category: 'All',
  search: '',
})

const categories = ['Food & Beverage', 'Health & Beauty', 'Home & Garden', 'Electronics', 'Apparel']

const columns = [
  {
    name: 'product_name',
    label: 'Product Name',
    field: 'product_name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'category',
    label: 'Category',
    field: 'category',
    sortable: true,
    align: 'left',
  },
  {
    name: 'quantity',
    label: 'Quantity',
    field: 'quantity',
    sortable: true,
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
    align: 'left',
  },
  {
    name: 'date_time_added',
    label: 'Date',
    field: 'date_time_added',
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

// Sample data - replace with actual API data
const rfq_responses = ref(rfqStore.RFQResponses)

const rfqLoadingState = ref(false)

// const getRFQs = () => {
//   rfqLoadingState.value = true
//   if (rfqStore.RFQResponses.length) {
//     rfqLoadingState.value = false
//   }

//   rfqStore
//     .GetRFQs(`offset=${rfq_responses.value.length}`)
//     .then((response) => {
//       if (response.status === 'success') {
//         rfqStore.RFQResponses.push(...response.data)
//       }
//     })
//     .finally(() => {
//       rfqLoadingState.value = false
//     })
// }

onMounted(() => {
  // if (!rfqStore.RFQResponses.length) {
  //   getRFQs()
  // }
})

const getStatusColor = (status) => {
  const colors = {
    Pending: 'warning',
    Responded: 'info',
    Closed: 'positive',
  }
  return colors[status] || 'grey'
}

const formatDate = (dateStr) => {
  return date.formatDate(dateStr, 'MMMM D, YYYY hh:mm A')
}

const searchRFQs = () => {
  rfqStore
    .SearchRFQs(
      `offset=${rfq_responses.value.length}&search_keyword=${filter.value.search}&status=${filter.value.status}&category=${encodeURIComponent(filter.value.category)}`,
    )
    .then((response) => {
      if (response.status === 'success') {
        rfq_responses.value.push(...response.data)

        if (response.data.length) {
          searchRFQs()
        }
      }
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: error.message,
      })
    })
    .finally(() => {
      rfqLoadingState.value = false
    })
}

const applyFilters = () => {
  rfq_responses.value = []
  rfqLoadingState.value = true
  searchRFQs()
}

const viewRFQDetails = (rfq) => {
  selectedRFQ.value = rfq
  showDetailsDialog.value = true
}

const respondToRFQ = (rfq) => {
  $q.notify({
    type: 'info',
    message: `Opening response form for RFQ ${rfq.id}`,
  })
}
</script>

<style lang="scss" scoped>
.q-table__card {
  box-shadow: none;
}
</style>
