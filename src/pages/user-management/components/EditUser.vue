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

        <q-card-section v-if="loading">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-skeleton height="45px" width="528px" />
            </div>
            <div class="col-12 col-md-6">
              <q-skeleton height="45px" />
            </div>
            <div class="col-12 col-md-6">
              <q-skeleton height="45px" />
            </div>
            <div class="col-12 col-md-6">
              <q-skeleton height="45px" />
            </div>
            <div class="col-12 col-md-6">
              <q-skeleton height="45px" />
            </div>
          </div>
          <div class="q-mt-md">
            <q-skeleton type="QBtn" />
          </div>
          <div class="row justify-end q-mt-md q-gutter-x-md">
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
          </div>
        </q-card-section>

        <q-card-section v-else>
          <q-form @submit="saveUserChanges">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="editForm.enterprise_id"
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
              <div class="col-12 col-md-6">
                <q-input
                  v-model="editForm.first_name"
                  label="First Name *"
                  :rules="[(val) => !!val || 'First name is required']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="editForm.middle_name" label="Middle Name" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="editForm.last_name"
                  label="Last Name *"
                  :rules="[(val) => !!val || 'Last name is required']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="editForm.email"
                  type="email"
                  label="Email *"
                  :rules="[
                    (val) => !!val || 'Email is required',
                    (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email',
                  ]"
                  outlined
                  dense
                />
              </div>
            </div>
            <div><q-btn dense flat label="Change Password" no-caps></q-btn></div>

            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="negative" v-close-popup class="q-mr-sm" no-caps />
              <q-btn
                type="submit"
                label="Save Changes"
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
import { onMounted, ref } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useVendorStore } from 'src/stores/vendor'
import { useAccountStore } from 'src/stores/account'
import { useQuasar } from 'quasar'
const userStore = useUserStore()
const vendorStore = useVendorStore()
const accountStore = useAccountStore()
const $q = useQuasar()

const editForm = ref({
  enterprise_id: null,
  first_name: '',
  last_name: '',
  email: '',
})

// Define a reactive variable to track the loading state of the component
const loading = ref(true)

// Lifecycle hook that runs when the component is mounted
onMounted(() => {
  // Fetch vendor details using the vendorStore and the current user's ID
  vendorStore
    .GetVendor({ id: userStore.UserDetails.id })
    .then((response) => {
      // Check if the response status is successful
      if (response.status === 'success') {
        // Populate the edit form with the fetched vendor data
        editForm.value = response.data
        // Initialize enterprise options with the fetched enterprise details
        enterpriseOptions.value = [
          { name: response.data.enterprise_name, id: response.data.enterprise_id },
        ]
      }
    })
    .finally(() => {
      // Set the loading state to false after the operation is complete
      loading.value = false
    })
})

// Define a reactive variable to store enterprise options
const enterpriseOptions = ref([])
// Define a reactive variable to track the loading state of the enterprise search
const searchEnterpriseLoadingState = ref(false)

// Function to fetch enterprises based on a search value
const fetchEnterprises = async (val, update) => {
  // Set the loading state for enterprise search to true
  searchEnterpriseLoadingState.value = true
  try {
    // Fetch enterprises matching the search value from the accountStore
    const response = await accountStore.SearchEnterprise(`search=${val}`)
    if (response.status === 'success') {
      // Use a Set to avoid duplicate enterprise entries
      const existingIds = new Set(accountStore.Enterprises.map((enterprise) => enterprise.id))
      // Add new enterprises to the accountStore if they don't already exist
      response.data.forEach((enterprise) => {
        if (!existingIds.has(enterprise.id)) {
          accountStore.Enterprises.push(enterprise)
        }
      })

      // Update the enterprise options with the fetched data
      update(() => {
        enterpriseOptions.value = accountStore.Enterprises
      })
    }
  } finally {
    // Set the loading state for enterprise search to false after the operation
    searchEnterpriseLoadingState.value = false
  }
}

// Function to filter enterprises based on a search value
const filterEnterprise = (val, update) => {
  // If no search value is provided, reset enterprise options to all enterprises
  if (!val) {
    update(() => (enterpriseOptions.value = accountStore.Enterprises))
    return
  }

  // Filter enterprises based on the search value
  update(() => {
    enterpriseOptions.value = accountStore.Enterprises.filter((enterprise) =>
      enterprise.name.toLowerCase().includes(val.toLowerCase()),
    )
  })

  // If no matching enterprises are found, clear old data and fetch new enterprises
  if (!enterpriseOptions.value.length) {
    accountStore.Enterprises = [] // Clear old data before fetching
    fetchEnterprises(val, update)
  }
}

// Define a reactive variable to track the loading state of the save button
const btnLoading = ref(false)

// Function to save changes made to the user
const saveUserChanges = () => {
  // Set the loading state for the save button to true
  btnLoading.value = true
  // Remove the enterprise_name property from the edit form before saving
  delete editForm.value.enterprise_name
  // Update the user details using the userStore
  userStore
    .UpdateUser(editForm.value)
    .then((response) => {
      // Check if the response status is successful
      const status = Boolean(response.status === 'success')
      if (status) {
        // Update the user details in the userStore
        userStore.UserDetails = response.data
        // Find the index of the updated user in the vendor list
        let index = vendorStore.VendorList.findIndex((user) => user.id === response.data.id)
        if (index !== -1) {
          // Update the vendor list with the new user details
          vendorStore.VendorList[index].full_name =
            editForm.value.last_name + ', ' + editForm.value.first_name
          vendorStore.VendorList[index].email = editForm.value.email
          vendorStore.VendorList[index].enterprise_name =
            enterpriseOptions.value[
              enterpriseOptions.value.findIndex((e) => e.id === editForm.value.enterprise_id)
            ].name
        }
      }

      // Display a notification indicating whether the update was successful or not
      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the user ${status ? 'has been' : 'was not'} updated.</p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })
    })
    .catch((error) => {
      // Log any errors that occur during the update process
      console.error('Error updating user:', error)
    })
    .finally(() => {
      // Set the loading state for the save button to false after the operation
      btnLoading.value = false
    })
}
</script>
