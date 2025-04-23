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
          <q-btn flat round color="warning" icon="edit" @click="editUser(props.row)">
            <q-tooltip>Edit User</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            :color="props.row.status === 0 ? 'negative' : 'positive'"
            :icon="props.row.status === 0 ? 'block' : 'check_circle'"
            @click="toggleUserStatus(props.row)"
          >
            <q-tooltip>{{ props.row.status === 0 ? 'Deactivate' : 'Activate' }}</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <EditUser v-if="userStore.ShowUserEditDialog" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { useQuasar } from 'quasar'
import EditUser from 'src/pages/user-management/components/EditUser.vue'
import { useBuyerStore } from 'src/stores/buyer'
import { useUserStore } from 'src/stores/user'
// const $q = useQuasar()
const buyerStore = useBuyerStore()
const userStore = useUserStore()

const buyerSearch = ref('')
const loading = ref(false)

const buyerPagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
})

const columns = [
  {
    name: 'full_name',
    label: 'Name',
    field: 'full_name',
    sortable: true,
    align: 'left',
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
]

const users = ref(buyerStore.BuyerList)

const buyerColumns = columns

const getBuyers = () => {
  buyerStore
    .GetBuyers(`offset=${buyerStore.BuyerList.length}`)
    .then((response) => {
      buyerStore.BuyerList = [...buyerStore.BuyerList, ...response.data]

      users.value = buyerStore.BuyerList

      if (response.data.length) {
        getBuyers()
      }
    })
    .catch((error) => {
      console.error('Error fetching vendors:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  loading.value = true
  getBuyers()
})

const filteredBuyers = computed(() => {
  return users.value.filter((user) => {
    const searchTerm = buyerSearch.value.toLowerCase()
    return (
      user.full_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.enterprise_name.toLowerCase().includes(searchTerm)
    )
  })
})

// const viewUserDetails = (user) => {
//   selectedUser.value = user
//   showDetailsDialog.value = false
// }

const editUser = (user) => {
  userStore.UserDetails = user
  userStore.ShowUserEditDialog = true
}

const toggleUserStatus = async (user) => {
  console.log(user)
  // try {
  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 1000))
  //   const newStatus = user.status === 0 ? 'Inactive' : 0
  //   user.status = newStatus
  //   $q.notify({
  //     type: 'positive',
  //     message: `User status updated to ${newStatus}`,
  //   })
  // } catch (error) {
  //   $q.notify({
  //     type: 'negative',
  //     message: 'Failed to update user status ' + error.message,
  //   })
  // }
}
</script>
