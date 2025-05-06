<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Page Header -->
      <div class="col-12 flex justify-between items-center q-mb-md">
        <div class="text-h5">Account Management</div>
        <q-btn to="/create-account" label="Create Account" no-caps color="primary" />
      </div>

      <!-- Tabs -->
      <div class="col-12">
        <q-card>
          <q-tabs
            v-model="activeTab"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            inline-label
            align="left"
            narrow-indicator
          >
            <q-tab name="enterprises" icon="business" label="Enterprises" />
            <q-tab name="vendors" icon="store" label="Vendors" />
            <q-tab name="buyers" icon="shopping_cart" label="Buyers" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <!-- Vendors Panel -->
            <q-tab-panel name="enterprises">
              <EnterpriseList />
            </q-tab-panel>
            <!-- Vendors Panel -->
            <q-tab-panel name="vendors">
              <VendorList />
            </q-tab-panel>

            <!-- Buyers Panel -->
            <q-tab-panel name="buyers"> <BuyerList /> </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import EnterpriseList from 'src/pages/user-management/EnterpriseList.vue'
import VendorList from 'src/pages/user-management/VendorList.vue'
import BuyerList from 'src/pages/user-management/BuyerList.vue'
const activeTab = ref('enterprises')
</script>
