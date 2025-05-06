<template>
  <div>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">Buyer List</div>
      </div>
      <div class="col-auto">
        <q-input v-model="buyerSearch" dense outlined placeholder="Search buyers" class="q-mr-sm">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      :rows="filteredBuyers"
      :columns="buyerColumns"
      row-key="id"
      :loading="loading"
      :pagination="buyerPagination"
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
import { ref, computed, onMounted } from 'vue' // Import Vue's reactive and lifecycle utilities
import { useQuasar } from 'quasar' // Import Quasar framework utilities
import EditUser from 'src/pages/user-management/components/EditUser.vue' // Import the EditUser component
import { useBuyerStore } from 'src/stores/buyer' // Import the buyer store
import { useUserStore } from 'src/stores/user' // Import the user store
import { useVendorStore } from 'src/stores/vendor' // Import the vendor store

const $q = useQuasar() // Initialize Quasar utilities
const buyerStore = useBuyerStore() // Access the buyer store
const userStore = useUserStore() // Access the user store
const vendorStore = useVendorStore() // Access the vendor store

const buyerSearch = ref('') // Reactive variable for the buyer search input
const loading = ref(false) // Reactive variable to track loading state

const buyerPagination = ref({
  sortBy: 'name', // Default sorting column
  descending: false, // Default sorting order
  page: 1, // Default page number
  rowsPerPage: 10, // Default number of rows per page
}) // Reactive variable for table pagination settings

const columns = [
  {
    name: 'full_name', // Column identifier
    label: 'Name', // Column label
    field: 'full_name', // Field in the data to display
    sortable: true, // Allow sorting by this column
    align: 'left', // Align content to the left
  },
  {
    name: 'enterprise',
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
] // Define table columns

const users = ref(buyerStore.BuyerList) // Reactive variable for the list of buyers

const buyerColumns = columns // Assign columns to buyerColumns for table usage

const getBuyers = () => {
  buyerStore
    .GetBuyers(`offset=${buyerStore.BuyerList.length}`) // Fetch buyers with pagination offset
    .then((response) => {
      buyerStore.BuyerList = [...buyerStore.BuyerList, ...response.data] // Append new buyers to the list

      users.value = buyerStore.BuyerList // Update the reactive users list

      if (response.data.length) {
        getBuyers() // Recursively fetch more buyers if data exists
      }
    })
    .catch((error) => {
      console.error('Error fetching vendors:', error) // Log errors
    })
    .finally(() => {
      loading.value = false // Set loading to false after fetching
    })
}

onMounted(() => {
  loading.value = true // Set loading to true when the component is mounted
  getBuyers() // Fetch the initial list of buyers
})

const filteredBuyers = computed(() => {
  return users.value.filter((user) => {
    const searchTerm = buyerSearch.value.toLowerCase() // Convert search term to lowercase
    return (
      user.full_name.toLowerCase().includes(searchTerm) || // Match full name
      user.email.toLowerCase().includes(searchTerm) || // Match email
      user.enterprise_name.toLowerCase().includes(searchTerm) // Match enterprise name
    )
  })
}) // Computed property to filter buyers based on the search term

const editUser = (user) => {
  userStore.UserDetails = user // Set the selected user details in the store
  userStore.ShowUserEditDialog = true // Show the user edit dialog
}

const statusDialog = ref(false) // Reactive variable for the status dialog visibility
const showStatusDialog = (user) => {
  userStore.UserDetails = user // Set the selected user details in the store
  statusDialog.value = true // Show the status dialog
}

const loadingStatus = ref(false) // Reactive variable to track status change loading
const toggleUserStatus = () => {
  loadingStatus.value = true // Set loading to true during status change
  let userStatus = userStore.UserDetails.status === 0 ? 1 : 0 // Toggle user status
  userStore
    .ChangeStatus({ id: userStore.UserDetails.id, is_deleted: userStatus }) // Call API to change user status
    .then((response) => {
      let status = Boolean(response.status === 'success') // Check if the API call was successful
      if (status) {
        let index = users.value.findIndex((u) => u.id === userStore.UserDetails.id) // Find the user in the list
        if (index !== -1) {
          users.value[index].status = userStatus // Update the user's status in the list
        }

        index = vendorStore.VendorList.findIndex((u) => u.id === userStore.UserDetails.id) // Find the user in the store
        if (index !== -1) {
          vendorStore.VendorList[index].status = userStatus // Update the user's status in the list
        }
      }

      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the user ${status ? 'has been' : 'was not'} ${userStatus ? 'deactivated' : 'activated'}.</p>`, // Notify the user of the result
        color: `${status ? 'green' : 'red'}-2`, // Set notification color
        position: 'top-right', // Set notification position
        textColor: `${status ? 'green' : 'red'}`, // Set notification text color
        html: true, // Allow HTML in the notification
      })
    })
    .finally(() => {
      loadingStatus.value = false // Set loading to false after status change
      statusDialog.value = false // Hide the status dialog
    })
}
</script>
