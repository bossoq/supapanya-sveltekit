<script lang="ts">
  import TipTap from '$lib/components/TipTap.svelte'
  import Flatpickr from 'svelte-flatpickr'
  import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
  import 'flatpickr/dist/flatpickr.css'
  import { toastsList } from '$lib/store'
  import type { PageServerData } from './$types'
  import type { JSONContent } from '@tiptap/core'

  export let data: PageServerData
  const { user, props } = data
  let blog = props.blog
  let fileInput: HTMLInputElement
  let content: JSONContent = blog.postContent as JSONContent

  const handleClickUpload = () => {
    if (fileInput) {
      fileInput.click()
    }
  }
  const handleChangeFile = async () => {
    const file = fileInput.files && fileInput.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    formData.append('imageType', 'preview')
    const response = await fetch('/api/processImage', {
      method: 'POST',
      body: formData
    })
    const { success, image }: { success: boolean; image: string } = await response.json()
    if (success) {
      blog.postPicture = image
    } else {
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          message: 'อัพโหลดรูปภาพไม่สำเร็จ',
          type: 'error'
        }
      ])
    }
  }
  const handleDeletePostPicture = () => {
    blog.postPicture = ''
  }
  const handleSaveContent = (payload: JSONContent) => {
    blog.postContent = payload
  }
  const handleUpdateBlog = async (e: Event) => {
    e.preventDefault()
    const response = await fetch('/api/blogUpdate', {
      method: 'POST',
      body: JSON.stringify({
        blog,
        user
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (data.success) {
      blog = data.blog
      content = blog.postContent as JSONContent
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          message: 'บันทึกบทความสำเร็จ',
          type: 'success'
        }
      ])
    } else {
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          message: 'บันทึกบทความไม่สำเร็จ',
          type: 'error'
        }
      ])
    }
  }

  const dateOptions = {
    allowInput: true,
    dateFormat: 'd-m-Y H:i',
    defaultDate: blog.postDate,
    enableTime: true
  }
</script>

<svelte:head>
  <title>แก้ไข - {blog.postTitle} - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)] pt-4">
  <div class="container flex flex-col">
    <h1 class="sm:text-2xl text-4xl font-bold text-center">แก้ไขบทความ</h1>
    <form class="flex flex-col gap-4 text-gray-800 py-4" onsubmit={handleUpdateBlog}>
      <div class="w-full flex gap-2 items-center justify-center">
        <label for="postTitle" class="min-w-fit w-28 text-md block font-bold tracking-wide">
          ชื่อบทความ
        </label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          maxlength="100"
          class="text-md block w-full appearance-none rounded border border-gray-200 px-4 py-3 leading-tight focus:border-gray-500 focus:bg-white focus:outline-none invalid:text-red-600"
          bind:value={blog.postTitle}
        />
      </div>
      <div class="w-full flex gap-2 items-center justify-center">
        <label for="postLink" class="min-w-fit w-28 text-md block font-bold tracking-wide">
          ลิงค์บทความ
        </label>
        <input
          type="text"
          id="postLink"
          name="postLink"
          pattern="[a-zA-Z0-9\-]+"
          maxlength="100"
          class="text-md block w-full appearance-none rounded border border-gray-200 px-4 py-3 leading-tight focus:border-gray-500 focus:bg-white focus:outline-none invalid:text-red-600"
          bind:value={blog.postLink}
        />
      </div>
      <div class="w-full flex gap-2 items-center justify-center">
        <label for="postDate" class="min-w-fit w-28 text-md block font-bold tracking-wide">
          วันที่บทความ
        </label>
        <Flatpickr
          class="text-md block w-full appearance-none rounded border border-gray-200 px-4 py-3 leading-tight focus:border-gray-500 focus:bg-white focus:outline-none"
          id="postDate"
          name="postDate"
          bind:value={blog.postDate}
          options={dateOptions}
        />
      </div>
      <div class="w-full flex flex-col gap-2 justify-center">
        <section class="flex flex-row items-center justify-between">
          <label for="postPicture" class="min-w-fit w-28 text-md block font-bold tracking-wide">
            รูปภาพตัวอย่าง
          </label>
          {#if blog.postPicture !== ''}
            <button
              class="bg-red-400 text-white p-1 hover:bg-red-700 transition-all ease-in-out duration-300"
              aria-label="ลบรูป"
              onclick={handleDeletePostPicture}
            >
              <svg class="aspect-square w-4" fill="currentColor">
                <use xlink:href="{remixiconUrl}#ri-delete-bin-line" />
              </svg>
            </button>
          {/if}
        </section>
        <button
          type="button"
          aria-label="upload post picture"
          class="h-56 text-md flex flex-col items-center justify-center w-full appearance-none rounded border border-gray-200 px-4 py-3 leading-tight focus:border-gray-500 focus:bg-white focus:outline-none text-slate-500 hover:text-slate-800 transition-all ease-in-out duration-200"
          onclick={handleClickUpload}
        >
          {#if blog.postPicture === ''}
            <svg class="aspect-square w-40" fill="currentColor">
              <use xlink:href="{remixiconUrl}#ri-image-add-fill" />
            </svg>
            <span class="font-medium text-lg">อัพโหลดรูปภาพ</span>
          {:else}
            <img
              src={blog.postPicture}
              alt="postPicture"
              class="object-contain h-56 rounded-lg"
              loading="lazy"
            />
          {/if}
          <input
            type="file"
            id="postLink"
            name="postLink"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            class="hidden"
            bind:this={fileInput}
            onchange={handleChangeFile}
          />
        </button>
      </div>
      <div class="w-full flex flex-col gap-2 justify-center">
        <label for="postExcerpt" class="min-w-fit w-28 text-md block font-bold tracking-wide">
          เนื้อหาย่อ
          <span class="text-xs text-gray-500">(ไม่เกิน 500 ตัวอักษร)</span>
        </label>
        <textarea
          id="postExcerpt"
          name="postExcerpt"
          rows="5"
          maxlength="500"
          class="text-md block w-full appearance-none rounded border border-gray-200 px-4 py-3 leading-tight focus:border-gray-500 focus:bg-white focus:outline-none invalid:text-red-600"
          bind:value={blog.postExcerpt}
        ></textarea>
      </div>
      <div class="w-full flex flex-col gap-2 justify-center">
        <label for="postContent" class="min-w-fit w-28 text-md block font-bold tracking-wide">
          เนื้อหา
        </label>
        <TipTap bind:content handleSave={handleSaveContent} autoSave />
      </div>
      <div class="w-full flex flex-col gap-2 justify-center">
        <button
          type="submit"
          class="bg-teal-500 text-white p-3 rounded hover:bg-teal-700 transition-all ease-in-out duration-300"
        >
          บันทึก
        </button>
      </div>
    </form>
  </div>
</div>
