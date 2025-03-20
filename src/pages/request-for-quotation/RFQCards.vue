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
      <RFQCard />
      <RFQDetails v-if="rfqStore.ShowRFQDetailsDialog" />
      <RFQRespond v-if="rfqStore.ShowRFQRespondDialog" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRFQStore } from 'src/stores/rfq'

const $q = useQuasar()
const rfqStore = useRFQStore()

// RFQ Components
import RFQCard from './components/RFQCard.vue'
import RFQDetails from './components/RFQDetails.vue'
import RFQRespond from './components/RFQRespond.vue'

const filter = ref({
  status: 'All',
  category: 'All',
  search: '',
})

const categories = ['Food & Beverage', 'Health & Beauty', 'Home & Garden', 'Electronics', 'Apparel']

const searchRFQs = () => {
  rfqStore.RFQSearching = true
  rfqStore
    .SearchRFQs(
      `offset=${rfqStore.RFQs.length}&search_keyword=${filter.value.search}&status=${filter.value.status}&category=${encodeURIComponent(filter.value.category)}&is_not_closed=true`,
    )
    .then((response) => {
      if (response.status === 'success') {
        rfqStore.RFQs.push(...response.data)
        rfqStore.RFQSearchResults.push(...response.data)

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
      rfqStore.RFQCardLoading = false
    })
}

const applyFilters = () => {
  rfqStore.RFQs = []
  rfqStore.RFQCardLoading = true
  searchRFQs()
}
</script>
