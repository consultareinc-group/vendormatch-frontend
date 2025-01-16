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
          <q-btn flat round dense icon="person" class="q-mr-sm">
            <q-menu>
              <q-list style="min-width: 200px">
                <q-item clickable v-close-popup @click="navigateToProfile">
                  <q-item-section>Profile</q-item-section>
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
          :to="authStore.user?.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/buyer'"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <right-drawer></right-drawer>

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

const router = useRouter()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const navigateToProfile = () => {
  router.push('/profile')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
