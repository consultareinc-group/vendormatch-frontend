<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="registration-card q-pa-lg">
      <q-card-section class="text-center">
        <div class="text-h5 q-mb-md">Create Account</div>
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
                    label="Category"
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
                  <q-input v-model="user.middle_name" label="Middle Name" outlined dense />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="user.last_name"
                    label="Last Name *"
                    :rules="[(val) => !!val || 'Last name is required']"
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="user.suffix_name"
                    label="Suffix (Jr., Sr., III, etc.)"
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input outlined v-model="user.birthday" label="Birthday" dense>
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="birthday"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            minimal
                            v-model="user.birthday"
                            @update:model-value="() => $refs.birthday.hide()"
                            mask="YYYY-MM-DD"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-6">
                  <q-file
                    v-model="user.photo"
                    label="Profile Photo"
                    outlined
                    accept="image/*"
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
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
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="user.password"
                    type="password"
                    label="Password *"
                    :rules="[
                      (val) => !!val || 'Password is required',
                      (val) => val.length >= 8 || 'Password must be at least 8 characters',
                    ]"
                    lazy-rules
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-select
                    v-model="user.role"
                    :options="[
                      { label: 'Vendor', value: 0 },
                      { label: 'Buyer', value: 1 },
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
                  <q-select
                    v-model="user.level"
                    :options="[
                      { label: 'Coordinator', value: 1 },
                      { label: 'User', value: 2 },
                    ]"
                    label="Level *"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    :rules="[(val) => val !== null || 'Level is required']"
                    outlined
                    dense
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-md">
                <q-btn flat color="primary" label="Back" class="q-mr-sm" @click="step = 1" dense />
                <q-btn type="submit" color="primary" label="Next" />
              </div>
            </q-form>
          </q-step>
          <q-step :name="3" title="Set Permission" icon="lock" :done="step > 3">
            <q-form @submit="onPermissionSubmit">
              <div>
                <q-card class="q-mb-md">
                  <q-card-section>
                    <div class="text-h6">Set Permissions</div>
                    <div class="text-grey-6">
                      Select the permissions for the
                      <span class="text-primary">{{ user.role === 0 ? 'Vendor' : 'Buyer' }} </span>
                      role with the
                      <span class="text-primary"
                        >{{ user.level === 1 ? 'Coordinator' : 'User' }}
                      </span>
                      level.
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <div v-for="(module, index) in permissions.modules" :key="index">
                      <q-expansion-item :label="module.module_name" icon="folder" expand-separator>
                        <div v-for="(func, index) in module.functions" :key="index">
                          <q-checkbox
                            v-model="function_ids"
                            :label="func.function_name"
                            :val="func.id"
                          />
                        </div>
                      </q-expansion-item>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="row justify-end q-mt-md">
                <q-btn flat color="primary" label="Back" class="q-mr-sm" @click="step = 2" dense />
                <q-btn type="submit" color="primary" label="Register" :loading="registering" />
              </div>
            </q-form>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'src/stores/account'

const $q = useQuasar()
const accountStore = useAccountStore()

const step = ref(1)
const registering = ref(false)
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
  'Organic',
  'Non-Organic',
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
  middle_name: '',
  last_name: '',
  suffix_name: '',
  birthday: '',
  email: '',
  photo: null,
  password: '',
  role: null,
  level: null,
})
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
    } else {
      function_ids.value = []
    }
  },
)

const permissions = ref({
  modules: [
    {
      module_name: 'Product',
      functions: [
        { id: 1, function_name: 'View Product Records' },
        { id: 2, function_name: 'Insert Product Record' },
        { id: 3, function_name: 'Update Product Record' },
        { id: 4, function_name: 'Delete Product Record' },
      ],
    },
    {
      module_name: 'Favorite Product',
      functions: [
        { id: 5, function_name: 'View Favorite Product' },
        { id: 6, function_name: 'Save Favorite Product' },
        { id: 7, function_name: 'Delete Favorite Product' },
      ],
    },
    {
      module_name: 'Inquiry',
      functions: [
        { id: 8, function_name: 'View Inquiry' },
        { id: 9, function_name: 'Create Inquiry' },
        { id: 10, function_name: 'Update Inquiry' },
        { id: 11, function_name: 'Delete Inquiry' },
      ],
    },
    {
      module_name: 'Request For Quotation',
      functions: [
        { id: 12, function_name: 'View RFQ' },
        { id: 13, function_name: 'Create RFQ' },
        { id: 14, function_name: 'Update RFQ' },
        { id: 15, function_name: 'Delete RFQ' },
      ],
    },
  ],
})

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

const onUserSubmit = async () => {
  step.value = 3
}

const onPermissionSubmit = () => {
  registering.value = true

  if (!hasEnterprise.value) {
    accountStore
      .RegisterEnterprise(enterprise.value)
      .then((response) => {
        let status = Boolean(response.status === 'success')

        if (status) {
          registering.value = true
          registerUserInformationandPermissions(response.data.id)
        }
        $q.notify({
          message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the enterprise ${status ? 'has been' : 'was not'} saved.</p>`,
          color: `${status ? 'green' : 'red'}-2`,
          position: 'top-right',
          textColor: `${status ? 'green' : 'red'}`,
          html: true,
        })
      })
      .finally(() => {
        registering.value = false
      })
  } else {
    registerUserInformationandPermissions(enterprise_id.value)
  }
}

const registerUserInformationandPermissions = (enterprise_id) => {
  user.value.enterprise_id = enterprise_id
  accountStore
    .RegisterUser(user.value)
    .then((response) => {
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
                middle_name: '',
                last_name: '',
                suffix_name: '',
                birthday: '',
                email: '',
                photo: null,
                password: '',
                role: null,
                level: null,
              }
              function_ids.value = []
              hasEnterprise.value = false
              enterprise_id.value = null
              step.value = 1
            }
            $q.notify({
              message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the user permission ${status ? 'has been' : 'was not'} saved.</p>`,
              color: `${status ? 'green' : 'red'}-2`,
              position: 'top-right',
              textColor: `${status ? 'green' : 'red'}`,
              html: true,
            })
          })
          .finally(() => {
            registering.value = false
          })
      }
      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the user ${status ? 'has been' : 'was not'} saved.</p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })
    })
    .finally(() => {
      registering.value = false
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
