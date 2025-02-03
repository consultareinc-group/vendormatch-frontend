<template>
  <div>
    <div v-if="savedProductsLoadingState">
      <q-list v-for="n in 3" :key="n" separator>
        <q-item v-ripple>
          <q-item-section avatar>
            <q-avatar>
              <q-skeleton type="QAvatar" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-skeleton type="square" />
            <q-skeleton type="square" />
          </q-item-section>

          <q-item-section side>
            <q-skeleton type="square" width="30px" height="30px" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-list v-else separator>
      <q-item v-for="product in productStore.SavedProducts" :key="product.id" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar>
            <img :src="`data:image/jpeg;base64,${product.image[0].binary}`" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="ellipsis">{{ product.product_name }}</q-item-label>
          <q-item-label caption>{{ product.enterprise_name }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn flat round color="secondary" icon="message" @click="contactvendor(product)" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from 'src/stores/products'
const productStore = useProductStore()

productStore.SavedProducts = [
  {
    id: '',
    name: '',
    vendor: '',
    image: [{ name: '', binary: '' }],
  },
]

const contactvendor = () => {}

const savedProductsLoadingState = ref(false)
onMounted(() => {
  savedProductsLoadingState.value = true
  productStore
    .GetFavoriteProducts(`limit=5`)
    .then((response) => {
      if (response.status === 'success') {
        productStore.SavedProducts = response.data
      }
    })
    .finally(() => {
      savedProductsLoadingState.value = false
    })
})
</script>
