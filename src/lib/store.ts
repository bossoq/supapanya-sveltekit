import { browser } from '$app/environment'
import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

const storage = browser ? JSON.parse(window.localStorage['prefs'] || '{}') || {} : {}
// storage.darkTheme = browser
//   ? window.matchMedia('(prefers-color-scheme: dark)').matches
//     ? true
//     : false
//   : false
storage.darkTheme = false

const storeSettings = () => {
  if (browser) {
    window.localStorage['prefs'] = JSON.stringify(storage)
  }
}

export const darkTheme: Writable<boolean> = writable(storage.darkTheme ?? false)
export const toastsList: Writable<ToastNotify[]> = writable([])

darkTheme.subscribe((value) => {
  storage.darkTheme = value
  storeSettings()
})
