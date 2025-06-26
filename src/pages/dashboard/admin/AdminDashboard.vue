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

    <div class="q-pa-md q-mt-xl text-center">
      <h6 class="q-my-none">Registered Users</h6>
      <q-skeleton v-if="registeredUserLoading" height="360px" />
      <div v-else ref="chartContainer"></div>
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
import { ref, onMounted, nextTick } from 'vue'
import { date } from 'quasar'
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
const registeredUserLoading = ref(true)

const registerUsers = ref({
  Jan: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Feb: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Mar: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Apr: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  May: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Jun: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Jul: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Aug: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Sep: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Oct: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Nov: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
  Dec: {
    vendor: 0,
    buyer: 0,
    vendor_buyer: 0,
  },
})

const chartContainer = ref(null)

const chartInstance = () => {
  Highcharts.chart(chartContainer.value, {
    chart: {
      type: 'line',
    },
    title: {
      text: '',
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
        text: date.formatDate(Date.now(), 'YYYY'),
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
        data: [
          registerUsers.value.Jan.vendor,
          registerUsers.value.Feb.vendor,
          registerUsers.value.Mar.vendor,
          registerUsers.value.Apr.vendor,
          registerUsers.value.May.vendor,
          registerUsers.value.Jun.vendor,
          registerUsers.value.Jul.vendor,
          registerUsers.value.Aug.vendor,
          registerUsers.value.Sep.vendor,
          registerUsers.value.Oct.vendor,
          registerUsers.value.Nov.vendor,
          registerUsers.value.Dec.vendor,
        ],
      },
      {
        name: 'Buyer',
        data: [
          registerUsers.value.Jan.buyer,
          registerUsers.value.Feb.buyer,
          registerUsers.value.Mar.buyer,
          registerUsers.value.Apr.buyer,
          registerUsers.value.May.buyer,
          registerUsers.value.Jun.buyer,
          registerUsers.value.Jul.buyer,
          registerUsers.value.Aug.buyer,
          registerUsers.value.Sep.buyer,
          registerUsers.value.Oct.buyer,
          registerUsers.value.Nov.buyer,
          registerUsers.value.Dec.buyer,
        ],
      },
      {
        name: 'Vendor & Buyer',
        data: [
          registerUsers.value.Jan.vendor_buyer,
          registerUsers.value.Feb.vendor_buyer,
          registerUsers.value.Mar.vendor_buyer,
          registerUsers.value.Apr.vendor_buyer,
          registerUsers.value.May.vendor_buyer,
          registerUsers.value.Jun.vendor_buyer,
          registerUsers.value.Jul.vendor_buyer,
          registerUsers.value.Aug.vendor_buyer,
          registerUsers.value.Sep.vendor_buyer,
          registerUsers.value.Oct.vendor_buyer,
          registerUsers.value.Nov.vendor_buyer,
          registerUsers.value.Dec.vendor_buyer,
        ],
      },
    ],
  })
}

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

  dashboardStore
    .GetRegisteredUsers()
    .then((response) => {
      if (response.status === 'success') {
        registerUsers.value = response.data
      } else {
        console.error('Failed to fetch registered users:', response.message)
      }
    })
    .finally(() => {
      registeredUserLoading.value = false
      nextTick(() => {
        chartInstance()
      })
    })
})

const tab = ref('inquiries')
</script>

<style lang="scss" scoped>
.stats-card {
  background: linear-gradient(100deg, #ffffff 80%, #004aad 100%);
}
</style>
