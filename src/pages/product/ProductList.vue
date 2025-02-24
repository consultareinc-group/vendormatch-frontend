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
import { useAuthStore } from 'src/stores/auth'
const triggerStore = useTriggerStore()
const authStore = useAuthStore()

onMounted(() => {
  triggerStore.RightDrawerOpen = true

  if (authStore.UserInformation.role == 0) {
    triggerStore.HideChatSection = true
  }
})
onBeforeRouteLeave(() => {
  triggerStore.RightDrawerOpen = false
})
</script>
