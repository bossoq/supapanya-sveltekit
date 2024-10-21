// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: UserInfo
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
    username: string
    role: string
  }
}

export {}
