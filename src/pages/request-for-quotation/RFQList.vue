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
            <div class="text-h6">RFQ Requests</div>
            <q-space />
            <q-btn
              color="primary"
              icon="add"
              label="Create RFQ"
              @click="router.push('/request-for-quotation')"
            />
          </q-card-section>

          <q-table
            :rows="filteredRFQs"
            :columns="columns"
            row-key="id"
            :loading="loading"
            :pagination="pagination"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip :color="getStatusColor(props.value)" text-color="white" size="sm">
                  {{ props.value }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-date="props">
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
                    <q-item-label>{{ selectedRFQ.productName }}</q-item-label>
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
                    <q-item-label>${{ selectedRFQ.targetPrice }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Delivery Location</q-item-label>
                    <q-item-label>{{ selectedRFQ.deliveryLocation }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Delivery Date</q-item-label>
                    <q-item-label>{{ formatDate(selectedRFQ.deliveryDate) }}</q-item-label>
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
                      <q-chip v-for="cert in selectedRFQ.certifications" :key="cert" size="sm">
                        {{ cert }}
                      </q-chip>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Packaging Requirements</q-item-label>
                    <div class="q-gutter-xs">
                      <q-chip v-for="pkg in selectedRFQ.packaging" :key="pkg" size="sm">
                        {{ pkg }}
                      </q-chip>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Additional Notes</q-item-label>
                    <q-item-label>{{ selectedRFQ.notes }}</q-item-label>
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { date } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const loading = ref(false)
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
    name: 'id',
    label: 'RFQ ID',
    field: 'id',
    sortable: true,
    align: 'left',
  },
  {
    name: 'productName',
    label: 'Product Name',
    field: 'productName',
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
    field: (row) => `${row.quantity} ${row.unit}`,
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
    name: 'date',
    label: 'Date',
    field: 'createdAt',
    sortable: true,
    align: 'left',
  },
  {
    name: 'time',
    label: 'Time',
    field: 'createdAt',
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
const rfqs = ref([
  {
    id: 'RFQ001',
    productName: 'Organic Coffee Beans',
    category: 'Food & Beverage',
    quantity: 1000,
    unit: 'Kilograms',
    status: 'Pending',
    targetPrice: 15.99,
    specifications: 'Arabica beans, medium roast, fair trade certified',
    certifications: ['Organic', 'Fair Trade'],
    packaging: ['Bulk'],
    deliveryLocation: 'New York, NY',
    deliveryDate: '2024-03-01',
    notes: 'Looking for long-term supplier relationship',
    createdAt: '2024-01-20T10:30:00',
  },
  {
    id: 'RFQ002',
    productName: 'Natural Soap Bars',
    category: 'Health & Beauty',
    quantity: 5000,
    unit: 'Pieces',
    status: 'Responded',
    targetPrice: 2.5,
    specifications: 'All-natural ingredients, vegan-friendly',
    certifications: ['Organic'],
    packaging: ['Retail Ready', 'Eco-friendly'],
    deliveryLocation: 'Los Angeles, CA',
    deliveryDate: '2024-02-15',
    notes: 'Eco-friendly packaging required',
    createdAt: '2024-01-19T14:45:00',
  },
])

const filteredRFQs = computed(() => {
  return rfqs.value.filter((rfq) => {
    const matchesStatus = filter.value.status === 'All' || rfq.status === filter.value.status
    const matchesCategory =
      filter.value.category === 'All' || rfq.category === filter.value.category
    const matchesSearch =
      rfq.productName.toLowerCase().includes(filter.value.search.toLowerCase()) ||
      rfq.id.toLowerCase().includes(filter.value.search.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
  })
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
  return date.formatDate(dateStr, 'MMMM D, YYYY')
}

const formatTime = (dateStr) => {
  return date.formatDate(dateStr, 'h:mm A')
}

const applyFilters = () => {
  loading.value = true
  // Simulate API call with filters
  setTimeout(() => {
    loading.value = false
  }, 1000)
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
