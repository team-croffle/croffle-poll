<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';

  const navItems: NavigationMenuItem[] = [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
    },
    {
      label: 'Active Polls',
      icon: 'i-lucide-vote',
      to: '/active-polls',
    },
    {
      label: 'History',
      icon: 'i-lucide-history',
      to: '/history',
    },
    {
      label: 'Team',
      icon: 'i-lucide-users',
      to: '/team',
    },
  ];

  const footerItems: NavigationMenuItem[] = [
    {
      label: 'BlueNyang',
      to: 'https://www.bluenyang.kr',
      target: '_blank',
    },
    {
      label: 'Releases',
      to: 'https://github.com/team-croffle/croffle-poll/releases',
      target: '_blank',
    },
  ];
</script>

<template>
  <div :class="{ dark: true }" class="flex h-screen flex-row">
    <USidebar
      class="border-default flex h-full flex-col border-r"
      collapsible="none"
      side="left"
      variant="sidebar"
      :ui="{
        container: 'flex h-full flex-col',
      }"
    >
      <template #header>
        <div class="flex flex-row items-center justify-center gap-2 py-4">
          <img src="/logo.png" alt="main logo" class="size-12" />
          <div class="flex flex-col">
            <span class="text-xl font-bold">Croffle Dev.</span>
            <span class="text-muted text-sm">Development Team</span>
          </div>
        </div>
      </template>
      <template #default>
        <UNavigationMenu
          orientation="vertical"
          :items="navItems"
          :ui="{
            link: 'px-2 py-4 overflow-hidden',
          }"
        />
      </template>
      <template #footer>
        <NuxtLink
          to="/poll/new"
          class="focus:ring-primary mb-16 w-full rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          <UButton
            label="Create Poll"
            icon="i-lucide-message-square-plus"
            variant="solid"
            class="from-primary-300 to-primary-500 w-full items-center justify-center bg-linear-to-r py-4"
          />
        </NuxtLink>
      </template>
    </USidebar>
    <div class="flex grow flex-col overflow-y-auto">
      <UHeader
        :ui="{
          container: 'mx-8 max-w-[90%]',
        }"
      >
        <template #title>
          <NuxtLink to="/" class="flex flex-row items-center gap-2 focus:outline-none">
            <p class="text-2xl font-bold">
              <span>Croffle Dev. </span>
              <span class="text-primary">Poll Platform</span>
            </p>
          </NuxtLink>
        </template>
        <template #right>
          <UTooltip text="Go to GitHub" :kbds="['meta', 'G']">
            <UButton
              color="neutral"
              variant="ghost"
              to="https://github.com/team-croffle/croffle-poll/releases"
              target="_blank"
              icon="i-simple-icons-github"
              aria-label="GitHub"
            />
          </UTooltip>
        </template>
      </UHeader>
      <slot />
      <UFooter>
        <template #left>
          <p class="text-muted text-sm">
            © {{ new Date().getFullYear() }} BlueNyang. All rights reserved.
          </p>
        </template>

        <UNavigationMenu :items="footerItems" variant="link" />

        <template #right>
          <UButton
            icon="i-simple-icons-github"
            color="neutral"
            variant="ghost"
            to="https://github.com/team-croffle/croffle-poll"
            target="_blank"
            aria-label="GitHub"
          />
        </template>
      </UFooter>
    </div>
  </div>
</template>
