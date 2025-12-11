<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('content').path('/').first())
</script>

<template>
  <UPage v-if="page">
    <UPageHero :title="page.title" :description="page.description">
      <template #links>
        <UButton to="/getting-started/installation" size="lg">
          Get Started
        </UButton>
        <UButton to="https://github.com/onmax/nuxt-better-auth" target="_blank" color="neutral" variant="subtle" size="lg">
          View on GitHub
        </UButton>
      </template>
    </UPageHero>
  </UPage>
</template>
