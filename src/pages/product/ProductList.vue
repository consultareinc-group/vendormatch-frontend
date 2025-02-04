<template>
  <div class="q-pa-md">
    <ProductCard />
  </div>
</template>

<script setup>
import ProductCard from 'src/components/ProductCard.vue'
import { onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useTriggerStore } from 'src/stores/triggers'
const triggerStore = useTriggerStore()

onMounted(() => {
  triggerStore.RightDrawerOpen = true
})
onBeforeRouteLeave(() => {
  triggerStore.RightDrawerOpen = false
})
</script>
