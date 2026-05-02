<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageServerData, ActionData } from './$types'

  export let data: PageServerData
  export let form: ActionData

  let videos = data.videos

  type Video = (typeof videos)[number]
  let editing: Video | null = null

  function startEdit(video: Video) {
    editing = { ...video }
  }

  function cancelEdit() {
    editing = null
  }

  $: if (form?.success) {
    editing = null
    videos = data.videos
  }
</script>

<svelte:head>
  <title>จัดการ VOD - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 min-h-[calc(100vh-10.2rem)] py-8">
  <div class="container flex flex-col gap-4 px-4">
    <h1 class="text-2xl md:text-4xl text-gray-800 font-bold">จัดการ VOD</h1>

    {#if form?.message}
      <div class="text-red-500 text-sm font-medium bg-red-50 rounded-lg p-3">
        {form.message}
      </div>
    {/if}

    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="w-full text-sm text-left text-gray-700">
        <thead class="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th class="px-4 py-3 w-16">ID</th>
            <th class="px-4 py-3">ชื่อ</th>
            <th class="px-4 py-3">Base URL</th>
            <th class="px-4 py-3 w-28">ประเภทไฟล์</th>
            <th class="px-4 py-3 w-28 text-center">เปิดทั้งหมด</th>
            <th class="px-4 py-3 w-32 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {#each videos as video (video.id)}
            <tr class="border-t border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-3 font-mono text-gray-500">{video.id}</td>
              <td class="px-4 py-3 font-medium">{video.name}</td>
              <td class="px-4 py-3 font-mono text-xs text-gray-500 max-w-xs truncate">
                {video.baseUrl}
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded text-xs font-semibold {video.fileType === 'HLS'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-blue-100 text-blue-700'}"
                >
                  {video.fileType}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                {#if video.allowAll}
                  <span class="text-green-600">&#10003;</span>
                {:else}
                  <span class="text-red-400">&#10007;</span>
                {/if}
              </td>
              <td class="px-4 py-3 text-center">
                <button
                  type="button"
                  on:click={() => startEdit(video)}
                  class="text-xs px-3 py-1.5 rounded bg-teal-500 text-white hover:bg-teal-700 transition-colors"
                >
                  แก้ไข
                </button>
              </td>
            </tr>
          {/each}
          {#if videos.length === 0}
            <tr>
              <td colspan="6" class="px-4 py-8 text-center text-gray-400">ไม่มีข้อมูล VOD</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

{#if editing}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    role="dialog"
    aria-modal="true"
  >
    <div class="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-800">แก้ไข VOD #{editing.id}</h2>
        <button
          type="button"
          on:click={cancelEdit}
          class="text-gray-400 hover:text-gray-700 text-xl leading-none"
          aria-label="ปิด"
        >
          &times;
        </button>
      </div>

      <form
        id="update-form"
        method="post"
        action="?/update"
        use:enhance={() => {
          return ({ update }) => update({ reset: false })
        }}
        class="flex flex-col gap-4"
      >
        <input type="hidden" name="id" value={editing.id} />

        <div>
          <label for="name" class="block mb-1 text-sm font-medium text-gray-700">ชื่อ</label>
          <input
            type="text"
            id="name"
            name="name"
            bind:value={editing.name}
            required
            class="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label for="baseUrl" class="block mb-1 text-sm font-medium text-gray-700">Base URL</label>
          <input
            type="text"
            id="baseUrl"
            name="baseUrl"
            bind:value={editing.baseUrl}
            required
            class="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2.5 text-sm font-mono focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label for="fileType" class="block mb-1 text-sm font-medium text-gray-700"
            >ประเภทไฟล์</label
          >
          <select
            id="fileType"
            name="fileType"
            bind:value={editing.fileType}
            class="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="HLS">HLS</option>
            <option value="MP4">MP4</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="allowAll"
            name="allowAll"
            bind:checked={editing.allowAll}
            class="w-4 h-4 rounded accent-teal-500"
          />
          <label for="allowAll" class="text-sm font-medium text-gray-700">เปิดให้ทุกคนดู</label>
        </div>
      </form>

      <div class="flex justify-between gap-3 pt-2">
        <form
          method="post"
          action="?/delete"
          use:enhance={() => {
            return ({ update }) => update({ reset: false })
          }}
        >
          <input type="hidden" name="id" value={editing.id} />
          <button
            type="submit"
            class="px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            on:click|preventDefault={(e) => {
              if (!confirm('ยืนยันการลบ VOD นี้?')) e.preventDefault()
              else e.currentTarget.closest('form')?.requestSubmit()
            }}
          >
            ลบ
          </button>
        </form>

        <div class="flex gap-3">
          <button
            type="button"
            on:click={cancelEdit}
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="update-form"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-700 transition-colors"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
