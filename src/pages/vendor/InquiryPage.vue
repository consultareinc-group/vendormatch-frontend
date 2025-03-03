<template>
  <div>
    <VendorInquiry v-if="authStore.UserInformation.role === 0" />
    <BuyerInquiry v-else />
  </div>
</template>

<script setup>
import VendorInquiry from './inquiry/VendorInquiry.vue'
import BuyerInquiry from './inquiry/BuyerInquiry.vue'

import { useAuthStore } from 'src/stores/auth'
const authStore = useAuthStore()
</script>
