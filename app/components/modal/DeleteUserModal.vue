<script setup lang="ts">
  import type { User } from '~/types/users';

  interface DeleteUserModalProps {
    fetchUrl: string;
  }

  const { fetchUrl } = defineProps<DeleteUserModalProps>();

  const emit = defineEmits<{
    (e: 'submit'): void;
  }>();

  const user = defineModel<User | null>('user');
  const isDeleteModalOpen = defineModel<boolean>('open');

  const toast = useToast();
  const pending = ref<boolean>(false);

  async function onDeleteSubmit() {
    if (!user.value?.id) {
      toast.add({
        title: 'Error',
        description: 'User not found',
        type: 'foreground',
        color: 'error',
      });
      return;
    }

    pending.value = true;
    try {
      await $fetch(fetchUrl, {
        method: 'DELETE',
        body: {
          userId: user.value?.id,
        },
      });

      toast.add({
        title: 'Success',
        description: 'User deleted successfully',
        type: 'foreground',
        color: 'success',
      });
    } catch (error) {
      console.error(error);
      toast.add({
        title: 'Error',
        description: 'Failed to delete user',
        type: 'foreground',
        color: 'error',
      });
    } finally {
      pending.value = false;
      isDeleteModalOpen.value = false;
      emit('submit');
    }
  }
</script>

<template>
  <UModal
    v-model:open="isDeleteModalOpen"
    title="Delete User"
    :ui="{
      footer: 'justify-end',
    }"
  >
    <template #body>
      <p class="text-muted">
        Are you sure you want to delete <strong>{{ user?.name }}</strong> ({{ user?.email }})?
      </p>
    </template>
    <template #footer>
      <UForm id="delete-form" type="submit" class="flex flex-row gap-2" @submit="onDeleteSubmit">
        <UButton type="button" color="neutral" variant="outline" @click="isDeleteModalOpen = false">
          Cancel
        </UButton>
        <UButton type="submit" color="error" :loading="pending">Delete</UButton>
      </UForm>
    </template>
  </UModal>
</template>
