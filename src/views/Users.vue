<script setup lang="ts">
import { ref } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Table from '@/components/ui/Table.vue';
import { UserIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { useToast } from '../composables/useToast';

const toast = useToast();
const users = ref([
  { 
    id: 1, 
    name: 'John Smith', 
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2 hours ago'
  },
  { 
    id: 2, 
    name: 'Jane Doe', 
    email: 'jane@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '1 day ago'
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    email: 'mike@example.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '1 week ago'
  },
  { 
    id: 4, 
    name: 'Sarah Williams', 
    email: 'sarah@example.com',
    role: 'User',
    status: 'Active',
    lastLogin: '3 hours ago'
  },
  { 
    id: 5, 
    name: 'David Brown', 
    email: 'david@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '5 days ago'
  },
  { 
    id: 6, 
    name: 'Jancu Mena', 
    email: 'jancu@example.com',
    role: 'Hacker',
    status: 'Active',
    lastLogin: '8 days ago'
  }
]);

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'lastLogin', label: 'Last Login', sortable: true }
];

const rowsPerPageOptions = [5, 10, 25, 50];
const searchQuery = ref('');
const isSearchVisible = ref(false);

const handleEdit = (user: any) => {
  console.log('Edit user:', user);
  toast.info(`Editing user: ${user.name}`);
};

const handleDelete = (user: any) => {
  console.log('Delete user:', user);
  toast.warning(`Are you sure you want to delete ${user.name}?`);
};

const handleSort = (sortData: { key: string, direction: string }) => {
  console.log('Sort by:', sortData.key, 'Direction:', sortData.direction);
  toast.info(`Sorted by ${sortData.key} in ${sortData.direction} order`);
};

const handleSearch = (query: string) => {
  console.log('Search query:', query);
  if (query) {
    toast.info(`Searching for "${query}"`);
  }
};

const handlePageChange = (page: number) => {
  console.log('Page changed to:', page);
};

const handleRowsPerPageChange = (rows: number) => {
  console.log('Rows per page changed to:', rows);
  toast.info(`Showing ${rows} rows per page`);
};

const updateSearchQuery = (event: Event) => {
  const input = event.target as HTMLInputElement;
  searchQuery.value = input.value;
};

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
  if (!isSearchVisible.value) {
    searchQuery.value = '';
  }
};

const refreshData = () => {
  console.log('Refreshing data...');
  toast.success('Data refreshed successfully!');
};

const addNewUser = () => {
  toast.success('New user form opened');
};

</script>

<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">Users</h1>
      <p class="text-gray-400 mt-1">Manage system users</p>
    </div>
    
    <Card bordered>
      <div class="mb-4 pb-3 border-b border-gray-800/60 flex justify-between items-center">
        <h3 class="font-medium text-white">User List</h3>
        <div class="text-sm text-gray-400">Total: {{ users.length }} users</div>
      </div>
      
      <Table 
        :columns="columns" 
        :data="users" 
        striped 
        hoverable
        bordered
        searchable
        paginated
        :rowsPerPageOptions="rowsPerPageOptions"
        :initialRowsPerPage="5"
        :searchValue="searchQuery"
        @sort="handleSort"
        @search="handleSearch"
        @page-change="handlePageChange"
        @rows-per-page-change="handleRowsPerPageChange"
      >
        <template #search-area>
          <div class="flex space-x-2">
            <div class="flex-1 relative overflow-hidden transition-all duration-300" :class="{ 'w-0 flex-grow-0': !isSearchVisible, 'flex-1': isSearchVisible }">
              <transition name="slide-right">
                <input
                  v-if="isSearchVisible"
                  :value="searchQuery"
                  type="text"
                  placeholder="Search..."
                  class="w-full px-4 py-2 bg-black/40 border border-gray-800/60 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  @input="updateSearchQuery"
                />
              </transition>
            </div>
            <div class="flex space-x-2">
              <Button variant="secondary" rounded @click="toggleSearch">
                <MagnifyingGlassIcon class="h-5 w-5" />
              </Button>
              <Button variant="secondary" rounded @click="refreshData">
                <ArrowPathIcon class="h-5 w-5" />
              </Button>
              <Button variant="primary" rounded @click="addNewUser">
                <UserIcon class="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </template>
        
        <template #cell-name="{ value }">
          <div class="font-medium text-white">{{ value }}</div>
        </template>
        
        <template #cell-role="{ value }">
          <Badge 
            :variant="value === 'Admin' ? 'primary' : value === 'Editor' ? 'info' : value === 'Hacker' ? 'danger' : 'secondary'"
            size="sm"
          >
            {{ value }}
          </Badge>
        </template>
        
        <template #cell-status="{ value }">
          <Badge 
            :variant="value === 'Active' ? 'success' : 'secondary'"
            rounded
            size="sm"
          >
            {{ value }}
          </Badge>
        </template>
        
        <template #cell-lastLogin="{ value }">
          <span class="text-gray-400">{{ value }}</span>
        </template>
        
        <template #actions="{ row }">
          <div class="flex space-x-4">
            <button 
              @click="handleEdit(row)"
              class="text-white hover:text-blue-400 transition-all hover:scale-110"
              title="Edit user"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button 
              @click="handleDelete(row)"
              class="text-white hover:text-red-500 transition-all hover:scale-110"
              title="Delete user"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </template>
      </Table>
    </Card>
  </DashboardLayout>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style> 