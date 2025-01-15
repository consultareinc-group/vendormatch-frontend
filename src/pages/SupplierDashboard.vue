<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Statistics Cards -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Total Products</div>
            <div class="text-h4">{{ totalProducts }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Publish Listings</div>
            <div class="text-h4">{{ activeListings }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Buyer Views</div>
            <div class="text-h4">{{ retailerViews }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stats-card">
          <q-card-section>
            <div class="text-h6">Inquiries</div>
            <div class="text-h4">{{ inquiries }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Product Management -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6">My Products</div>
              <q-btn
                color="primary"
                icon="add"
                label="Add Product"
                @click="showAddProductDialog = true"
              />
            </div>

            <q-table :rows="myProducts" :columns="columns" row-key="id" :loading="loading">
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn-group flat>
                    <q-btn
                      flat
                      round
                      color="secondary"
                      icon="visibility"
                      @click="editProduct(props.row)"
                    />
                    <q-btn flat round color="primary" icon="edit" @click="editProduct(props.row)" />
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      @click="confirmDelete(props.row)"
                    />
                  </q-btn-group>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Add/Edit Product Dialog -->
    <q-dialog v-model="showAddProductDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ editingProduct ? 'Edit' : 'Add' }} Product</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveProduct">
            <q-input
              v-model="productForm.name"
              label="Product Name"
              :rules="[(val) => !!val || 'Name is required']"
              class="q-mb-md"
            />

            <q-input
              v-model="productForm.description"
              type="textarea"
              label="Description"
              :rules="[(val) => !!val || 'Description is required']"
              class="q-mb-md"
            />

            <q-select
              v-model="productForm.category"
              :options="categories"
              label="Category"
              :rules="[(val) => !!val || 'Category is required']"
              class="q-mb-md"
            />

            <q-input
              v-model.number="productForm.price"
              type="number"
              label="Price"
              prefix="$"
              :rules="[
                (val) => !!val || 'Price is required',
                (val) => val > 0 || 'Price must be greater than 0',
              ]"
              class="q-mb-md"
            />

            <q-file
              v-model="productForm.images"
              label="Product Images"
              multiple
              accept=".jpg,.png,.jpeg"
              class="q-mb-md"
            >
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <div class="row justify-end q-mt-md">
              <q-btn flat label="Cancel" color="negative" v-close-popup class="q-mr-sm" />
              <q-btn type="submit" label="Save" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from 'src/stores/products'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const productStore = useProductStore()

const showAddProductDialog = ref(false)
const editingProduct = ref(null)

const totalProducts = ref(0)
const activeListings = ref(0)
const retailerViews = ref(0)
const inquiries = ref(0)
const loading = ref(false)

const categories = ['Food', 'Non-Food', 'Organic', 'Non-Organic']

const columns = [
  { name: 'name', label: 'Product Name', field: 'name', sortable: true, align: 'left' },
  { name: 'category', label: 'Category', field: 'category', sortable: true, align: 'left' },
  { name: 'cost', label: 'Cost', field: 'cost', sortable: true, align: 'left' },
  {
    name: 'landed_cost',
    label: 'Landed Cost',
    field: 'landed_cost',
    sortable: true,
    align: 'left',
  },
  { name: 'srp', label: 'SRP', field: 'srp', sortable: true, align: 'left' },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions' },
]

const productForm = ref({
  name: '',
  description: '',
  category: '',
  price: 0,
  images: [],
})

const myProducts = computed(() => {
  return productStore.products.filter((p) => p.supplierId === 'current-user-id')
})

const editProduct = (product) => {
  editingProduct.value = product.id
  productForm.value = { ...product }
  showAddProductDialog.value = true
}

const confirmDelete = (product) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete ${product.name}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // Handle product deletion
  })
}

const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      await productStore.updateProduct(editingProduct.value, productForm.value)
    } else {
      await productStore.addProduct({
        id: Date.now().toString(),
        ...productForm.value,
        supplierId: 'current-user-id',
        status: 'draft',
      })
    }
    showAddProductDialog.value = false
    $q.notify({
      type: 'positive',
      message: `Product ${editingProduct.value ? 'updated' : 'added'} successfully`,
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `Error saving product: ${error}`,
    })
  }
}
</script>

<style lang="scss" scoped>
.stats-card {
  background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
}
</style>
