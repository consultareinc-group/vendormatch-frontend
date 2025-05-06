<template>
  <div>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">Vendor List</div>
      </div>
      <div class="col-auto">
        <q-input v-model="vendorSearch" dense outlined placeholder="Search vendors" class="q-mr-sm">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      :rows="filteredVendors"
      :columns="vendorColumns"
      row-key="id"
      :loading="loading"
      :pagination="vendorPagination"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="props.value === 0 ? 'positive' : 'negative'" text-color="white" size="sm">
            {{ props.value === 0 ? 'Active' : 'Deactivated' }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <!-- <q-btn flat round color="primary" icon="visibility" @click="viewUserDetails(props.row)">
            <q-tooltip>View Details</q-tooltip>
          </q-btn> -->
          <q-btn flat round color="primary" icon="edit" @click="editUser(props.row)">
            <q-tooltip>Edit User</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            :color="props.row.status === 0 ? 'negative' : 'positive'"
            :icon="props.row.status === 0 ? 'block' : 'check_circle'"
            @click="showStatusDialog(props.row)"
          >
            <q-tooltip>{{ props.row.status === 0 ? 'Deactivate' : 'Activate' }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <!-- <UserDetails /> -->
    <EditUser v-if="userStore.ShowUserEditDialog" />
    <q-dialog v-model="statusDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ userStore.UserDetails.status === 0 ? 'Deactivate' : 'Activate' }} User
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          Are you sure you want to
          {{ userStore.UserDetails.status === 0 ? 'deactivate' : 'activate' }} this user?
          <div class="text-center text-bold">{{ userStore.UserDetails.full_name }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="No" color="primary" v-close-popup />
          <q-btn
            label="Yes"
            color="negative"
            :loading="loadingStatus"
            @click="toggleUserStatus()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue' // Import Vue's reactive and lifecycle functions
import { useQuasar } from 'quasar' // Import Quasar framework utilities
import EditUser from 'src/pages/account/components/EditUser.vue' // Import the EditUser component
import { useUserStore } from 'src/stores/user' // Import the user store
import { useVendorStore } from 'src/stores/vendor' // Import the vendor store
import { useBuyerStore } from 'src/stores/buyer' // Import the buyer store

const $q = useQuasar() // Initialize Quasar utilities
const userStore = useUserStore() // Access the user store
const vendorStore = useVendorStore() // Access the vendor store
const buyerStore = useBuyerStore() // Access the buyer store

const loading = ref(false) // Reactive variable to track loading state
const vendorSearch = ref('') // Reactive variable for the vendor search input

const vendorPagination = ref({
  sortBy: 'name', // Default sorting column
  descending: false, // Default sorting order
  page: 1, // Default page number
  rowsPerPage: 10, // Default rows per page
}) // Reactive variable for table pagination

// Define the table columns
const columns = [
  {
    name: 'full_name', // Column key
    label: 'Name', // Column label
    field: 'full_name', // Field to display
    sortable: true, // Enable sorting
    align: 'left', // Align content to the left
  },
  {
    name: 'enterprise_name',
    label: 'Enterprise',
    field: 'enterprise_name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    sortable: true,
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
    align: 'center',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  },
]

const users = ref(vendorStore.VendorList) // Reactive variable for the vendor list

const vendorColumns = columns // Assign columns to vendorColumns

// Function to fetch vendors recursively
const getVendors = () => {
  vendorStore
    .GetVendors(`offset=${vendorStore.VendorList.length}`) // Fetch vendors with offset
    .then((response) => {
      vendorStore.VendorList = [...vendorStore.VendorList, ...response.data] // Append new vendors to the list

      users.value = vendorStore.VendorList // Update the users list

      if (response.data.length) {
        getVendors() // Fetch more vendors if data exists
      }
    })
    .catch((error) => {
      console.error('Error fetching vendors:', error) // Log errors
    })
    .finally(() => {
      loading.value = false // Set loading to false after fetching
    })
}

// Lifecycle hook to fetch vendors on component mount
onMounted(() => {
  loading.value = true // Set loading to true
  getVendors() // Fetch vendors
})

// Computed property to filter vendors based on search input
const filteredVendors = computed(() => {
  return users.value.filter((user) => {
    const searchTerm = vendorSearch.value.toLowerCase() // Convert search term to lowercase
    return (
      user.full_name.toLowerCase().includes(searchTerm) || // Match full name
      user.email.toLowerCase().includes(searchTerm) || // Match email
      user.enterprise_name.toLowerCase().includes(searchTerm) // Match enterprise name
    )
  })
})

// Function to open the edit user dialog
const editUser = (user) => {
  userStore.UserDetails = user // Set the selected user details in the store
  userStore.ShowUserEditDialog = true // Show the edit user dialog
}

const statusDialog = ref(false) // Reactive variable for the status dialog visibility

// Function to show the status dialog
const showStatusDialog = (user) => {
  userStore.UserDetails = user // Set the selected user details in the store
  statusDialog.value = true // Show the status dialog
}

const loadingStatus = ref(false) // Reactive variable to track status change loading

// Function to toggle user status
const toggleUserStatus = () => {
  loadingStatus.value = true // Set loading to true
  let userStatus = userStore.UserDetails.status === 0 ? 1 : 0 // Determine the new status
  userStore
    .ChangeStatus({ id: userStore.UserDetails.id, is_deleted: userStatus }) // Call the API to change status
    .then((response) => {
      let status = Boolean(response.status === 'success') // Check if the API call was successful
      if (status) {
        let index = users.value.findIndex((u) => u.id === userStore.UserDetails.id) // Find the user in the list
        if (index !== -1) {
          users.value[index].status = userStatus // Update the user's status
        }

        index = buyerStore.BuyerList.findIndex((u) => u.id === userStore.UserDetails.id) // Find the user in the store
        if (index !== -1) {
          buyerStore.BuyerList[index].status = userStatus // Update the user's status in the list
        }
      }

      // Show a notification based on the result
      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the user ${status ? 'has been' : 'was not'} ${userStatus ? 'deactivated' : 'activated'}.</p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })
    })
    .finally(() => {
      loadingStatus.value = false // Set loading to false
      statusDialog.value = false // Close the status dialog
    })
}
</script>
