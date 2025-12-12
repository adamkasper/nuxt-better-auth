<script setup lang="ts">
import { computed, ref } from 'vue'

interface ProviderRow {
  id: string
  name: string
  href: string
}

const query = ref('')

const { data: providers } = await useFetch<ProviderRow[]>('/api/better-auth/providers', {
  default: () => [],
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q)
    return providers.value
  return providers.value.filter(p => p.id.includes(q) || p.name.toLowerCase().includes(q))
})
</script>

<template>
  <div class="not-prose">
    <div class="flex items-center gap-2">
      <label class="text-sm text-muted">
        Filter
      </label>
      <input
        v-model="query"
        type="text"
        placeholder="github, google, ..."
        class="w-full max-w-sm rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm"
      >
      <div class="text-sm text-muted whitespace-nowrap">
        {{ filtered.length }} / {{ providers.length }}
      </div>
    </div>

    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <a
        v-for="p in filtered"
        :key="p.id"
        :href="p.href"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between gap-3 rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm hover:bg-[var(--ui-bg-elevated)]"
      >
        <span class="font-medium text-highlighted">{{ p.name }}</span>
        <span class="text-muted">Docs</span>
      </a>
    </div>
  </div>
</template>
