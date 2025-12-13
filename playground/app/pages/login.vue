<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { signIn } = useUserSession()
const toast = useToast()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

async function handleSignIn() {
  loading.value = true
  await signIn.email(
    { email: email.value, password: password.value, rememberMe: rememberMe.value },
    {
      onSuccess: () => {
        toast.add({ title: 'Success', description: 'Successfully signed in', color: 'success' })
        navigateTo('/app')
      },
      onError: (ctx) => {
        toast.add({ title: 'Error', description: ctx.error.message || 'Sign in failed', color: 'error' })
      },
    },
  )
  loading.value = false
}

async function handleSocialSignIn(provider: string) {
  try {
    await signIn.social({ provider, callbackURL: '/app' })
  }
  catch (e: any) {
    toast.add({ title: 'Error', description: e.message || `${provider} sign in failed`, color: 'error' })
  }
}

async function handlePasskeySignIn() {
  await signIn.passkey({
    onSuccess: () => {
      toast.add({ title: 'Success', description: 'Successfully signed in', color: 'success' })
      navigateTo('/app')
    },
    onError: (ctx) => {
      toast.add({ title: 'Error', description: ctx.error.message || 'Passkey sign in failed', color: 'error' })
    },
  })
}
</script>

<template>
  <UCard class="max-w-md">
    <template #header>
      <h3 class="text-lg md:text-xl font-semibold leading-none tracking-tight">
        Sign In
      </h3>
      <p class="text-xs md:text-sm text-muted-foreground">
        Enter your email below to login to your account
      </p>
    </template>

    <div class="grid gap-4">
      <div class="grid gap-2">
        <label for="email" class="text-sm font-medium leading-none">Email</label>
        <UInput id="email" v-model="email" type="email" placeholder="m@example.com" />
      </div>

      <div class="grid gap-2">
        <div class="flex items-center">
          <label for="password" class="text-sm font-medium leading-none">Password</label>
          <NuxtLink to="/forget-password" class="ml-auto inline-block text-sm underline">
            Forgot your password?
          </NuxtLink>
        </div>
        <UInput id="password" v-model="password" type="password" placeholder="password" autocomplete="password" />
      </div>

      <UCheckbox id="remember" v-model="rememberMe" label="Remember me" />

      <UButton block :loading="loading" @click="handleSignIn">
        Login
      </UButton>

      <div class="w-full gap-2 flex items-center justify-between flex-col">
        <UButton variant="outline" block @click="handleSocialSignIn('apple')">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25" /></svg>
          <span>Sign in with Apple</span>
        </UButton>

        <UButton variant="outline" block @click="handleSocialSignIn('google')">
          <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" /><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" /><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z" /><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" /></svg>
          <span>Sign in with Google</span>
        </UButton>

        <UButton variant="outline" block @click="handleSocialSignIn('vercel')">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 222" class="dark:fill-white fill-black"><path d="m128 0l128 221.705H0z" /></svg>
          <span>Sign in with Vercel</span>
        </UButton>

        <UButton variant="outline" block @click="handleSocialSignIn('github')">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" /></svg>
          <span>Sign in with GitHub</span>
        </UButton>

        <UButton variant="outline" block @click="handleSocialSignIn('microsoft')">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z" /></svg>
          <span>Sign in with Microsoft</span>
        </UButton>

        <UButton variant="outline" block @click="handlePasskeySignIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" /></svg>
          <span>Sign in with Passkey</span>
        </UButton>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-center w-full border-t pt-4">
        <p class="text-center text-xs text-neutral-500">
          built with
          <a href="https://nuxt-better-auth.onmax.me/" class="underline" target="_blank">
            <span class="dark:text-white/70 cursor-pointer">nuxt-better-auth.</span>
          </a>
        </p>
      </div>
    </template>
  </UCard>
</template>
