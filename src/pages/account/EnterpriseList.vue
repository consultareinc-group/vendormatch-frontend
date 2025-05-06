<template>
  <div>
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6">Enterprise List</div>
      </div>
      <div class="col-auto">
        <q-input
          v-model="enterpriseSearch"
          dense
          outlined
          placeholder="Search enterprises"
          class="q-mr-sm"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      :rows="filteredEnterprises"
      :columns="enterpriseColumns"
      row-key="id"
      :loading="loading"
      :pagination="enterprisePagination"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="props.value === 'Active' ? 'positive' : 'negative'"
            text-color="white"
            size="sm"
          >
            {{ props.value === 'Active' ? 'Active' : 'Deactivated' }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <!-- <q-btn flat round color="primary" icon="visibility" @click="viewEnterpriseDetails(props.row)">
            <q-tooltip>View Details</q-tooltip>
          </q-btn> -->
          <q-btn flat round color="primary" icon="edit" @click="editEnterpise(props.row)">
            <q-tooltip>Edit User</q-tooltip>
          </q-btn>
          <!-- <q-btn
            flat
            round
            :color="props.row.status === 'Active' ? 'negative' : 'positive'"
            :icon="props.row.status === 'Active' ? 'block' : 'check_circle'"
            @click="toggleUserStatus(props.row)"
          >
            <q-tooltip>{{ props.row.status === 'Active' ? 'Deactivate' : 'Activate' }}</q-tooltip>
          </q-btn> -->
        </q-td>
      </template>
    </q-table>
    <EditEnterprise v-if="enterpriseStore.ShowEnterpriseEditDialog" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue' // Importing Vue's reactive and lifecycle functions
// import { useQuasar } from 'quasar' // Importing Quasar's utility functions (commented out)
import EditEnterprise from 'src/pages/account/components/EditEnterprise.vue' // Importing the EditEnterprise component
import { useEnterpriseStore } from 'src/stores/enterprise' // Importing the enterprise store for state management
// const $q = useQuasar() // Initializing Quasar's notification system (commented out)
const enterpriseStore = useEnterpriseStore() // Using the enterprise store instance

const enterpriseSearch = ref('') // Reactive variable for the search input
const loading = ref(false) // Reactive variable to track loading state

const enterprisePagination = ref({
  sortBy: 'name', // Default sorting column
  descending: false, // Default sorting order
  page: 1, // Default page number
  rowsPerPage: 10, // Default number of rows per page
}) // Reactive variable for table pagination settings

const enterpriseColumns = [
  {
    name: 'name', // Column name
    label: 'Enterprise', // Column label
    field: 'name', // Field in the data
    sortable: true, // Allow sorting
    align: 'left', // Text alignment
  },
  {
    name: 'industry_type',
    label: 'Industry Type',
    field: 'industry_type',
    sortable: true,
    align: 'left',
  },
  {
    name: 'address',
    label: 'Address',
    field: 'address',
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
    name: 'website',
    label: 'Website',
    field: 'website',
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
] // Array defining the columns for the table

const enterprises = ref(enterpriseStore.EnterpriseList) // Reactive variable for the list of enterprises

const getEnterprises = () => {
  enterpriseStore
    .GetEnterprises(`offset=${enterpriseStore.EnterpriseList.length}`) // Fetch enterprises with pagination
    .then((response) => {
      enterpriseStore.EnterpriseList = [...enterpriseStore.EnterpriseList, ...response.data] // Append new data to the existing list

      enterprises.value = enterpriseStore.EnterpriseList // Update the reactive enterprises variable

      if (response.data.length) {
        getEnterprises() // Recursively fetch more data if available
      }
    })
    .catch((error) => {
      console.error('Error fetching vendors:', error) // Log errors to the console
    })
    .finally(() => {
      loading.value = false // Set loading to false after the operation
    })
}

onMounted(() => {
  loading.value = true // Set loading to true when the component is mounted
  getEnterprises() // Fetch the enterprises
})

const filteredEnterprises = computed(() => {
  return enterprises.value.filter((user) => {
    const searchTerm = enterpriseSearch.value.toLowerCase() // Convert search term to lowercase
    return (
      user.email.toLowerCase().includes(searchTerm) || // Check if email matches the search term
      user.name.toLowerCase().includes(searchTerm) // Check if name matches the search term
    )
  })
}) // Computed property to filter enterprises based on the search term

const editEnterpise = (user) => {
  enterpriseStore.EnterpriseDetails = user // Set the selected enterprise details in the store
  enterpriseStore.ShowEnterpriseEditDialog = true // Show the edit dialog
}

// const toggleUserStatus = async (user) => {
//   console.log(user)
// }
</script>
