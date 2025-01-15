import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductStore = defineStore('products', () => {
  const products = ref([
    {
      category: "Food",
      description: "Description",
      id: "1736875333123",
      images: [new File([], "file1")], // Replace "file1" with the actual file name
      name: "Product1",
      cost: 20,
      status: "draft",
      supplierId: "current-user-id"
    },
    {
      category: "Food",
      description: "Description",
      id: "1736875340693",
      images: [new File([], "file2")], // Replace "file2" with the actual file name
      name: "Product2",
      cost: 20,
      status: "draft",
      supplierId: "current-user-id"
    },
    {
      category: "Food",
      description: "Description",
      id: "1736875344782",
      images: [new File([], "file3")], // Replace "file3" with the actual file name
      name: "Product3",
      cost: 20,
      status: "draft",
      supplierId: "current-user-id"
    },
    {
      category: "Non-Food",
      description: "Description",
      id: "1736875462097",
      images: [new File([], "file4")], // Replace "file4" with the actual file name
      name: "Product4",
      cost: 20,
      status: "draft",
      supplierId: "current-user-id"
    }
  ]);
  const loading = ref(false);

  function addProduct(product) {
    products.value.push(product);
  }

  function updateProduct(id, updates) {
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updates };
    }
  }

  return {
    products,
    loading,
    addProduct,
    updateProduct
  };
});
