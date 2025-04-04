<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <!-- <q-toolbar-title> VENDOR<span style="color: #5ce1e6">MATCH</span> </q-toolbar-title> -->
        <q-toolbar-title>
          <!-- <q-img src="../assets/vendormatch-logo.png" width="200px"></q-img> -->
        </q-toolbar-title>

        <div>
          <q-btn
            flat
            dense
            icon="person"
            :icon-right="isMenuOpen ? 'arrow_drop_down' : 'arrow_drop_up'"
            class="q-mr-sm"
            :label="`${authStore.UserInformation.last_name}, ${authStore.UserInformation.first_name}`"
            no-caps
          >
            <q-menu v-model="isMenuOpen">
              <q-list style="min-width: 200px">
                <!-- <q-item clickable v-close-popup @click="navigateToProfile">
                  <q-item-section>Profile</q-item-section>
                </q-item> -->
                <q-item clickable v-close-popup to="/create-account">
                  <q-item-section>Create Account</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered side="left" :width="240">
      <q-list>
        <q-item-label header>
          <q-img src="../assets/vendormatch-logo.png" width="200px"></q-img>
        </q-item-label>

        <q-item
          clickable
          v-ripple
          :to="{ name: authStore.UserInformation.role === 0 ? 'vendor' : 'buyer' }"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/products">
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section>Products</q-item-section>
        </q-item>

        <q-item
          v-if="
            (authStore.UserInformation.role === 0 && authStore.UserInformation.level !== 2) ||
            (authStore.UserInformation.role === 1 && authStore.UserInformation.level === 2)
          "
          clickable
          v-ripple
          to="/inquiries"
        >
          <q-item-section avatar>
            <q-icon name="question_answer" />
          </q-item-section>
          <q-item-section>Inquiries</q-item-section>
        </q-item>

        <q-expansion-item
          v-if="
            (authStore.UserInformation.role === 0 && authStore.UserInformation.level !== 2) ||
            (authStore.UserInformation.role === 1 && authStore.UserInformation.level === 2)
          "
          icon="request_quote"
          label="RFQ"
          expand-separator
        >
          <q-item clickable v-ripple to="/request-for-quotation">
            <q-item-section class="q-ml-xl q-pl-sm">Create RFQ</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/request-for-quotation-list">
            <q-item-section class="q-ml-xl q-pl-sm">RFQ List</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/request-for-quotation-cards">
            <q-item-section class="q-ml-xl q-pl-sm">RFQs</q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>
    </q-drawer>
    <right-drawer v-if="triggerStore.RightDrawerOpen"></right-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import RightDrawer from 'src/components/RightDrawer.vue'
import { useTriggerStore } from 'src/stores/triggers'

const router = useRouter()
const authStore = useAuthStore()
const triggerStore = useTriggerStore()
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const isMenuOpen = ref(false)

// const navigateToProfile = () => {
//   router.push('/profile')
// }

const logout = () => {
  authStore.LogoutUser()
  router.push('/signin')
}
</script>
