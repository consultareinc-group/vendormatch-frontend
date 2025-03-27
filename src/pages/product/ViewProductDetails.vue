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
                  :name="image.name"
                  class="column flex-center"
                >
                  <q-img
                    class="full-width"
                    :src="`data:image/jpeg;base64,${image.binary}`"
                    alt="Product Image"
                  />
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
            <q-skeleton
              v-if="productDetailsLoadingState"
              square
              height="167px"
              class="q-mb-sm"
            ></q-skeleton>
            <div v-else>
              <div class="row q-mt-md">
                <div class="col-6">
                  <div class="flex justify-between items-center">
                    <div class="text-bold">Cost:</div>
                    <div v-if="!size.cost || size.cost === '0.00'">Negotiable</div>
                    <h5 v-else class="q-ma-none text-bold">${{ size.cost }}</h5>
                  </div>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-6">
                  <div class="flex justify-between items-center">
                    <div class="text-bold">SRP:</div>
                    <div v-if="!size.srp || size.srp === '0.00'">TBD</div>
                    <h5 v-else class="q-ma-none text-bold">${{ size.srp }}</h5>
                  </div>
                </div>
              </div>
              <div class="text-bold q-mt-md">Landed Cost:</div>
              <q-select
                v-model="landed_cost_option"
                dense
                :options="landed_costs"
                borderless
                option-label="country"
                option-value="amount"
                class="q-pa-none"
              >
                <template v-slot:append>
                  <div
                    v-if="!landed_cost_option.amount || landed_cost_option.amount === '0.00'"
                    class="text-black text-body2"
                  >
                    TBD
                  </div>
                  <div v-else class="text-black text-body2">${{ landed_cost_option.amount }}</div>
                </template>
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" :clickable="false">
                    <div class="flex justify-between items-center full-width">
                      <div>{{ scope.opt.country }}</div>
                      <div>
                        <div v-if="!scope.opt.amount || scope.opt.amount === '0.00'">TBD</div>
                        <div v-else>${{ scope.opt.amount }}</div>
                      </div>
                    </div>
                  </q-item>
                </template>
              </q-select>
            </div>
            <hr class="q-mt-md" />
            <q-skeleton
              v-if="productDetailsLoadingState"
              square
              height="21px"
              class="q-mb-sm"
            ></q-skeleton>
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
            <q-skeleton
              v-if="productDetailsLoadingState"
              square
              height="21px"
              class="q-mb-sm"
            ></q-skeleton>
            <div v-else class="flex justify-start items-center q-mt-md">
              <div class="text-bold q-mr-md">UPC:</div>
              <div>
                {{ size.upc }}
              </div>
            </div>
            <hr class="q-mt-md" />
            <q-skeleton
              v-if="productDetailsLoadingState"
              square
              height="98px"
              class="q-mb-sm"
            ></q-skeleton>
            <div v-else class="q-mt-md">
              <div class="text-bold">Description:</div>
              <div class="scroll">
                <pre>{{ productDetails.description }}</pre>
              </div>
            </div>
            <q-skeleton
              v-if="!productDetails.product_certificates"
              height="85px"
              class="q-my-sm"
            ></q-skeleton>
            <div v-else class="q-mt-sm">
              <label class="text-bold">Product Certificate:</label>
              <div class="flex justify-start">
                <div v-for="cert in productDetails.product_certificates" :key="cert">
                  <div>{{ cert.description }}</div>
                  <!-- <div :id="`pdf-product-certificates${index}`" class="q-mr-xs"></div>
                  <q-tooltip anchor="top middle" self="top middle" class="bg-primary"
                    >Click Me</q-tooltip
                  > -->
                </div>
              </div>
            </div>
            <q-skeleton v-if="!productDetails.facility_certificates" height="85px"></q-skeleton>
            <div v-else class="q-mt-sm">
              <label class="text-bold">Facility/Process Certificate:</label>
              <div class="flex justify-start">
                <div v-for="cert in productDetails.facility_certificates" :key="cert">
                  <div>{{ cert.description }}</div>

                  <!-- <div :id="`pdf-facility-certificates${index}`" class="q-mr-xs"></div>
                  <q-tooltip anchor="top middle" self="top middle" class="bg-primary"
                    >Click Me</q-tooltip
                  > -->
                </div>
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
import { useProductStore } from 'src/stores/products'
import { useTriggerStore } from 'src/stores/triggers'
// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'

