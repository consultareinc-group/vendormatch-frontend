<template>
  <div>
    <!-- Edit User Dialog -->
    <q-dialog v-model="userStore.ShowPasswordDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6">Change Password</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="changePassword">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="form.password"
                  :type="isPwd ? 'password' : 'text'"
                  label="Password *"
                  :rules="[
                    (val) => !!val || 'Password is required',
                    (val) => val.length >= 8 || 'Password must be at least 8 characters',
                  ]"
                  lazy-rules
                  outlined
                  dense
                  autocomplete="new-password"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div>
              <q-btn dense no-caps @click="generatePassword()" flat>Generate Password</q-btn>
            </div>

            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="negative" v-close-popup class="q-mr-sm" no-caps />
              <q-btn
                type="submit"
                label="Change Password"
                color="primary"
                :loading="btnLoading"
                no-caps
              />
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
import { useQuasar } from 'quasar'
const userStore = useUserStore()
const $q = useQuasar()

const form = ref({
  password: '',
})

const isPwd = ref(true)

const generatePassword = () => {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  form.value.password = password
}

// Define a reactive variable to track the loading state of the save button
const btnLoading = ref(false)

// Function to save changes made to the user
const changePassword = () => {
  btnLoading.value = true
  userStore
    .ChangePassword({ id: userStore.UserDetails.id, password: form.value.password })
    .then((response) => {
      let status = Boolean(response.status === 'success')

      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the password ${status ? 'has been' : 'was not'} changed.</p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })
      // Handle success
      userStore.ShowPasswordDialog = false
      form.value.password = ''
      btnLoading.value = false
    })
    .catch((error) => {
      // Handle error
      console.error('Error changing password:', error)
    })
    .finally(() => {
      // Reset loading state
      btnLoading.value = false
    })
}
</script>
