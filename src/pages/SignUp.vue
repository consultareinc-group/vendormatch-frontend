<template>
  <div class="flex flex-center bg-grey-2" style="height: calc(100vh)">
    <q-card class="registration-card q-pa-lg">
      <q-card-section class="text-center">
        <q-img src="../assets/vendormatch-logo.png" width="200px"></q-img>
        <div class="text-h5 q-my-md">Create Account</div>
        <div class="text-grey-6">Register an enterprise and user account</div>
      </q-card-section>

      <q-card-section>
        <q-stepper v-model="step" ref="stepper" color="primary" animated flat>
          <!-- Enterprise Information -->
          <q-step :name="1" title="Enterprise Information" icon="business" :done="step > 1">
            <q-form @submit="onEnterpriseSubmit" class="q-gutter-md">
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-12">
                  <q-checkbox v-model="hasEnterprise" label="Already have an enterprise?" />
                </div>
                <div v-if="hasEnterprise" class="col-12">
                  <q-select
                    v-model="enterprise_id"
                    use-input
                    :options="enterpriseOptions"
                    @filter="filterEnterprise"
                    label="Search Enterprise *"
                    outlined
                    clearable
                    option-label="name"
                    option-value="id"
                    emit-value
                    map-options
                    input-debounce="1000"
                    :loading="searchEnterpriseLoadingState"
                    dense
                    :rules="[(val) => !!val || 'Enterprise name is required']"
                    lazy-rules
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey"> No results </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <div v-if="!hasEnterprise" class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="enterprise.name"
                    label="Enterprise Name *"
                    :rules="[(val) => !!val || 'Enterprise name is required']"
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="enterprise.registration_number"
                    label="Registration Number"
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-select
                    v-model="enterprise.industry_type"
                    outlined
                    dense
                    :options="categories"
                    label="Category *"
                    :rules="[(val) => !!val || 'Category is required']"
                    lazy-rules
                    use-input
                    input-debounce="0"
                    @filter="filterFn"
                    class="q-mb-md"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    v-model="enterprise.address"
                    type="textarea"
                    label="Address"
                    outlined
                    autogrow
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="enterprise.city" label="City" outlined dense />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="enterprise.state" label="State/Province" outlined dense />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="enterprise.country" label="Country" outlined dense />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="enterprise.postal_code" label="Postal Code" outlined dense />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="enterprise.contact_number"
                    label="Contact Number"
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="enterprise.email"
                    type="email"
                    label="Enterprise Email *"
                    :rules="[
                      (val) => !!val || 'Email is required',
                      (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email',
                    ]"
                    lazy-rules
                    outlined
                    dense
                    autocomplete="off"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="enterprise.website" label="Website" outlined dense />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    v-model="enterprise.established_date"
                    label="Established Date"
                    dense
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="establishedDate"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            minimal
                            v-model="enterprise.established_date"
                            @update:model-value="() => $refs.establishedDate.hide()"
                            mask="YYYY-MM-DD"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row justify-end q-mt-md">
                <q-btn type="submit" color="primary" label="Next" />
              </div>
            </q-form>
          </q-step>

          <!-- User Information -->
          <q-step :name="2" title="User Information" icon="person" :done="step > 2">
            <q-form @submit="onUserSubmit" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="user.first_name"
                    label="First Name *"
                    :rules="[(val) => !!val || 'First name is required']"
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="user.last_name" label="Last Name" outlined dense />
                </div>

                <div class="col-12">
                  <q-select
                    v-model="user.role"
                    :options="[
                      { label: 'Vendor', value: 0 },
                      { label: 'Buyer', value: 1 },
                      { label: 'Buyer & Vendor', value: 2 },
                    ]"
                    label="Role *"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    :rules="[(val) => val !== null || 'Role is required']"
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="user.email"
                    type="email"
                    label="Email *"
                    :rules="[
                      (val) => !!val || 'Email is required',
                      (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email',
                    ]"
                    lazy-rules
                    outlined
                    dense
                    autocomplete="new-email"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="user.password"
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
                  <div class="text-primary text-right">
                    <q-btn dense no-caps @click="generatePassword()" flat>generate password</q-btn>
                  </div>
                </div>
              </div>
              <div class="row justify-end q-mt-md">
                <q-btn flat color="primary" label="Back" class="q-mr-sm" @click="step = 1" dense />
                <q-btn type="submit" color="primary" label="Submit" :loading="registering" />
              </div>
            </q-form>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'src/stores/account'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const accountStore = useAccountStore()
const router = useRouter()

const step = ref(1)
// const registering = ref(false)
const hasEnterprise = ref(false)
const enterprise = ref({
  name: '',
  registration_number: '',
  industry_type: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  contact_number: '',
  email: '',
  website: '',
  established_date: '',
})
const enterprise_id = ref(null)

