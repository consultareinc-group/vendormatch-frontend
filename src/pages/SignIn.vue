<template>
  <div class="flex flex-center bg-grey-2" style="height: 100vh">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <div class="logo-container q-mb-lg">
          <q-img src="src/assets/vendormatch-logo.png" width="250px" />
        </div>
        <div class="text-h6">Welcome Back</div>
        <div class="text-grey-6">Sign in to your account</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-md" greedy>
          <q-input
            dense
            v-model="form.username"
            type="email"
            label="Email"
            :rules="[
              (val) => !!val || 'Email is required',
              (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email',
            ]"
            outlined
          />

          <q-input
            dense
            v-model="form.password"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            :rules="[(val) => !!val || 'Password is required']"
            outlined
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between">
            <q-checkbox color="secondary" v-model="rememberMe" label="Remember me" />
            <q-btn flat color="primary" no-caps label="Forgot Password?" />
          </div>

          <q-btn
            label="Sign In"
            type="submit"
            color="primary"
            class="full-width"
            no-caps
            dense
            :loading="btnLoadingState"
          />
        </q-form>
      </q-card-section>

      <!-- <q-card-section class="text-center q-pa-sm">
        <p class="text-grey-6">
          Don't have an account?
          <router-link to="/register" class="text-primary">Sign up</router-link>
        </p>
      </q-card-section> -->
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
// import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
// const $q = useQuasar()

const form = ref({
  username: 'john.miller.doe@company.com',
  password: '12345',
})

const isPwd = ref(true)
const rememberMe = ref(false)
const btnLoadingState = ref(false)

const onSubmit = () => {
  btnLoadingState.value = true
  authStore
    .LoginUser(form.value)
    .then((response) => {
      if (response.status === 'success') {
        if (response.data.role === 0) {
          router.push({ name: 'vendor' })
        } else {
          router.push({ name: 'products' })
        }
      }
    })
    .finally(() => {
      btnLoadingState.value = false
    })
}
</script>

<style lang="scss" scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style>
