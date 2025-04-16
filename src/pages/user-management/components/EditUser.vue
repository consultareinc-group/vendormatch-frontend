<template>
  <div>
    <!-- Edit User Dialog -->
    <q-dialog v-model="userStore.ShowUserEditDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6">Edit User</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="userStore.UserDetails">
          <q-form @submit="saveUserChanges" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="editForm.first_name"
                  label="First Name"
                  :rules="[(val) => !!val || 'First name is required']"
                  outlined
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="editForm.last_name"
                  label="Last Name"
                  :rules="[(val) => !!val || 'Last name is required']"
                  outlined
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="editForm.email"
                  type="email"
                  label="Email"
                  :rules="[
                    (val) => !!val || 'Email is required',
                    (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email',
                  ]"
                  outlined
                />
              </div>
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="negative" v-close-popup class="q-mr-sm" />
              <q-btn type="submit" label="Save Changes" color="primary" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from 'src/stores/user'
const userStore = useUserStore()

const editForm = ref(userStore.UserDetails)

const saveUserChanges = () => {}
</script>
