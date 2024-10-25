<script lang="ts">
  import type { PageServerData } from './$types'
  import PlayerPlaylist from '$lib/components/PlayerPlaylist.svelte'

  export let data: PageServerData
  let videoList = data.props.videos
</script>

<svelte:head>
  <title>ความสำเร็จของเรา - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)]">
  <div class="container flex flex-col">
    <h1 class="text-2xl md:text-4xl text-gray-800 font-bold py-2">ความสำเร็จของเรา</h1>
    <PlayerPlaylist bind:videoList restart autoPlay />
  </div>
</div>
