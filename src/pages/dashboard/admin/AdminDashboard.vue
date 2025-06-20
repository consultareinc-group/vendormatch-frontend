<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card">
            <q-card-section>
              <div class="text-h6">Total Products</div>
              <q-skeleton v-if="totalProductsLoading" height="40px" width="70%" />
              <div v-else class="text-h4">{{ totalProducts }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card">
            <q-card-section>
              <div class="text-h6">Publish Listings</div>
              <q-skeleton v-if="totalPublishedProductsLoading" height="40px" width="70%" />
              <div v-else class="text-h4">{{ totalPublishedProducts }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card">
            <q-card-section>
              <div class="text-h6">RFQs</div>
              <q-skeleton v-if="totalRfqLoading" height="40px" width="70%" />
              <div v-else class="text-h4">{{ totalRfqs }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card">
            <q-card-section>
              <div class="text-h6">Inquiries</div>
              <q-skeleton v-if="totalInquiryLoading" height="40px" width="70%" />
              <div v-else class="text-h4">{{ totalInquiries }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card">
            <q-card-section>
              <div class="text-h6">Enterprises</div>
              <q-skeleton v-if="totalEnterpriseLoading" height="40px" width="70%" />
              <div v-else class="text-h4">{{ totalEnterprises }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card">
            <q-card-section>
              <div class="text-h6">Vendors</div>
              <q-skeleton v-if="totalUserLoading" height="40px" width="70%" />
              <div v-else class="text-h4">{{ totalVendors }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card">
            <q-card-section>
              <div class="text-h6">Buyers</div>
              <q-skeleton v-if="totalUserLoading" height="40px" width="70%" />
              <div v-else class="text-h4">{{ totalBuyers }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stats-card">
            <q-card-section>
              <div class="text-h6">Vendors & Buyers</div>
              <q-skeleton v-if="totalUserLoading" height="40px" width="70%" />
              <div v-else class="text-h4">{{ totalVendorsAndBuyers }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div class="q-pa-md q-mt-xl">
      <div ref="chartContainer"></div>
    </div>

    <div class="q-mt-xl q-px-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="inquiries" label="Inquiries" />
          <q-tab name="rfqs" label="RFQs" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="inquiries">
            <Inquiries />
          </q-tab-panel>

          <q-tab-panel name="rfqs"> </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Inquiries from './inquiry/InquiryPage.vue'
import Highcharts from 'highcharts'
import { useDashboardStore } from '../../../stores/dashboard'

const dashboardStore = useDashboardStore()

const totalProducts = ref(0)
const totalProductsLoading = ref(true)
const totalPublishedProducts = ref(0)
const totalPublishedProductsLoading = ref(true)
const totalRfqs = ref(0)
const totalRfqLoading = ref(true)
const totalInquiries = ref(0)
const totalInquiryLoading = ref(true)
const totalEnterprises = ref(0)
const totalEnterpriseLoading = ref(true)
const totalVendors = ref(0)
const totalBuyers = ref(0)
const totalVendorsAndBuyers = ref(0)
const totalUserLoading = ref(true)

const chartContainer = ref(null)

onMounted(() => {
  dashboardStore
    .GetTotalProducts()
    .then((response) => {
      if (response.status === 'success') {
        totalProducts.value = response.data.count
      } else {
        console.error('Failed to fetch total products:', response.message)
      }
    })
    .finally(() => {
      totalProductsLoading.value = false
    })

  dashboardStore
    .GetTotalPublishedProducts()
    .then((response) => {
      if (response.status === 'success') {
        totalPublishedProducts.value = response.data.count
      } else {
        console.error('Failed to fetch total products:', response.message)
      }
    })
    .finally(() => {
      totalPublishedProductsLoading.value = false
    })

  dashboardStore
    .GetTotalRFQs()
    .then((response) => {
      if (response.status === 'success') {
        totalRfqs.value = response.data.count
      } else {
        console.error('Failed to fetch total products:', response.message)
      }
    })
    .finally(() => {
      totalRfqLoading.value = false
    })

  dashboardStore
    .GetTotalRFQs()
    .then((response) => {
      if (response.status === 'success') {
        totalRfqs.value = response.data.count
      } else {
        console.error('Failed to fetch total products:', response.message)
      }
    })
    .finally(() => {
      totalRfqLoading.value = false
    })

  dashboardStore
    .GetTotalInquiries()
    .then((response) => {
      if (response.status === 'success') {
        totalInquiries.value = response.data.count
      } else {
        console.error('Failed to fetch total products:', response.message)
      }
    })
    .finally(() => {
      totalInquiryLoading.value = false
    })

  dashboardStore
    .GetTotalEnterprises()
    .then((response) => {
      if (response.status === 'success') {
        totalEnterprises.value = response.data.count
      } else {
        console.error('Failed to fetch total products:', response.message)
      }
    })
    .finally(() => {
      totalEnterpriseLoading.value = false
    })

  dashboardStore
    .GetTotalUsers()
    .then((response) => {
      if (response.status === 'success') {
        totalVendors.value = response.data.vendor_count
        totalBuyers.value = response.data.buyer_count
        totalVendorsAndBuyers.value = response.data.vendor_buyer_count
      } else {
        console.error('Failed to fetch total products:', response.message)
      }
    })
    .finally(() => {
      totalUserLoading.value = false
    })

  Highcharts.chart(chartContainer.value, {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Registered Users',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      title: {
        text: '2025',
      },
    },
    yAxis: {
      title: {
        text: 'User Count',
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    },
    series: [
      {
        name: 'Vendor',
        data: [16, 18, 23, 27, 32, 36, 39, 38, 36, 29, 22, 18],
      },
      {
        name: 'Buyer',
        data: [3, 4, 1, 5, 10, 15, 18, 17, 12, 7, 2, 1],
      },
      {
        name: 'Vendor & Buyer',
        data: [3, 4, 1, 4, 10, 17, 18, 17, 15, 7, 2, 9],
      },
    ],
  })
})

const tab = ref('inquiries')
</script>

<style lang="scss" scoped>
.stats-card {
  background: linear-gradient(100deg, #ffffff 80%, #004aad 100%);
}
</style>
