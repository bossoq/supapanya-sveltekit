<script lang="ts">
  import type { Writable } from 'svelte/store'
  import { fade, slide } from 'svelte/transition'

  export let toastsList: Writable<ToastNotify[]>
  toastsList.subscribe((value) => {
    setTimeout(() => {
      toastsList.update((toastsList) =>
        toastsList.filter((notification) => notification.uuid !== value[0].uuid)
      )
    }, 10 * 1000)
  })

  const handleNotification = (uuid: string) => {
    toastsList.update((toastsList) =>
      toastsList.filter((notification) => notification.uuid !== uuid)
    )
  }
</script>

<div
  class="fixed bottom-4 left-4 z-20 overflow-y-auto"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
>
  {#each $toastsList as notification}
    <div
      id="toast-{notification.type}"
      class="mb-4 flex w-full items-center rounded-lg bg-white p-4 text-gray-500 shadow"
      role="alert"
      in:slide={{ delay: 250, duration: 300, axis: 'y' }}
      out:fade={{ delay: 0, duration: 300 }}
    >
      <div
        class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg {notification.type ===
        'success'
          ? 'bg-green-100 text-green-500'
          : notification.type === 'danger'
          ? 'bg-red-100 text-red-500'
          : 'bg-orange-100 text-orange-500'}"
      >
        {#if notification.type === 'success'}
          <svg
            class="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
            />
          </svg>
          <span class="sr-only">Check icon</span>
        {:else if notification.type === 'danger'}
          <svg
            class="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
            />
          </svg>
          <span class="sr-only">Error icon</span>
        {:else}
          <svg
            class="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
            />
          </svg>
          <span class="sr-only">Warning icon</span>
        {/if}
      </div>
      <p class="mx-3 text-sm font-normal">{notification.message}</p>
      <button
        type="button"
        class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
        data-dismiss-target="#toast-{notification.type}"
        aria-label="Close"
        on:click|preventDefault={() => handleNotification(notification.uuid)}
      >
        <span class="sr-only">Close</span>
        <svg
          class="h-3 w-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  {/each}
</div>
