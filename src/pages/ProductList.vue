<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Products Grid -->
      <div class="col-12">
        <div class="row q-col-gutter-sm">
          <div
            v-for="product in productStore.Products"
            :key="product.id"
            class="col-12 col-sm-6 col-md-3"
          >
            <q-card class="product-card">
              <q-img :src="'../../png.png'" :ratio="1" class="product-image" />

              <q-card-section>
                <div class="text-h6">Name</div>
                <div class="text-subtitle2">Category</div>
                <div class="text-body2 q-mt-sm"><span class="text-grey">Cost:</span> $</div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat color="primary" label="Connect to Vendor" />
                <!-- <q-btn
                  v-if="authStore.user?.role === 'retailer'"
                  color="primary"
                  label="Contact Supplier"
                /> -->
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useProductStore } from 'src/stores/products'
import { useTriggerStore } from 'src/stores/triggers'
// import { useAuthStore } from 'src/stores/auth'

const productStore = useProductStore()
const triggerStore = useTriggerStore()
// const authStore = useAuthStore()

onMounted(() => {
  triggerStore.RightDrawerOpen = true
})
onBeforeRouteLeave(() => {
  triggerStore.RightDrawerOpen = false
})
</script>

<style lang="scss" scoped>
.filter-card {
  position: sticky;
  top: 20px;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  .product-image {
    height: 200px;
    object-fit: cover;
  }
}
</style>
