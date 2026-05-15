<script setup lang="ts">
  import type { DashboardInfoResponseDto } from '~~/shared/dto';

  const { session } = useUserSession();
  const user = session.value?.user;

  const { data: dashboardInfo } = await useFetch<DashboardInfoResponseDto>('/api/dashboard');
  const { activePollsCount, closedPollsCount, totalVotesCount, userCount } =
    dashboardInfo.value ?? {};

  const dashboardCards = computed(() => [
    {
      title: 'Active Polls',
      icon: 'i-lucide-list-checks',
      value: activePollsCount,
      color: 'primary',
    },
    {
      title: 'Closed Polls',
      icon: 'i-lucide-history',
      value: closedPollsCount,
      color: 'muted',
    },
    {
      title: 'Total Votes',
      icon: 'i-lucide-trending-up',
      value: totalVotesCount,
      color: 'success',
    },
    {
      title: 'Total Users',
      icon: 'i-lucide-users',
      value: userCount,
      color: 'warning',
    },
  ]);
</script>

<template>
  <div class="flex grow flex-col gap-8">
    <div class="flex grow flex-col">
      <div class="flex w-full flex-col gap-2">
        <h3 class="mt-4 text-start text-3xl font-bold">Dashboard</h3>
        <p class="text-muted text-start">안녕하세요, {{ user?.nickname }}님.</p>
      </div>
    </div>
    <div class="flex grow flex-col items-center">
      <div class="flex w-full flex-row items-center justify-center gap-8">
        <UCard v-for="card in dashboardCards" :key="card.title" class="flex-1">
          <template #header>
            <div class="flex w-full flex-row items-center justify-between">
              <h4 class="font-base text-muted font-bold">{{ card.title }}</h4>
              <UIcon :name="card.icon" :class="`text-${card.color} size-5`" />
            </div>
          </template>
          <template #default>
            <p class="text-3xl font-bold">{{ card.value }}</p>
          </template>
        </UCard>
      </div>
    </div>
    <!-- Recent Active Polls -->
  </div>
</template>
