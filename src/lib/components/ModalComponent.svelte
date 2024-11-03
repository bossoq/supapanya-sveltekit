<script lang="ts">
  import { fade } from 'svelte/transition'
  import type { Snippet } from 'svelte'
  import type { Action } from 'svelte/action'

  let { modalViewed = $bindable(), children } = $props<{
    modalViewed: boolean
    children: Snippet
  }>()

  const handleModalClass = (e: Event, disabled = false) => {
    e.preventDefault()
    if (disabled && !modalViewed) {
      return
    }
    if (modalViewed) {
      modalViewed = false
    } else {
      modalViewed = true
    }
  }

  const clickOutside: Action = (node: HTMLElement & CustomEventInit) => {
    const handleClick = (e: MouseEvent) => {
      const elem = e.target as HTMLElement
      // if (node && !node.contains(elem) && !e.defaultPrevented) {
      if (node && elem.id === 'baseBg') {
        node.dispatchEvent(new CustomEvent('clickOutside', node))
      }
    }
    $effect(() => {
      document.addEventListener('click', handleClick, true)
      return () => document.removeEventListener('click', handleClick, true)
    })
  }
</script>

<div
  class="fixed z-20 inset-0 overflow-y-auto"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
  transition:fade|global
>
  <div class="block items-end justify-center min-h-screen text-center">
    <div
      class="flex items-center justify-center w-full h-screen bg-gray-500 bg-opacity-75"
      aria-hidden="true"
      id="baseBg"
    >
      <!-- <span class="inline-block align-middle h-1/3 md:h-1/5 lg:h-screen" aria-hidden="true"
        >&#8203;</span
      > -->
      <div
        class="flex align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-fit h-fit"
        use:clickOutside
        onclickOutside={(e) => handleModalClass(e, true)}
      >
        <button
          class="absolute my-2 mx-3 sm:my-3 sm:mx-4 right-0 top-0 cursor-pointer text-black dark:text-white"
          onclick={handleModalClass}
        >
          x
        </button>
        <div class="bg-white px-4 pt-2 pb-4 sm:pt-5 sm:p-6 sm:pb-4 dark:bg-slate-800">
          <div class="flex items-start justify-center">
            <div class="container mt-3 text-center sm:mt-0 sm:mx-4 sm:text-left dark:text-white">
              {@render children()}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