// Set worker source to the CDN URL
// GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

// Import Quasar framework utilities
import { useQuasar } from 'quasar'

// Initialize Quasar for UI utilities
const $q = useQuasar()

// Initialize the dashboard store for state and actions related to the dashboard
const productStore = useProductStore()

// Initialize the trigger store for state and actions related to the triggers
const triggerStore = useTriggerStore()

const slide = ref('style')

const landed_cost_option = ref('')
const landed_costs = ref([])

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
      landed_cost_option.value = product_size.landed_cost[0]
      landed_costs.value = product_size.landed_cost
    }
  })
}
const productDetailsLoadingState = ref(false)
onMounted(() => {
  productDetailsLoadingState.value = true
  productDetails.value = { images: [] }
  productStore
    .GetProduct({ id: productStore.ProductDetails.id })
    .then((response) => {
      if (response.status === 'success') {
        productDetails.value = response.data
        // Assign a default value
        landed_cost_option.value = response.data.size[0].landed_cost[0]
        landed_costs.value = response.data.size[0].landed_cost
        size_option.value = response.data.size[0].size
        sizes.value = response.data.size.map((size) => size.size)
        slide.value = response.data.images[0].name
        changeProductCost()

        // Generate pdf renderer
        // productDetails.value.product_certificates.forEach((cert, index) => {
        //   const containerId = `pdf-product-certificates${index}`
        //   createPdfThumbnail(cert.binary, containerId)
        // })

        // productDetails.value.facility_certificates.forEach((cert, index) => {
        //   const containerId = `pdf-facility-certificates${index}`
        //   createPdfThumbnail(cert.binary, containerId)
        // })
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
      productDetailsLoadingState.value = false
    })
})

// // Function to create a thumbnail and make it clickable
// async function createPdfThumbnail(base64Pdf, containerId) {
//   // Convert base64 PDF to a Blob
//   const pdfBlob = base64ToBlob(base64Pdf, 'application/pdf')

//   // Create a URL for the Blob
//   const pdfUrl = URL.createObjectURL(pdfBlob)

//   // Render the first page of the PDF as a thumbnail
//   const canvas = document.createElement('canvas')
//   const context = canvas.getContext('2d')

//   // Use PDF.js to render the first page
//   const pdf = await getDocument(pdfUrl).promise
//   const page = await pdf.getPage(1)

//   const viewport = page.getViewport({ scale: 0.1 })
//   canvas.width = viewport.width
//   canvas.height = viewport.height

//   const renderContext = {
//     canvasContext: context,
//     viewport: viewport,
//   }

//   await page.render(renderContext).promise

//   // Append the canvas as a clickable thumbnail
//   const container = document.getElementById(containerId)
//   const thumbnailLink = document.createElement('a')
//   thumbnailLink.href = pdfUrl
//   thumbnailLink.target = '_blank' // Open the PDF in a new tab
//   thumbnailLink.appendChild(canvas)
//   container.appendChild(thumbnailLink)
// }

// // Function to convert base64 to a Blob
// function base64ToBlob(base64, contentType = '', sliceSize = 512) {
//   const byteCharacters = atob(base64)
//   const byteArrays = []

//   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//     const slice = byteCharacters.slice(offset, offset + sliceSize)
//     const byteNumbers = new Array(slice.length)
//     for (let i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i)
//     }
//     const byteArray = new Uint8Array(byteNumbers)
//     byteArrays.push(byteArray)
//   }

//   return new Blob(byteArrays, { type: contentType })
// }
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

  /* Webkit browsers (Chrome, Safari, Edge) */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: $secondary;
  }

  /* Firefox */
  scrollbar {
    width: 5px;
  }

  /* Track */
  scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  scrollbar-thumb {
    background: $secondary;
  }

  .scroll {
    /* Webkit browsers (Chrome, Safari, Edge) */
    ::-webkit-scrollbar {
      width: 2px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: $secondary;
    }

    /* Firefox */
    scrollbar {
      width: 2px;
    }

    /* Track */
    scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    scrollbar-thumb {
      background: $secondary;
    }
  }

  pre {
    font-family: sans-serif;
    overflow: overlay;
    text-wrap: auto;
    max-height: 200px;
  }
}
</style>
