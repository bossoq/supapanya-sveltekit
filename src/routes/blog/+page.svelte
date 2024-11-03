<script lang="ts">
  import ModalComponent from '$lib/components/ModalComponent.svelte'
  import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
  import { toastsList } from '$lib/store'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  const { user, props } = data
  let modalViewed = false
  let blogIdDelete: number | null = null
  $: !modalViewed && (blogIdDelete = null)

  const handleDeleteButton = (e: Event, id: number) => {
    e.preventDefault()
    modalViewed = true
    blogIdDelete = id
  }
  const handleDeleteConfirm = async (e: Event) => {
    e.preventDefault()
    modalViewed = false
    const response = await fetch('/api/blogDelete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: blogIdDelete, user })
    })
    const data = await response.json()
    if (data.success) {
      window.location.reload()
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          message: 'ลบบทความสำเร็จ',
          type: 'success'
        }
      ])
    } else {
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          message: 'ลบบทความไม่สำเร็จ',
          type: 'error'
        }
      ])
    }
  }
  const handleCancelDelete = (e: Event) => {
    e.preventDefault()
    modalViewed = false
  }
</script>

<svelte:head>
  <title>บทความที่น่าสนใจ - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)] pt-4">
  {#if modalViewed}
    <ModalComponent bind:modalViewed>
      <h3 class="mb-2 text-lg font-bold text-gray-500">ลบบทความ</h3>
      <p class="text-md mb-5 font-normal text-gray-500">คุณต้องการลบบทความนี้ใช่หรือไม่?</p>
      <section class="flex flex-row justify-center items-center">
        <button
          type="button"
          class="mr-2 inline-flex items-center rounded-lg bg-teal-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-300"
          onclick={(e) => handleDeleteConfirm(e)}
        >
          ยืนยัน
        </button>
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
          onclick={(e) => handleCancelDelete(e)}
        >
          ยกเลิก
        </button>
      </section>
    </ModalComponent>
  {/if}
  <div class="container flex flex-col">
    {#if user?.meta.isAdmin}
      <section class="absolute bottom-20 right-24">
        <button
          class="bg-teal-400 text-white p-2 rounded-full hover:bg-teal-700 transition-all ease-in-out duration-300 hover:rotate-180"
          aria-label="เขียนบทความใหม่"
          onclick={() => (window.location.href = '/blog/new')}
        >
          <svg class="aspect-square w-6" fill="currentColor">
            <use xlink:href="{remixiconUrl}#ri-add-line" />
          </svg>
        </button>
      </section>
    {/if}
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each props.blogs as blog}
        <a
          class="text-gray-800 hover:text-blue-800 transition-all ease-in-out duration-300"
          href="/blog/{blog.postLink}"
        >
          <section class="flex flex-col items-center gap-2">
            <figure>
              <img
                src={blog.postPicture}
                class="object-cover aspect-[3/2] hover:scale-105 transition-all ease-in-out duration-300"
                alt={blog.postTitle}
                loading="lazy"
              />
            </figure>
            <section class="w-full flex flex-row items-center gap-1 text-gray-500 text-sm">
              <div class="flex-1"></div>
              <div class="flex flex-row items-center gap-1">
                <span>
                  <svg class="aspect-square w-5" fill="currentColor">
                    <use xlink:href="{remixiconUrl}#ri-user-3-fill" />
                  </svg>
                </span>
                <span>{blog.user.displayName.split(' ')[0] || 'Anonymous'}</span>
                <span class="mx-1">on</span>
                <span>
                  <svg class="aspect-square w-5" fill="currentColor">
                    <use xlink:href="{remixiconUrl}#ri-time-fill" />
                  </svg>
                </span>
                <span
                  >{new Date(blog.postDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span
                >
              </div>
              {#if user?.meta.isAdmin}
                <div class="flex flex-row items-center justify-end gap-1 flex-1">
                  <button
                    class="bg-amber-400 text-white p-1 hover:bg-amber-700 transition-all ease-in-out duration-300"
                    aria-label="แก้ไขบทความ"
                    onclick={() => (window.location.href = `/blog/${blog.id}/edit`)}
                  >
                    <svg class="aspect-square w-4" fill="currentColor">
                      <use xlink:href="{remixiconUrl}#ri-pencil-line" />
                    </svg>
                  </button>
                  <button
                    class="bg-red-400 text-white p-1 hover:bg-red-700 transition-all ease-in-out duration-300"
                    aria-label="ลบบทความ"
                    onclick={(e) => handleDeleteButton(e, Number(blog.id))}
                  >
                    <svg class="aspect-square w-4" fill="currentColor">
                      <use xlink:href="{remixiconUrl}#ri-delete-bin-line" />
                    </svg>
                  </button>
                </div>
              {:else}
                <div class="flex-1"></div>
              {/if}
            </section>
            <section class="w-full">
              <h1 class="text-lg md:text-2xl font-bold">{blog.postTitle}</h1>
            </section>
            <section class="w-full">
              <p class="text-base md:text-lg">{blog.postExcerpt}...(อ่านต่อ)</p>
            </section>
          </section>
        </a>
      {/each}
    </section>
  </div>
</div>
