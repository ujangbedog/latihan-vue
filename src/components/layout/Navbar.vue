<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const searchQuery = ref('');
const showSearchResults = ref(false);
const searchInputRef = ref<HTMLInputElement | null>(null);

const availablePages = [
  { name: 'Home', path: '/' },
  { name: 'Users', path: '/users' },
];

const filteredPages = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return availablePages.filter(page => 
    page.name.toLowerCase().includes(query)
  );
});

const navigateToPage = (path: string) => {
  router.push(path);
  searchQuery.value = '';
  showSearchResults.value = false;
};

const handleSearchFocus = () => {
  showSearchResults.value = true;
};

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false;
  }, 200);
};

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    if (
      event.key === '/' && 
      !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')
    ) {
      event.preventDefault();
      searchInputRef.value?.focus();
    }
  });
});
</script>

<template>
  <header class="bg-black border-b border-transparent shadow-md">
    <div class="px-4 py-3 flex items-center justify-between">
      <button 
        @click="$emit('toggle-sidebar')" 
        class="md:hidden text-gray-300 hover:text-white focus:outline-none"
      >
        <Bars3Icon class="h-6 w-6" />
      </button>
      
      <div class="md:hidden text-xl font-bold text-white mr-2">Latihan Vue</div>
      
      <div class="flex items-center flex-1 max-w-md relative">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-500" />
          </div>
          <input 
            ref="searchInputRef"
            v-model="searchQuery"
            type="text" 
            placeholder="Search pages..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-md bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
          >
          
          <div 
            v-if="showSearchResults && filteredPages.length > 0" 
            class="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 border border-gray-300"
          >
            <ul class="py-1">
              <li 
                v-for="page in filteredPages" 
                :key="page.path"
                @mousedown="navigateToPage(page.path)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
              >
                {{ page.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template> 