// See https://kit.svelte.dev/docs/types#app

import type { CompositionEventHandler } from 'svelte/elements'

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: UserInfo | null
    }
    // interface PageData {}
    // interface Platform {}
  }
  namespace svelteHTML {
    interface HTMLAttributes<T> {
      onclickOutside?: CompositionEventHandler<T>
    }
  }
  interface UserInfo {
    id: number
    userLogin: string
    displayName: string
    meta: {
      isAdmin: boolean
      role: string
      live: boolean
    }
  }
}

export {}
