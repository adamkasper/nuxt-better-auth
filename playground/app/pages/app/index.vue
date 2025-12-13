<script setup lang="ts">
const { user, signOut } = useUserSession()
const loading = ref(false)

async function handleSignOut() {
  loading.value = true
  try {
    await signOut()
    await navigateTo('/login')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <h2 class="text-2xl font-semibold mb-4">
      Protected App Page
    </h2>
    <p class="text-muted-foreground mb-2">
      Welcome to the protected area, {{ user?.name }}!
    </p>
    <p class="text-muted-foreground mb-4">
      This page requires authentication.
    </p>
    <UButton variant="outline" :loading="loading" @click="handleSignOut">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
      Sign Out
    </UButton>
  </div>
</template>
