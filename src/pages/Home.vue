<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8">Latihan Vue</h1>
    
    <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Pinia Counter</h2>
      <div class="flex items-center justify-center gap-4">
        <button @click="counterStore.decrement()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">-</button>
        <span class="text-2xl font-bold">{{ counterStore.count }}</span>
        <button @click="counterStore.increment()" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">+</button>
      </div>
      <p class="mt-2 text-center">Double value: {{ counterStore.doubleCount }}</p>
    </div>
    
    <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Axios Example</h2>
      <button @click="fetchData" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full">
        Fetch Data
      </button>
      <div v-if="loading" class="mt-4 text-center">Loading...</div>
      <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
      <div v-if="data" class="mt-4">
        <pre class="bg-gray-200 dark:bg-gray-700 p-4 rounded overflow-auto">{{ JSON.stringify(data, null, 2) }}</pre>
      </div>
    </div>
    
    <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Router Example</h2>
      <router-link to="/about" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded block text-center">
        Go to About
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useCounterStore } from '../stores/counter'

const counterStore = useCounterStore()

const data = ref(null)
const loading = ref(false)
const error = ref('')

const fetchData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.get('https://api.vue.xpqx.xyz/')
    data.value = response.data
  } catch (err) {
    error.value = 'Failed to fetch data'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script> 