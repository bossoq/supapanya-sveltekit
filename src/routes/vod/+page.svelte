<script lang="ts">
  import type { PageServerData } from './$types'
  import PlayerPlaylist from '$lib/components/PlayerPlaylist.svelte'

  export let data: PageServerData
  const { user, props } = data
  let videoList = props.videos
</script>

<svelte:head>
  <title>บันทึกการสอนออนไลน์ - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)]">
  <div class="container flex flex-col">
    <h1 class="text-2xl md:text-4xl text-gray-800 font-bold py-2">
      บันทึกการสอนออนไลน์สำหรับ {user.displayName}
    </h1>
    <PlayerPlaylist bind:videoList />
  </div>
</div>
