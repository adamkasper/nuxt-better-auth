<script setup lang="ts">
import { computed, ref } from 'vue'

interface PluginRow {
  name: string
  slug: string
  href: string
}

const query = ref('')

const { data: pluginRows } = await useFetch<PluginRow[]>('/api/better-auth/plugins', {
  default: () => [],
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q)
    return pluginRows.value
  return pluginRows.value.filter(p =>
    p.slug.includes(q)
    || p.name.toLowerCase().includes(q)
    || p.href.toLowerCase().includes(q),
  )
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
        placeholder="twoFactor, organization, ..."
        class="w-full max-w-sm rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm"
      >
      <div class="text-sm text-muted whitespace-nowrap">
        {{ filtered.length }} / {{ pluginRows.length }}
      </div>
    </div>

    <div class="mt-4 overflow-x-auto rounded-md border border-[var(--ui-border)]">
      <table class="min-w-full text-sm">
        <thead class="bg-[var(--ui-bg-muted)]">
          <tr class="text-left">
            <th class="px-3 py-2 font-semibold text-highlighted">
              Plugin
            </th>
            <th class="px-3 py-2 font-semibold text-highlighted">
              Path
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in filtered"
            :key="p.slug"
            class="border-t border-[var(--ui-border)]"
          >
            <td class="px-3 py-2">
              <a
                :href="p.href"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-primary hover:underline"
              >
                {{ p.name }}
              </a>
            </td>
            <td class="px-3 py-2 font-mono text-xs">
              /plugins/{{ p.slug }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
