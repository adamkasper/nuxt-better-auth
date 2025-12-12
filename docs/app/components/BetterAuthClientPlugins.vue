<script setup lang="ts">
import { computed, ref } from 'vue'

interface ClientRow {
  exportName: string
  slug: string
  href: string | null
}

const query = ref('')

const { data: rows } = await useFetch<ClientRow[]>('/api/better-auth/client-plugins', {
  default: () => [],
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q)
    return rows.value
  return rows.value.filter(r =>
    r.exportName.toLowerCase().includes(q)
    || r.slug.toLowerCase().includes(q),
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
        placeholder="adminClient, inferAdditionalFields, ..."
        class="w-full max-w-sm rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm"
      >
      <div class="text-sm text-muted whitespace-nowrap">
        {{ filtered.length }} / {{ rows.length }}
      </div>
    </div>

    <div class="mt-4 overflow-x-auto rounded-md border border-[var(--ui-border)]">
      <table class="min-w-full text-sm">
        <thead class="bg-[var(--ui-bg-muted)]">
          <tr class="text-left">
            <th class="px-3 py-2 font-semibold text-highlighted">
              Export
            </th>
            <th class="px-3 py-2 font-semibold text-highlighted">
              Docs
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in filtered"
            :key="r.exportName"
            class="border-t border-[var(--ui-border)]"
          >
            <td class="px-3 py-2 font-mono">
              {{ r.exportName }}
            </td>
            <td class="px-3 py-2">
              <a
                v-if="r.href"
                :href="r.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                /plugins/{{ r.slug }}
              </a>
              <span v-else class="text-muted">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
