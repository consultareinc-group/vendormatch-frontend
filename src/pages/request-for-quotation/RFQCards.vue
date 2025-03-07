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

      <!-- RFQ Cards Grid -->
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div v-for="rfq in filteredRFQs" :key="rfq.id" class="col-12 col-sm-6 col-md-4">
            <q-card class="rfq-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6">{{ rfq.productName }}</div>
                    <div class="text-subtitle2">{{ rfq.category }}</div>
                  </div>
                  <div class="col-auto">
                    <q-chip :color="getStatusColor(rfq.status)" text-color="white" size="sm">
                      {{ rfq.status }}
                    </q-chip>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <div class="text-caption text-grey">Quantity</div>
                    <div>{{ rfq.quantity }} {{ rfq.unit }}</div>
                  </div>
                  <div class="col-6">
                    <div class="text-caption text-grey">Target Price</div>
                    <div>${{ rfq.targetPrice }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption text-grey">Delivery Location</div>
                    <div>{{ rfq.deliveryLocation }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption text-grey">Delivery Date</div>
                    <div>{{ formatDate(rfq.deliveryDate) }}</div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="text-caption text-grey">Required Certifications</div>
                <div class="q-gutter-xs">
                  <q-chip v-for="cert in rfq.certifications" :key="cert" size="sm" outline>
                    {{ cert }}
                  </q-chip>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  flat
                  color="primary"
                  icon="visibility"
                  label="View Details"
                  @click="viewRFQDetails(rfq)"
                />
                <q-btn
                  v-if="rfq.status === 'Pending'"
                  color="primary"
                  icon="chat"
                  label="Respond"
                  @click="respondToRFQ(rfq)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
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
import { date } from 'quasar'

const $q = useQuasar()

const loading = ref(false)
const showDetailsDialog = ref(false)
const selectedRFQ = ref(null)

const filter = ref({
  status: 'All',
  category: 'All',
  search: '',
})

const categories = ['Food & Beverage', 'Health & Beauty', 'Home & Garden', 'Electronics', 'Apparel']

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
.rfq-card {
  height: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}
</style>
