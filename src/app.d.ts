// See https://kit.svelte.dev/docs/types#app
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
  namespace svelte.JSX {
    interface HTMLProps<T> {
      onclick_outside?: (event: Event) => void
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
