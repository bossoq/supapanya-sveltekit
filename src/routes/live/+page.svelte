<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import MultiSelect from 'svelte-multiselect'
  import ModalComponent from '$lib/components/ModalComponent.svelte'
  import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
  import { toastsList } from '$lib/store'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  let modalViewed = false
  let selectedStudents: User[] = []
  let selected: string[] = []
  let className: string = ''
  let isCreating = false
  let isCreated = false
  let meetingUri = ''
  const { user, students } = data
  $: conferences = data.conferences
  let autoRefresh: NodeJS.Timeout
  let isRefreshing = false
  $: countdown = 5
  let timeout: NodeJS.Timeout | null

  onMount(async () => {
    autoRefresh = setInterval(async () => {
      await refreshData()
    }, 30 * 1000)
  })
  onDestroy(() => {
    clearInterval(autoRefresh)
  })

  const refreshData = async () => {
    if (isRefreshing) return
    isRefreshing = true
    const response = await fetch('/api/listClassrooms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = (await response.json()) as {
      success: boolean
      message: string
      conferences: Conference[]
    }
    if (data.success) {
      conferences = data.conferences
    }
    isRefreshing = false
  }

  const handleCreateClass = async (e: Event) => {
    e.preventDefault()
    if (className === '') {
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          type: 'error',
          message: 'กรุณากรอกชื่อห้องเรียน'
        }
      ])
      return
    }
    if (selectedStudents.length === 0) {
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          type: 'error',
          message: 'กรุณาเลือกนักเรียน'
        }
      ])
      return
    }
    isCreating = true
    const response = await fetch('/api/createClassroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        className,
        participants: selectedStudents.map((student) => student.id)
      })
    })
    try {
      const data = await response.json()
      if (data.success) {
        isCreated = true
        meetingUri = data.meetingUri
        toastsList.update((toasts) => [
          ...toasts,
          {
            uuid: Math.random().toString(36).substring(2),
            type: 'success',
            message: 'สร้างห้องเรียนสำเร็จ'
          }
        ])
        timeout = setInterval(() => {
          countdown = countdown - 1
          if (countdown === 0) {
            if (modalViewed) window.open(meetingUri, '_blank')
            if (timeout) clearInterval(timeout)
            timeout = null
            isCreated = false
            countdown = 5
            modalViewed = false
          }
        }, 1 * 1000)
      } else {
        toastsList.update((toasts) => [
          ...toasts,
          {
            uuid: Math.random().toString(36).substring(2),
            type: 'error',
            message: 'ไม่สามารถสร้างห้องเรียนได้'
          }
        ])
      }
    } catch (error) {
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          type: 'error',
          message: 'ไม่สามารถสร้างห้องเรียนได้'
        }
      ])
    } finally {
      setTimeout(async () => {
        await refreshData()
      }, 3 * 1000)
      isCreating = false
      selected = []
      selectedStudents = []
      className = ''
    }
  }
  const handleLink = () => {
    if (timeout) clearInterval(timeout)
    window.open(meetingUri, '_blank')
    timeout = null
    isCreated = false
    countdown = 5
    modalViewed = false
  }

  const getElapseTime = (startTime: string) => {
    const start = new Date(Number(startTime) * 1000)
    const now = new Date()
    const diff = now.getTime() - start.getTime()
    const hours = Math.floor(diff / 1000 / 60 / 60)
    const minutes = Math.floor(diff / 1000 / 60)
    const seconds = Math.floor(diff / 1000) % 60
    if (hours > 0) return `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`
    if (minutes > 0) return `${minutes} นาที ${seconds} วินาที`
    return `${seconds} วินาที`
  }
