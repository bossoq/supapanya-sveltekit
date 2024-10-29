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
  interface ToastNotify {
    uuid: string
    type: string
    message: string
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
  interface VideoData {
    id: number
    title: string
    url: string
    fileType: string
  }
}

export {}
