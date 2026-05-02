<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageServerData, ActionData } from './$types'

  export let data: PageServerData
  export let form: ActionData

  type Video = (typeof data.videos)[number]

  $: videos = data.videos
  let editing: Video | null = null
  let creating = false

  const emptyNew = () => ({ name: '', baseUrl: '', fileType: 'HLS', allowAll: true })
  let newVideo = emptyNew()
  let newVideoUsers: typeof data.users = []
  let newVideoSelectId = ''

  $: newVideoAvailable = data.users.filter((u) => !newVideoUsers.some((v) => v.id === u.id))

  function addNewVideoUser() {
    const id = Number(newVideoSelectId)
    const user = data.users.find((u) => u.id === id)
    if (user) {
      newVideoUsers = [...newVideoUsers, user]
      newVideoSelectId = ''
    }
  }

  function removeNewVideoUser(userId: number) {
    newVideoUsers = newVideoUsers.filter((u) => u.id !== userId)
  }

  let search = ''
  let sortCol = 'id'
  let sortDir: 'asc' | 'desc' = 'asc'

  function startEdit(video: Video) {
    editing = { ...video, videoAccess: [...video.videoAccess] }
  }

  function cancelEdit() {
    editing = null
  }

  function toggleSort(col: string) {
    if (sortCol === col) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc'
    } else {
      sortCol = col
      sortDir = 'asc'
    }
  }

  function sortIcon(col: string) {
    if (sortCol !== col) return '↕'
    return sortDir === 'asc' ? '↑' : '↓'
  }

  $: filtered = videos.filter((v) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      v.name.toLowerCase().includes(q) ||
      v.baseUrl.toLowerCase().includes(q) ||
      String(v.id).includes(q)
    )
  })

  $: sorted = [...filtered].sort((a, b) => {
    let va: unknown =
      sortCol === 'accessCount'
        ? a.videoAccess.length
        : sortCol === 'datetime'
          ? sortableDateTime(a.baseUrl)
          : (a as Record<string, unknown>)[sortCol]
    let vb: unknown =
      sortCol === 'accessCount'
        ? b.videoAccess.length
        : sortCol === 'datetime'
          ? sortableDateTime(b.baseUrl)
          : (b as Record<string, unknown>)[sortCol]
    if (va === vb) return 0
    if (sortDir === 'asc') return (va as string | number) < (vb as string | number) ? -1 : 1
    return (va as string | number) > (vb as string | number) ? -1 : 1
  })

  $: availableUsers = editing
    ? data.users.filter((u) => !editing!.videoAccess.some((a) => a.userId === u.id))
    : []

  function videoUrlToDateTime(url: string): string {
    const datetimeMatch = url.match(/IKVideo_(\d{14})/)
    if (datetimeMatch) {
      const datetimeString = datetimeMatch[1]
      const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
      const datetimeObj = new Date(datetimeString.replace(pattern, '$1-$2-$3T$4:$5:$6Z'))
      return datetimeObj
        .toLocaleString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        .replace(' เวลา', '')
    }
    const dateMatch = url.match(/IKVideo_(\d{8})/)
    if (dateMatch) {
      const dateString = dateMatch[1]
      const pattern = /(\d{4})(\d{2})(\d{2})/
      const datetimeObj = new Date(dateString.replace(pattern, '$1-$2-$3T00:00:00'))
      return datetimeObj.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    return ''
  }

  function sortableDateTime(url: string): string {
    const m = url.match(/IKVideo_(\d{8,14})/)
    return m ? m[1] : ''
  }

  function refreshEditing() {
    if (editing) {
      const refreshed = data.videos.find((v) => v.id === editing!.id)
      if (refreshed) editing = { ...editing, videoAccess: refreshed.videoAccess }
    }
  }
</script>

<svelte:head>
  <title>จัดการ VOD - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 min-h-[calc(100vh-10.2rem)] py-8">
  <div class="container flex flex-col gap-4 px-4">
    <h1 class="text-2xl md:text-4xl text-gray-800 font-bold">จัดการ VOD</h1>

    {#if (form as { message?: string } | null)?.message}
      <div class="text-red-500 text-sm font-medium bg-red-50 rounded-lg p-3">
        {(form as { message?: string }).message}
      </div>
    {/if}

    <div class="flex items-center gap-3">
      <input
        type="search"
        bind:value={search}
        placeholder="ค้นหาชื่อ, URL, หรือ ID..."
        class="w-full max-w-sm bg-gray-50 border border-gray-300 text-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
      />
      <span class="text-sm text-gray-400 whitespace-nowrap">{sorted.length} รายการ</span>
      <button
        type="button"
        on:click={() => {
          newVideo = emptyNew()
          newVideoUsers = []
          newVideoSelectId = ''
          creating = true
        }}
        class="ml-auto text-sm px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-700 transition-colors whitespace-nowrap"
      >
        + เพิ่ม VOD
      </button>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="w-full text-sm text-left text-gray-700">
        <thead class="text-xs text-gray-500 bg-gray-50">
          <tr>
            <th class="px-4 py-3 w-16">
              <button
                type="button"
                on:click={() => toggleSort('id')}
                class="flex items-center gap-1 uppercase font-semibold hover:text-gray-800 transition-colors"
              >
                ID <span class={sortCol === 'id' ? 'text-teal-500' : 'text-gray-300'}
                  >{sortIcon('id')}</span
                >
              </button>
            </th>
            <th class="px-4 py-3">
              <button
                type="button"
                on:click={() => toggleSort('name')}
                class="flex items-center gap-1 uppercase font-semibold hover:text-gray-800 transition-colors"
              >
                ชื่อ <span class={sortCol === 'name' ? 'text-teal-500' : 'text-gray-300'}
                  >{sortIcon('name')}</span
                >
              </button>
            </th>
            <th class="px-4 py-3">
              <button
                type="button"
                on:click={() => toggleSort('baseUrl')}
                class="flex items-center gap-1 uppercase font-semibold hover:text-gray-800 transition-colors"
              >
                Base URL <span class={sortCol === 'baseUrl' ? 'text-teal-500' : 'text-gray-300'}
                  >{sortIcon('baseUrl')}</span
                >
              </button>
            </th>
            <th class="px-4 py-3 w-44">
              <button
                type="button"
                on:click={() => toggleSort('datetime')}
                class="flex items-center gap-1 uppercase font-semibold hover:text-gray-800 transition-colors"
              >
                วันที่ <span class={sortCol === 'datetime' ? 'text-teal-500' : 'text-gray-300'}
                  >{sortIcon('datetime')}</span
                >
              </button>
            </th>
            <th class="px-4 py-3 w-28">
              <button
                type="button"
                on:click={() => toggleSort('fileType')}
                class="flex items-center gap-1 uppercase font-semibold hover:text-gray-800 transition-colors"
              >
                ประเภท <span class={sortCol === 'fileType' ? 'text-teal-500' : 'text-gray-300'}
                  >{sortIcon('fileType')}</span
                >
              </button>
            </th>
            <th class="px-4 py-3 w-28">
              <button
                type="button"
                on:click={() => toggleSort('allowAll')}
                class="flex items-center gap-1 uppercase font-semibold hover:text-gray-800 transition-colors"
              >
                เปิดทั้งหมด <span class={sortCol === 'allowAll' ? 'text-teal-500' : 'text-gray-300'}
                  >{sortIcon('allowAll')}</span
                >
              </button>
            </th>
            <th class="px-4 py-3 w-52">
              <button
                type="button"
                on:click={() => toggleSort('accessCount')}
                class="flex items-center gap-1 uppercase font-semibold hover:text-gray-800 transition-colors"
              >
                ผู้เข้าถึง <span
                  class={sortCol === 'accessCount' ? 'text-teal-500' : 'text-gray-300'}
                  >{sortIcon('accessCount')}</span
                >
              </button>
            </th>
            <th class="px-4 py-3 w-24 text-center uppercase font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {#each sorted as video (video.id)}
            <tr class="border-t border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-3 font-mono text-gray-500">{video.id}</td>
              <td class="px-4 py-3 font-medium">{video.name}</td>
              <td class="px-4 py-3 font-mono text-xs text-gray-500 max-w-xs truncate">
                {video.baseUrl}
              </td>
              <td class="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                {videoUrlToDateTime(video.baseUrl)}
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
              <td class="px-4 py-3">
                {#if video.allowAll}
                  <span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">ทุกคน</span>
                {:else if video.videoAccess.length === 0}
                  <span class="px-2 py-0.5 rounded text-xs bg-red-100 text-red-500">ไม่มี</span>
                {:else}
                  <div class="flex flex-wrap gap-1">
                    {#each video.videoAccess.slice(0, 2) as a}
                      <span class="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700"
                        >{a.displayName}</span
                      >
                    {/each}
                    {#if video.videoAccess.length > 2}
                      <span class="text-xs text-gray-400">+{video.videoAccess.length - 2}</span>
                    {/if}
                  </div>
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
          {#if sorted.length === 0}
            <tr>
              <td colspan="8" class="px-4 py-8 text-center text-gray-400">
                {search ? 'ไม่พบรายการที่ตรงกับการค้นหา' : 'ไม่มีข้อมูล VOD'}
              </td>
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
    <div
      class="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
    >
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
        use:enhance={() =>
          async ({ update }) => {
            await update({ reset: false })
            editing = null
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
            class="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
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
            class="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2.5 text-sm font-mono focus:ring-teal-500 focus:border-teal-500 outline-none"
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
            class="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
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

      {#if !editing.allowAll}
        <div class="border-t border-gray-100 pt-4 flex flex-col gap-3">
          <p class="text-sm font-medium text-gray-700">ผู้ที่เข้าถึงได้</p>

          {#if editing.videoAccess.length === 0}
            <p class="text-sm text-gray-400 italic">ยังไม่มีผู้ใช้ที่เข้าถึงได้</p>
          {:else}
            <div class="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {#each editing.videoAccess as access (access.userId)}
                <div class="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                  <span class="text-sm text-gray-700">
                    {access.displayName}
                    <span class="text-xs text-gray-400">(@{access.userLogin})</span>
                  </span>
                  <form
                    method="post"
                    action="?/removeAccess"
                    use:enhance={() =>
                      async ({ update }) => {
                        await update({ reset: false })
                        refreshEditing()
                      }}
                  >
                    <input type="hidden" name="videoId" value={editing.id} />
                    <input type="hidden" name="userId" value={access.userId} />
                    <button
                      type="submit"
                      class="text-xs text-red-400 hover:text-red-600 transition-colors ml-4"
                    >
                      ลบ
                    </button>
                  </form>
                </div>
              {/each}
            </div>
          {/if}

          {#if availableUsers.length > 0}
            <form
              method="post"
              action="?/addAccess"
              use:enhance={() =>
                async ({ update }) => {
                  await update({ reset: false })
                  refreshEditing()
                }}
              class="flex gap-2"
            >
              <input type="hidden" name="videoId" value={editing.id} />
              <select
                name="userId"
                class="flex-1 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                {#each availableUsers as user (user.id)}
                  <option value={user.id}>{user.displayName} (@{user.userLogin})</option>
                {/each}
              </select>
              <button
                type="submit"
                class="px-3 py-2 rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                เพิ่มสิทธิ์
              </button>
            </form>
          {:else if editing.videoAccess.length > 0}
            <p class="text-xs text-gray-400">ผู้ใช้ทุกคนได้รับสิทธิ์แล้ว</p>
          {/if}
        </div>
      {/if}

      <div class="flex justify-between gap-3 pt-2 border-t border-gray-100">
        <form
          method="post"
          action="?/delete"
          use:enhance={() =>
            async ({ update }) => {
              await update({ reset: false })
              editing = null
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

{#if creating}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    role="dialog"
    aria-modal="true"
  >
    <div class="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-800">เพิ่ม VOD ใหม่</h2>
        <button
          type="button"
          on:click={() => (creating = false)}
          class="text-gray-400 hover:text-gray-700 text-xl leading-none"
          aria-label="ปิด"
        >
          &times;
        </button>
      </div>

      <form
        method="post"
        action="?/create"
        use:enhance={() =>
          async ({ update }) => {
            await update({ reset: false })
            creating = false
          }}
        class="flex flex-col gap-4"
      >
        <div>
          <label for="new-name" class="block mb-1 text-sm font-medium text-gray-700">ชื่อ</label>
          <input
            type="text"
            id="new-name"
            name="name"
            bind:value={newVideo.name}
            required
            class="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        <div>
          <label for="new-baseUrl" class="block mb-1 text-sm font-medium text-gray-700"
            >Base URL</label
          >
          <input
            type="text"
            id="new-baseUrl"
            name="baseUrl"
            bind:value={newVideo.baseUrl}
            required
            class="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2.5 text-sm font-mono focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        <div>
          <label for="new-fileType" class="block mb-1 text-sm font-medium text-gray-700"
            >ประเภทไฟล์</label
          >
          <select
            id="new-fileType"
            name="fileType"
            bind:value={newVideo.fileType}
            class="w-full bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2.5 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
          >
            <option value="HLS">HLS</option>
            <option value="MP4">MP4</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="new-allowAll"
            name="allowAll"
            bind:checked={newVideo.allowAll}
            class="w-4 h-4 rounded accent-teal-500"
          />
          <label for="new-allowAll" class="text-sm font-medium text-gray-700">เปิดให้ทุกคนดู</label>
        </div>

        {#if !newVideo.allowAll}
          <div class="border-t border-gray-100 pt-4 flex flex-col gap-3">
            <p class="text-sm font-medium text-gray-700">ผู้ที่เข้าถึงได้</p>

            {#each newVideoUsers as user (user.id)}
              <input type="hidden" name="userId" value={user.id} />
            {/each}

            {#if newVideoUsers.length === 0}
              <p class="text-sm text-gray-400 italic">ยังไม่มีผู้ใช้ที่เข้าถึงได้</p>
            {:else}
              <div class="flex flex-col gap-1 max-h-40 overflow-y-auto">
                {#each newVideoUsers as user (user.id)}
                  <div class="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                    <span class="text-sm text-gray-700">
                      {user.displayName}
                      <span class="text-xs text-gray-400">(@{user.userLogin})</span>
                    </span>
                    <button
                      type="button"
                      on:click={() => removeNewVideoUser(user.id)}
                      class="text-xs text-red-400 hover:text-red-600 transition-colors ml-4"
                    >
                      ลบ
                    </button>
                  </div>
                {/each}
              </div>
            {/if}

            {#if newVideoAvailable.length > 0}
              <div class="flex gap-2">
                <select
                  bind:value={newVideoSelectId}
                  class="flex-1 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg p-2 text-sm focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                  <option value="">-- เลือกผู้ใช้ --</option>
                  {#each newVideoAvailable as user (user.id)}
                    <option value={user.id}>{user.displayName} (@{user.userLogin})</option>
                  {/each}
                </select>
                <button
                  type="button"
                  on:click={addNewVideoUser}
                  disabled={!newVideoSelectId}
                  class="px-3 py-2 rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-700 disabled:opacity-40 transition-colors whitespace-nowrap"
                >
                  เพิ่มสิทธิ์
                </button>
              </div>
            {:else}
              <p class="text-xs text-gray-400">ผู้ใช้ทุกคนได้รับสิทธิ์แล้ว</p>
            {/if}
          </div>
        {/if}

        <div class="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            on:click={() => (creating = false)}
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-700 transition-colors"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
