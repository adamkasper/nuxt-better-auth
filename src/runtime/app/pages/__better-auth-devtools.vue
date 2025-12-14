<script setup lang="ts">
definePageMeta({ layout: false })

const { data: sessionsData, refresh: refreshSessions } = await useFetch('/api/_better-auth/sessions')
const { data: usersData, refresh: refreshUsers } = await useFetch('/api/_better-auth/users')
const { data: configData } = await useFetch('/api/_better-auth/config')

const tabs = [
  { label: 'Sessions', value: 'sessions', icon: 'i-lucide-key' },
  { label: 'Users', value: 'users', icon: 'i-lucide-users' },
  { label: 'Config', value: 'config', icon: 'i-lucide-settings' },
]
const activeTab = ref('sessions')

function refreshData() {
  if (activeTab.value === 'sessions')
    refreshSessions()
  else if (activeTab.value === 'users')
    refreshUsers()
}
</script>

<template>
  <div class="min-h-screen bg-stone-950 text-stone-200 font-sans">
    <header class="flex items-center justify-between border-b border-stone-800 px-4 py-3">
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-shield-check" class="text-stone-400 size-5" />
        <span class="font-medium text-sm">Better Auth</span>
      </div>
      <UButton variant="ghost" size="xs" icon="i-lucide-refresh-cw" @click="refreshData">
        Refresh
      </UButton>
    </header>

    <div class="flex border-b border-stone-800">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
        :class="activeTab === tab.value
          ? 'text-stone-100 border-b-2 border-stone-100 -mb-px'
          : 'text-stone-500 hover:text-stone-300'"
        @click="activeTab = tab.value"
      >
        <UIcon :name="tab.icon" class="size-4" />
        {{ tab.label }}
        <span v-if="tab.value === 'sessions'" class="text-xs text-stone-500">({{ sessionsData?.sessions?.length || 0 }})</span>
        <span v-if="tab.value === 'users'" class="text-xs text-stone-500">({{ usersData?.users?.length || 0 }})</span>
      </button>
    </div>

    <main class="p-4">
      <!-- Sessions Tab -->
      <div v-if="activeTab === 'sessions'">
        <p v-if="sessionsData?.error" class="text-red-400 text-sm">
          {{ sessionsData.error }}
        </p>
        <div v-else-if="sessionsData?.sessions?.length" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-stone-800">
                <th class="text-left py-3 px-2 text-stone-500 font-medium">
                  ID
                </th>
                <th class="text-left py-3 px-2 text-stone-500 font-medium">
                  User ID
                </th>
                <th class="text-left py-3 px-2 text-stone-500 font-medium">
                  Expires
                </th>
                <th class="text-left py-3 px-2 text-stone-500 font-medium">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="session in sessionsData.sessions" :key="session.id" class="border-b border-stone-800/50 hover:bg-stone-900/50">
                <td class="py-2.5 px-2 font-mono text-xs">
                  {{ session.id?.slice(0, 12) }}...
                </td>
                <td class="py-2.5 px-2 font-mono text-xs">
                  {{ session.userId?.slice(0, 12) }}...
                </td>
                <td class="py-2.5 px-2 font-mono text-xs text-stone-400">
                  {{ session.expiresAt }}
                </td>
                <td class="py-2.5 px-2 font-mono text-xs text-stone-400">
                  {{ session.createdAt }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-stone-500 text-sm">
          No sessions found
        </p>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'">
        <p v-if="usersData?.error" class="text-red-400 text-sm">
          {{ usersData.error }}
        </p>
        <div v-else-if="usersData?.users?.length" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-stone-800">
                <th class="text-left py-3 px-2 text-stone-500 font-medium">
                  ID
                </th>
                <th class="text-left py-3 px-2 text-stone-500 font-medium">
                  Name
                </th>
                <th class="text-left py-3 px-2 text-stone-500 font-medium">
                  Email
                </th>
                <th class="text-left py-3 px-2 text-stone-500 font-medium">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in usersData.users" :key="user.id" class="border-b border-stone-800/50 hover:bg-stone-900/50">
                <td class="py-2.5 px-2 font-mono text-xs">
                  {{ user.id?.slice(0, 12) }}...
                </td>
                <td class="py-2.5 px-2">
                  {{ user.name || '-' }}
                </td>
                <td class="py-2.5 px-2 font-mono text-xs">
                  {{ user.email }}
                </td>
                <td class="py-2.5 px-2 font-mono text-xs text-stone-400">
                  {{ user.createdAt }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-stone-500 text-sm">
          No users found
        </p>
      </div>

      <!-- Config Tab -->
      <div v-if="activeTab === 'config'" class="space-y-4">
        <p v-if="configData?.error" class="text-red-400 text-sm">
          {{ configData.error }}
        </p>
        <template v-else-if="configData?.config">
          <div class="grid gap-3">
            <div class="flex items-start gap-4 py-2 border-b border-stone-800/50">
              <span class="text-stone-500 text-sm w-36 shrink-0">Base URL</span>
              <span class="font-mono text-xs">{{ configData.config.baseURL || 'auto-detect' }}</span>
            </div>
            <div class="flex items-start gap-4 py-2 border-b border-stone-800/50">
              <span class="text-stone-500 text-sm w-36 shrink-0">Base Path</span>
              <span class="font-mono text-xs">{{ configData.config.basePath }}</span>
            </div>
            <div class="flex items-start gap-4 py-2 border-b border-stone-800/50">
              <span class="text-stone-500 text-sm w-36 shrink-0">Social Providers</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="provider in configData.config.socialProviders"
                  :key="provider"
                  class="px-2 py-0.5 text-xs font-mono bg-stone-800 border border-stone-700"
                >{{ provider }}</span>
                <span v-if="!configData.config.socialProviders?.length" class="text-stone-500 text-xs">none</span>
              </div>
            </div>
            <div class="flex items-start gap-4 py-2 border-b border-stone-800/50">
              <span class="text-stone-500 text-sm w-36 shrink-0">Plugins</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="plugin in configData.config.plugins"
                  :key="plugin"
                  class="px-2 py-0.5 text-xs font-mono bg-stone-800 border border-stone-700"
                >{{ plugin }}</span>
                <span v-if="!configData.config.plugins?.length" class="text-stone-500 text-xs">none</span>
              </div>
            </div>
            <div class="flex items-start gap-4 py-2">
              <span class="text-stone-500 text-sm w-36 shrink-0">Trusted Origins</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="origin in configData.config.trustedOrigins"
                  :key="origin"
                  class="px-2 py-0.5 text-xs font-mono bg-stone-800 border border-stone-700"
                >{{ origin }}</span>
                <span v-if="!configData.config.trustedOrigins?.length" class="text-stone-500 text-xs">none</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>
