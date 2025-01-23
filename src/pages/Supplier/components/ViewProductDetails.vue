<template>
  <q-dialog class="vendor-view-product-details" v-model="triggerStore.ViewProductDetailsDialog">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <div class="bg-grey-5 q-px-xs q-py-md">
              <q-skeleton v-if="!productDetails.images.length" height="300px"></q-skeleton>
              <q-carousel
                v-if="productDetails.images.length"
                v-model="slide"
                transition-prev="scale"
                transition-next="scale"
                swipeable
                animated
                control-color="black"
                arrows
                height="300px"
              >
                <q-carousel-slide
                  v-for="image in productDetails.images"
                  :key="image"
                  name="style"
                  class="column flex-center"
                >
                  <q-img :src="`data:image/jpeg;base64,${image.binary}`" alt="Product Image" />
                </q-carousel-slide>
              </q-carousel>
            </div>
          </div>
          <div class="col-6 q-px-md">
            <q-skeleton
              v-if="!productDetails.name"
              square
              height="64px"
              class="q-mb-sm"
            ></q-skeleton>
            <h6 v-else class="q-ma-none">{{ productDetails.name }}</h6>
            <q-skeleton
              v-if="!productDetails.category"
              square
              height="21px"
              class="q-mb-sm"
            ></q-skeleton>
            <div class="">{{ productDetails.category }}</div>
            <q-skeleton v-if="!size.size" square height="167px" class="q-mb-sm"></q-skeleton>
            <div v-else>
              <div class="row q-mt-md">
                <div class="col-6">
                  <div class="flex justify-between items-center">
                    <div class="text-bold">Cost:</div>
                    <h5 class="q-ma-none text-bold">${{ size.cost }}</h5>
                  </div>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-6">
                  <div class="flex justify-between items-center">
                    <div class="text-bold">SRP:</div>
                    <h5 class="q-ma-none text-bold">${{ size.srp }}</h5>
                  </div>
                </div>
              </div>
              <div class="text-bold q-mt-md">Landed Cost:</div>
              <div v-for="cost in size.landed_cost" :key="cost" class="row q-mt-xs">
                <div class="col-8">
                  {{ cost.country }}
                </div>
                <div class="col-4">${{ cost.amount }}</div>
              </div>
            </div>
            <hr class="q-mt-md" />
            <q-skeleton v-if="!size.size" square height="21px" class="q-mb-sm"></q-skeleton>
            <div v-else class="flex justify-start items-center q-mt-md">
              <div class="text-bold q-mr-md">Size:</div>
              <div>
                <q-select
                  v-model="size_option"
                  dense
                  :options="sizes"
                  @vue:updated="changeProductCost()"
                  outlined
                  class="q-pa-none"
                />
              </div>
            </div>
            <q-skeleton v-if="!size.upc" square height="21px" class="q-mb-sm"></q-skeleton>
            <div v-else class="flex justify-start items-center q-mt-md">
              <div class="text-bold q-mr-md">UPC:</div>
              <div>
                {{ size.upc }}
              </div>
            </div>
            <hr class="q-mt-md" />
            <q-skeleton
              v-if="!productDetails.description"
              square
              height="98px"
              class="q-mb-sm"
            ></q-skeleton>
            <div v-else class="q-mt-md">
              <div class="text-bold">Description:</div>
              <div>
                <pre style="font-family: sans-serif">{{ productDetails.description }}</pre>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" no-caps v-close-popup />
        <!-- <q-btn flat label="Connect to Vendor" no-caps color="primary bg-secondary text-white" /> -->
      </q-card-actions>
    </q-card>

    <!-- PDF Preview -->
    <!-- <object
        v-if="isPdf"
        :data="`data:application/pdf;base64,${fileData}`"
        type="application/pdf"
        width="100%"
        height="500px"
      >
        <p>
          PDF cannot be displayed. You can
          <a :href="`data:application/pdf;base64,${fileData}`" download>download it</a>.
        </p>
      </object> -->

    <!-- DOCX & XLSX Files -->
    <!-- <div v-if="isDocxOrXlsx">
        <p>
          Document cannot be displayed. You can
          <a
            :href="`data:application/vnd.openxmlformats-officedocument.${fileExtension};base64,${fileData}`"
            download
            >download the file</a
          >.
        </p>
      </div> -->
  </q-dialog>
</template>

<script setup>
// Import Vue's reactive and lifecycle utilities
import { onMounted, ref } from 'vue'

// Import the store for dashboard-related state management
import { useDashboardStore } from 'src/stores/dashboard'
import { useTriggerStore } from 'src/stores/triggers'

// Import Quasar framework utilities
import { useQuasar } from 'quasar'

// Initialize Quasar for UI utilities
const $q = useQuasar()

// Initialize the dashboard store for state and actions related to the dashboard
const dashboardStore = useDashboardStore()

// Initialize the trigger store for state and actions related to the triggers
const triggerStore = useTriggerStore()

const slide = ref('style')

const size_option = ref('')
const sizes = ref([])

const size = ref({
  size: '',
  upc: '',
  cost: '',
  srp: '',
  landed_cost: [],
})

const productDetails = ref({
  images: [],
})

const changeProductCost = () => {
  productDetails.value.size.forEach((product_size) => {
    if (size_option.value === product_size.size) {
      size.value = product_size
    }
  })
}

onMounted(() => {
  productDetails.value = { images: [] }
  dashboardStore
    .GetProduct({ id: dashboardStore.ProductDetails.id })
    .then((response) => {
      if (response.status === 'success') {
        productDetails.value = response.data
        // Assign a default value
        size_option.value = response.data.size[0].size
        sizes.value = response.data.size.map((size) => size.size)
        changeProductCost()
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
})
</script>

<style lang="scss">
.vendor-view-product-details {
  .q-field--auto-height.q-field--dense .q-field__control {
    min-height: 30px;
    max-height: 30px;
  }
  .q-field--auto-height.q-field--dense .q-field__native {
    min-height: 30px;
  }
  .q-field--dense .q-field__marginal {
    height: 30px;
  }
}
</style>
