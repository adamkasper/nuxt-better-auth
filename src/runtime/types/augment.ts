// Base types that users extend via module augmentation
// Users add fields in: shared/types/auth.d.ts

import type { ComputedRef, Ref } from 'vue'

// Base user - extend with plugin fields
export interface AuthUser {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null
}

// Base session
export interface AuthSession {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string | null
  userAgent?: string | null
}

// Composable return type (core fields only - actual composable has more from client)
export interface UserSessionComposable {
  user: Ref<AuthUser | null>
  session: Ref<AuthSession | null>
  loggedIn: ComputedRef<boolean>
  ready: ComputedRef<boolean>
  fetchSession: (options?: { headers?: HeadersInit, force?: boolean }) => Promise<void>
  signOut: () => Promise<void>
}
