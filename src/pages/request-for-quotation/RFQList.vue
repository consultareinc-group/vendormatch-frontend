<template>
  <div>
    <RFQRequest v-if="authStore.UserInformation.role === 1" />
    <RFQResponse v-else />
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import RFQRequest from './RFQRequest.vue'
import RFQResponse from './RFQResponse.vue'

const authStore = useAuthStore()
</script>
