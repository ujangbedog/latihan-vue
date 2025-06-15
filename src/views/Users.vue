<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Table from '@/components/ui/Table.vue';
import Modal from '@/components/ui/Modal.vue';
import UserForm from '@/components/users/UserForm.vue';
import Input from '@/components/ui/Input.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { UserIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { useToast } from '@/composables/useToast';
import { userService } from '@/services';
import type { User } from '@/services';

interface UserFormInstance {
  resetSubmitting: () => void;
}
const userFormRef = ref<UserFormInstance | null>(null);

const toast = useToast();
const users = ref<User[]>([]);
const isLoadingUsers = ref(true);

const columns = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'job', label: 'Job', sortable: true },
];

const rowsPerPageOptions = [5, 10, 25, 50];
const searchQuery = ref('');
const isSearchVisible = ref(false);
const showUserModal = ref(false);
const isEditing = ref(false);
const currentUser = ref<User | undefined>(undefined);

const showDeleteModal = ref(false);
const userToDelete = ref<User | null>(null);
const isDeleting = ref(false);

const fetchUsers = async () => {
  isLoadingUsers.value = true;
  try {
    users.value = await userService.getAll();
    toast.success('Users loaded successfully');
  } catch (error) {
    toast.error('Failed to load users');
    console.error('Error fetching users:', error);
  } finally {
    isLoadingUsers.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});

const handleEdit = (row: any) => {
  if (row && typeof row.name === 'string' && typeof row.email === 'string' && typeof row.job === 'string') {
    const user: User = {
      id: row.id,
      name: row.name,
      email: row.email,
      job: row.job,
      avatar: row.avatar
    };
    currentUser.value = user;
    isEditing.value = true;
    showUserModal.value = true;
  } else {
    toast.error('Invalid user data');
  }
};

const handleDelete = (row: any) => {
  if (!row || !row.id) return;
  
  userToDelete.value = row;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!userToDelete.value || !userToDelete.value.id) return;
  
  isDeleting.value = true;
  
  try {
    await userService.delete(userToDelete.value.id);
    toast.success(`User ${userToDelete.value.name} deleted successfully`);
    users.value = users.value.filter(u => u.id !== userToDelete.value!.id);
    showDeleteModal.value = false;
  } catch (error) {
    toast.error('Failed to delete user');
    console.error('Error deleting user:', error);
  } finally {
    isDeleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
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

const updateSearchQuery = (value: string | number) => {
  searchQuery.value = typeof value === 'string' ? value : value.toString();
};

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value;
  if (!isSearchVisible.value) {
    searchQuery.value = '';
  }
};

const refreshData = () => {
  fetchUsers();
};

const addNewUser = () => {
  currentUser.value = undefined;
  isEditing.value = false;
  showUserModal.value = true;
};

const handleUserFormSubmit = async (userData: User) => {
  try {
    if (isEditing.value && currentUser.value && currentUser.value.id) {
      const updatedUser = await userService.update(currentUser.value.id, userData);
      
      const index = users.value.findIndex(u => u.id === currentUser.value!.id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      
      toast.success(`User ${userData.name} updated successfully`);
    } else {
      const newUser = await userService.create(userData);
      users.value.push(newUser);
      toast.success(`User ${userData.name} created successfully`);
    }
    
    showUserModal.value = false;
  } catch (error) {
    toast.error(isEditing.value ? 'Failed to update user' : 'Failed to create user');
    console.error('Error saving user:', error);
  } finally {
    if (userFormRef.value) {
      userFormRef.value.resetSubmitting();
    }
  }
};

const closeUserModal = () => {
  showUserModal.value = false;
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
      
      <div v-if="isLoadingUsers" class="flex justify-center items-center py-10">
        <Spinner size="md" color="white" text="Loading users..." />
      </div>
      
      <Table 
        v-else
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
          <div class="flex items-center space-x-2">
            <div class="flex-1 relative overflow-hidden transition-all duration-300" :class="{ 'w-0 flex-grow-0': !isSearchVisible, 'flex-1': isSearchVisible }">
              <transition name="slide-right">
                <div v-if="isSearchVisible" class="w-full">
                  <Input
                    v-model="searchQuery"
                    type="search"
                    placeholder="Search users..."
                    @update:modelValue="updateSearchQuery"
                    class="focus:outline-none focus:ring-1 focus:ring-offset-1"
                  />
                </div>
              </transition>
            </div>
            <div class="flex items-center space-x-2 flex-shrink-0">
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
        
        <template #cell-avatar="{ row }">
          <img 
            v-if="row.avatar" 
            :src="row.avatar" 
            :alt="row.name" 
            class="w-8 h-8 rounded-full object-cover" 
          />
          <div v-else class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
            {{ row.name.charAt(0).toUpperCase() }}
          </div>
        </template>
        
        <template #cell-name="{ value }">
          <div class="font-medium text-white">{{ value }}</div>
        </template>
        
        <template #cell-job="{ value }">
          <Badge 
            :variant="value === 'Developer' ? 'primary' : value === 'Designer' ? 'info' : value === 'Manager' ? 'success' : value === 'Marketing' ? 'warning' : 'secondary'"
            size="sm"
          >
            {{ value }}
          </Badge>
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
    
    <Modal 
      :show="showUserModal" 
      :title="isEditing ? 'Edit User' : 'Add New User'" 
      @close="closeUserModal"
    >
      <UserForm 
        ref="userFormRef"
        :user="currentUser" 
        :isEditing="isEditing"
        @submit="handleUserFormSubmit"
        @cancel="closeUserModal"
      />
    </Modal>
    
    <Modal
      :show="showDeleteModal"
      title="Confirm Delete"
      size="sm"
      @close="cancelDelete"
    >
      <div class="flex flex-col items-center text-center">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mb-4" />
        <h3 class="text-lg font-medium text-white mb-2">Delete User</h3>
        <p class="text-gray-400 mb-4">
          Are you sure you want to delete <span class="text-white font-medium">{{ userToDelete?.name }}</span>?
          <br>This action cannot be undone.
        </p>
      </div>
      
      <template #footer>
        <Button 
          variant="secondary" 
          @click="cancelDelete"
          :disabled="isDeleting"
        >
          Cancel
        </Button>
        <Button 
          variant="danger" 
          @click="confirmDelete"
          :loading="isDeleting"
          :disabled="isDeleting"
        >
          Delete
          <template #loading>
            Deleting...
          </template>
        </Button>
      </template>
    </Modal>
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