</script>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)]">
  {#if modalViewed}
    <ModalComponent bind:modalViewed>
      <form class="flex flex-col gap-4 w-[42rem] h-[calc(100vh-10.2rem)]" method="POST">
        <h1 class="text-2xl md:text-4xl text-gray-800 font-bold py-2">สร้างห้องเรียนใหม่</h1>
        <label for="name" class="text-lg text-gray-800">ชื่อห้องเรียน</label>
        <input
          type="text"
          id="className"
          name="className"
          class="p-2 text-md md:text-lg text-gray-800 border border-gray-300 rounded-lg transition-all ease-in-out duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
          bind:value={className}
          required
          maxlength="100"
          disabled={isCreating || isCreated}
        />
        <label for="participants" class="text-lg text-gray-800">เลือกนักเรียน</label>
        <MultiSelect
          autocomplete="on"
          loading={students.length === 0}
          required
          options={students.map((student) => student.displayName)}
          placeholder="เลือกนักเรียน"
          bind:selected
          on:change={(e) => {
            if (e.detail.type === 'removeAll') selectedStudents = []
            else
              selectedStudents = students.filter((student) =>
                selected.includes(student.displayName)
              )
          }}
          disabled={isCreating || isCreated}
        />
        {#if isCreated}
          <p class="text-gray-600">ห้องเรียนถูกสร้างเรียบร้อยแล้ว</p>
          <button
            type="button"
            class="p-2 my-2 text-md md:text-lg text-white bg-blue-500 hover:bg-blue-700 rounded-lg transition-all ease-in-out duration-200 disabled:cursor-not-allowed"
            onclick={handleLink}
          >
            เข้าห้องเรียนภายใน {countdown} วินาที (คลิกเพื่อเข้าห้องเรียนทันที)
          </button>
        {:else}
          <button
            type="submit"
            class="p-2 my-2 text-md md:text-lg text-white bg-teal-500 hover:bg-teal-700 rounded-lg transition-all ease-in-out duration-200 disabled:cursor-not-allowed"
            onclick={handleCreateClass}
            disabled={isCreating || isCreated}
          >
            {isCreating ? 'กำลังสร้างห้องเรียน...' : 'สร้างห้องเรียน'}
          </button>
        {/if}
      </form>
    </ModalComponent>
  {/if}
  <div class="container flex flex-col">
    <section class="flex flex-row items-center justify-between gap-4">
      <h1 class="text-2xl md:text-4xl text-gray-800 font-bold py-2">
        {conferences.length === 0 ? 'ไม่มีห้องเรียนเปิดอยู่ในขณะนี้' : 'กรุณาเลือกห้องเรียน'}
      </h1>
      <button
        class="p-2 my-2 text-md md:text-lg text-white bg-teal-500 hover:bg-teal-700 rounded-lg transition-all ease-in-out duration-200"
        disabled={isRefreshing}
        onclick={refreshData}
        aria-label="Refresh"
      >
        <svg
          class="aspect-square w-6 text-white {isRefreshing ? 'animate-spin' : ''}"
          fill="currentColor"
        >
          <use xlink:href="{remixiconUrl}#ri-refresh-line" />
        </svg>
      </button>
      <div class="flex-1"></div>
      {#if user.meta.isAdmin}
        <button
          class="p-2 my-2 text-md md:text-lg text-white bg-teal-500 hover:bg-teal-700 rounded-lg transition-all ease-in-out duration-200"
          onclick={() => (modalViewed = true)}
        >
          สร้างห้องเรียนใหม่
        </button>
      {/if}
    </section>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each conferences.sort((a, b) => {
        if (a.startTime > b.startTime) return -1
        if (a.startTime < b.startTime) return 1
        return 0
      }) as conference}
        <a
          href={conference.meetingUri}
          target="_blank"
          class="text-center p-2 my-2 text-md md:text-lg text-white bg-blue-500 hover:bg-blue-700 rounded-lg transition-all ease-in-out duration-200"
        >
          <h2 class="font-semibold">{`ห้องเรียน${conference.className}`}</h2>
          <h3 class="text-sm text-gray-200">ผู้สอน: {conference.teacher}</h3>
          <p class="text-sm text-gray-200">
            {conference.meetingCode} (สร้างเมื่อ {getElapseTime(conference.startTime)} ที่แล้ว)
          </p>
        </a>
      {/each}
      {#if conferences.length === 0}
        <p class="text-gray-600">ไม่มีห้องเรียนเปิดอยู่ในขณะนี้</p>
      {/if}
    </div>
  </div>
</div>
