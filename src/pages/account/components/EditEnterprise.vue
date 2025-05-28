<template>
  <div>
    <!-- Edit Enterprise Dialog -->
    <q-dialog v-model="enterpriseStore.ShowEnterpriseEditDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6">Edit Enterprise</div>
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
            <div class="col-12">
              <q-skeleton height="45px" />
            </div>
            <div class="col-12">
              <q-skeleton height="45px" />
            </div>
          </div>
          <div class="row justify-end q-mt-md q-gutter-x-md">
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
          </div>
        </q-card-section>

        <q-card-section v-else>
          <q-form @submit="saveEnterpriseChanges">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="editForm.name"
                  label="Enterprise Name *"
                  :rules="[(val) => !!val || 'Enterprise name is required']"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="editForm.industry_type"
                  outlined
                  dense
                  :options="categories"
                  label="Category *"
                  :rules="[(val) => !!val || 'Category is required']"
                  lazy-rules
                  use-input
                  clearable
                  input-debounce="0"
                  @filter="filterFn"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="editForm.email"
                  label="Email *"
                  :rules="[
                    (val) => !!val || 'Email is required',
                    (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email',
                  ]"
                  outlined
                  dense
                />
              </div>
              <div class="col-12">
                <q-input v-model="editForm.website" label="Website" outlined dense />
              </div>
              <div class="col-12">
                <q-input
                  v-model="editForm.address"
                  type="textarea"
                  label="Address"
                  outlined
                  dense
                  autogrow
                />
              </div>
            </div>
            <div></div>

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
import { useEnterpriseStore } from 'src/stores/enterprise'
import { useQuasar } from 'quasar'
const enterpriseStore = useEnterpriseStore()
const $q = useQuasar()

const editForm = ref({
  name: '',
  industry_type: '',
  email: '',
  website: '',
  address: '',
})

const categoryOptions = [
  'Food',
  'Non-Food',
  'Food & Non-Food',
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

// Define a reactive variable to hold the list of categories
const categories = ref(categoryOptions)

// Define a function to filter the categories based on user input
const filterFn = (val, update) => {
  // If the input value is empty, reset the categories to the full list
  if (val === '') {
    update(() => {
      categories.value = categoryOptions // Reset categories to the original list
    })
    return // Exit the function
  }

  // Otherwise, filter the categories based on the input value
  update(() => {
    const needle = val.toLowerCase() // Convert the input value to lowercase for case-insensitive matching
    categories.value = categoryOptions.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1, // Check if the category contains the input value
    )
  })
}

// Define a reactive variable to track the loading state of the component
const loading = ref(true)

// Lifecycle hook that runs when the component is mounted
onMounted(() => {
  // Fetch vendor details using the enterpriseStore and the current enterprise's ID
  enterpriseStore
    .GetEnterprise({ id: enterpriseStore.EnterpriseDetails.id })
    .then((response) => {
      // Check if the response status is successful
      if (response.status === 'success') {
        // Populate the edit form with the fetched vendor data
        editForm.value = response.data
      }
    })
    .finally(() => {
      // Set the loading state to false after the operation is complete
      loading.value = false
    })
})

// Define a reactive variable to track the loading state of the save button
const btnLoading = ref(false)

// Function to save changes made to the enterprise
const saveEnterpriseChanges = () => {
  // Set the loading state for the save button to true
  btnLoading.value = true
  // Remove the status property from the edit form before saving
  delete editForm.value.status
  // Update the enterprise details using the enterpriseStore
  enterpriseStore
    .UpdateEnterprise(editForm.value)
    .then((response) => {
      // Check if the response status is successful
      const status = Boolean(response.status === 'success')
      if (status) {
        // Update the enterprise details in the enterpriseStore
        enterpriseStore.EnterpriseDetails = response.data
        // Find the index of the updated enterprise in the vendor list
        let index = enterpriseStore.EnterpriseList.findIndex(
          (enterprise) => enterprise.id === response.data.id,
        )
        if (index !== -1) {
          // Update the vendor list with the new enterprise details
          enterpriseStore.EnterpriseList[index].website = editForm.value.website
          enterpriseStore.EnterpriseList[index].email = editForm.value.email
          enterpriseStore.EnterpriseList[index].name = editForm.value.name
        }
      }

      // Display a notification indicating whether the update was successful or not
      $q.notify({
        message: `<p class='q-mb-none'><b>${status ? 'Success' : 'Fail'}!</b> the enterprise ${status ? 'has been' : 'was not'} updated.</p>`,
        color: `${status ? 'green' : 'red'}-2`,
        position: 'top-right',
        textColor: `${status ? 'green' : 'red'}`,
        html: true,
      })
    })
    .catch((error) => {
      // Log any errors that occur during the update process
      console.error('Error updating enterprise:', error)
    })
    .finally(() => {
      // Set the loading state for the save button to false after the operation
      btnLoading.value = false
    })
}
</script>
