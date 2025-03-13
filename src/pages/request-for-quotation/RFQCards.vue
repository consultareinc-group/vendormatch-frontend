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
        <div v-if="rfqLoadingState" class="row q-col-gutter-md">
          <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
            <q-card class="rfq-card">
              <q-card-section>
                <q-skeleton height="40px"></q-skeleton>
                <q-skeleton height="20px" class="q-mt-sm"></q-skeleton>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-skeleton height="20px"></q-skeleton>
                  </div>
                  <div class="col-6">
                    <q-skeleton height="20px"></q-skeleton>
                  </div>
                  <div class="col-12">
                    <q-skeleton height="20px"></q-skeleton>
                  </div>
                  <div class="col-12">
                    <q-skeleton height="20px"></q-skeleton>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="q-gutter-xs">
                  <q-skeleton height="20px"></q-skeleton>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-skeleton width="100px" height="40px"></q-skeleton>
              </q-card-actions>
            </q-card>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div v-for="rfq in filteredRFQs" :key="rfq.id" class="col-12 col-sm-6 col-md-4">
            <q-card class="rfq-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6 ellipsis">{{ rfq.product_name }}</div>
                    <q-tooltip anchor="top left" self="top left" class="bg-primary">{{
                      rfq.product_name
                    }}</q-tooltip>
                    <div class="text-subtitle2">{{ rfq.category }}</div>
                  </div>
                  <div class="col-auto">
                    <q-chip :color="getStatusColor(rfq.status)" text-color="white" size="sm">
                      {{ status[rfq.status] }}
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
                    <div>${{ rfq.target_price }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption text-grey">Delivery Location</div>
                    <div>{{ rfq.delivery_location }}</div>
                  </div>
                  <div class="col-12">
                    <div class="text-caption text-grey">Delivery Date</div>
                    <div>{{ formatDate(rfq.required_delivery_date) }}</div>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="text-caption text-grey">Required Certifications</div>
                <div class="q-gutter-xs">
                  <div v-if="rfq.required_certifications">
                    <q-chip
                      v-for="cert in rfq.required_certifications
                        .split(', ')
                        .map((item) => item.trim())"
                      :key="cert"
                      size="sm"
                      outline
                    >
                      {{ cert }}
                    </q-chip>
                  </div>
                  <div v-else><q-chip size="sm" outline>none</q-chip></div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  flat
                  color="primary"
                  icon="visibility"
                  label="View Details"
                  no-caps
                  @click="viewRFQDetails(rfq)"
                />
                <q-btn
                  v-if="rfq.status === 'Pending'"
                  color="primary"
                  icon="chat"
                  label="Respond"
                  no-caps
                  @click="respondToRFQ(rfq)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      <div v-if="rfqs.length > 100" class="flex justify-center full-width q-my-md">
        <q-btn
          @click="getRFQs()"
          label="View More"
          class="bg-white"
          no-caps
          :loading="viewMoreLoadingState"
        />
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
                    <q-item-label>{{ formatDate(selectedRFQ.delivery_date) }}</q-item-label>
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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { date } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'

const $q = useQuasar()
const rfqStore = useRFQStore()

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
const rfqs = ref(rfqStore.RFQs)

const filteredRFQs = computed(() => {
  return rfqs.value.filter((rfq) => {
    const matchesStatus = filter.value.status === 'All' || rfq.status === filter.value.status
    const matchesCategory =
      filter.value.category === 'All' || rfq.category === filter.value.category
    const matchesSearch =
      rfq.product_name.toLowerCase().includes(filter.value.search.toLowerCase()) ||
      rfq.id.toLowerCase().includes(filter.value.search.toLowerCase())

    return matchesStatus && matchesCategory && matchesSearch
  })
})

const rfqLoadingState = ref(false)
const viewMoreLoadingState = ref(false)
const getRFQs = () => {
  rfqLoadingState.value = true
  if (rfqStore.RFQs.length) {
    rfqLoadingState.value = false
  }
  viewMoreLoadingState.value = true
  rfqStore
    .GetRFQs(`offset=${rfqs.value.length}`)
    .then((response) => {
      if (response.status === 'success') {
        response.data.forEach((data) => {
          rfqs.value.push(data)
        })

        rfqStore.RFQs = rfqs.value
      }
    })
    .finally(() => {
      rfqLoadingState.value = false
      viewMoreLoadingState.value = false
    })
}

onMounted(() => {
  if (!rfqStore.RFQs.length) {
    getRFQs()
  }
})

const status = ['Pending', 'Responded', 'Closed']
const getStatusColor = (status) => {
  const colors = ['warning', 'info', 'positive']

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
