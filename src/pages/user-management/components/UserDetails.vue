<template>
  <div>
    <!-- User Details Dialog -->
    <q-dialog v-model="userStore.ShowUserDetailsDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6">User Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="userStore.UserDetails">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-img
                :src="userStore.UserDetails.photo || 'https://cdn.quasar.dev/img/boy-avatar.png'"
                style="height: 200px"
              />
            </div>
            <div class="col-12 col-md-8">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label overline>Full Name</q-item-label>
                    <q-item-label>{{
                      `${userStore.UserDetails.first_name} ${userStore.UserDetails.middle_name || ''} ${userStore.UserDetails.last_name} ${userStore.UserDetails.suffix_name || ''}`
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Enterprise</q-item-label>
                    <q-item-label>{{ userStore.UserDetails.enterprise_name }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Email</q-item-label>
                    <q-item-label>{{ userStore.UserDetails.email }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Role</q-item-label>
                    <q-item-label>{{
                      userStore.UserDetails.role === 0 ? 'Vendor' : 'Buyer'
                    }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label overline>Status</q-item-label>
                    <q-item-label>
                      <q-chip
                        :color="userStore.UserDetails.status === 'Active' ? 'positive' : 'negative'"
                        text-color="white"
                        size="sm"
                      >
                        {{ userStore.UserDetails.status }}
                      </q-chip>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useUserStore } from 'src/stores/user'
const userStore = useUserStore()
</script>