// Array of predefined product categories
const categoryOptions = [
  'Food',
  'Non-Food',
  'Food & Non-Food',
  'Organic',
  'Non-Organic',
  'Organic & Non-Organic',
  'Dietary Supplements',
  'Alcoholic Beverages',
  'Animal/Pet Food and Feed',
  'Baby/Toddler Foods and Infant Formulas',
  'Bakery Products, Dough Mixes or Icings',
  'Beverage Bases',
  'Botanicals And Herbs',
  'Brewer Products',
  'Candies and Chewing Gums',
  'Cannabis',
  'Chemical Preservatives',
  'Cosmetics',
  'Biologics',
  'Breakfast Foods and Cereals',
  'Cheese and Cheese Products',
  'Chocolate and Cocoa Products',
  'Coffee and Tea',
  'Color Additives',
  'Dietary Conventional Foods',
  'Dressings and Condiments',
  'Drugs and Pharmaceuticals',
  'Fishery/Seafood Products',
  'Food Additives',
  'Food Sweeteners',
  'Fruits and Fruit Products',
  'Fruit or Vegetable Juices and Concentrates',
  'Gelatin, Rennet, Pudding mixes or Pie Fillings',
  'Ice Cream',
  'Pasta and Noodles',
  'Meat, Meat Products and Poultry',
  'Medical Devices',
  'Milk and Milk Products',
  'Nuts and Edible Seeds',
  'Prepared Salad Products',
  'Services',
  'Shell Eggs and Egg Products',
  'Snack Foods',
  'Spices, Flavors and Salts',
  'Soups',
  'Soft Drinks and Waters',
  'Tobacco Products',
  'Vegetable and Vegetable Products',
  'Vegetable Oils',
  'Vegetable Proteins',
  'Whole Grain and Miller Grain Products',
  'Yeast Products',
]

const categories = ref(categoryOptions)

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      categories.value = categoryOptions
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    categories.value = categoryOptions.filter((v) => v.toLowerCase().indexOf(needle) > -1)
  })
}

const user = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: null,
  level: 1,
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
  user.value.password = password
}

const function_ids = ref([])
watch(
  () => [user.value.role, user.value.level],
  ([role, level]) => {
    if (role === 0 && level === 1) {
      function_ids.value = [1, 2, 3, 8, 9, 10, 12]
    } else if (role === 0 && level === 2) {
      function_ids.value = [1, 2, 3, 4]
    } else if (role === 1 && level === 2) {
      function_ids.value = [1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    } else if (role === 2) {
      function_ids.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    } else {
      function_ids.value = []
    }
  },
)

const enterpriseOptions = ref([])
const searchEnterpriseLoadingState = ref(false)

const fetchEnterprises = async (val, update) => {
  searchEnterpriseLoadingState.value = true
  try {
    const response = await accountStore.SearchEnterprise(`search=${val}`)
    if (response.status === 'success') {
      // Use a Set to avoid duplicate enterprise entries
      const existingIds = new Set(accountStore.Enterprises.map((enterprise) => enterprise.id))
      response.data.forEach((enterprise) => {
        if (!existingIds.has(enterprise.id)) {
          accountStore.Enterprises.push(enterprise)
        }
      })

      update(() => {
        enterpriseOptions.value = accountStore.Enterprises
      })
    }
  } finally {
    searchEnterpriseLoadingState.value = false
  }
}

const filterEnterprise = (val, update) => {
  if (!val) {
    update(() => (enterpriseOptions.value = accountStore.Enterprises))
    return
  }

  update(() => {
    enterpriseOptions.value = accountStore.Enterprises.filter((enterprise) =>
      enterprise.name.toLowerCase().includes(val.toLowerCase()),
    )
  })

  if (!enterpriseOptions.value.length) {
    accountStore.Enterprises = [] // Clear old data before fetching
    fetchEnterprises(val, update)
  }
}

const onEnterpriseSubmit = () => {
  step.value = 2
}

const registering = ref(false)
const onUserSubmit = () => {
  registering.value = true

  if (!hasEnterprise.value) {
    accountStore.RegisterEnterprise(enterprise.value).then((response) => {
      let status = Boolean(response.status === 'success')

      if (status) {
        registering.value = true
        registerUserInformationandPermissions(response.data.id)
      }
    })
  } else {
    registerUserInformationandPermissions(enterprise_id.value)
  }
}

const registerUserInformationandPermissions = (enterpriseid) => {
  user.value.enterprise_id = enterpriseid
  accountStore.RegisterUser(user.value).then((response) => {
    let status = Boolean(response.status === 'success')

    if (status) {
      registering.value = true
      accountStore
        .RegisterUserPermission({
          user_id: response.data.id,
          functions_id: function_ids.value,
          system_id: 1,
        })
        .then(() => {
          let status = Boolean(response.status === 'success')
          if (status) {
            enterprise.value = {
              name: '',
              registration_number: '',
              industry_type: '',
              address: '',
              city: '',
              state: '',
              country: '',
              postal_code: '',
              contact_number: '',
              email: '',
              website: '',
              established_date: '',
            }
            user.value = {
              first_name: '',
              last_name: '',
              email: '',
              password: '',
              role: null,
              level: 1,
            }
            function_ids.value = []
            hasEnterprise.value = false
            enterprise_id.value = null
          }
          $q.notify({
            message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> ${status ? 'You are now registered, please try to login.' : 'Something went wrong, please try again!'}</p>`,
            color: `${status ? 'green' : 'red'}-2`,
            position: 'top',
            textColor: `${status ? 'green' : 'red'}`,
            html: true,
          })
        })
        .finally(() => {
          registering.value = false
          router.push('signin')
        })
    }
  })
}
</script>

<style lang="scss" scoped>
.registration-card {
  width: 100%;
  max-width: 800px;
  margin: 20px;
}

.q-stepper {
  background: transparent;
}
</style>
