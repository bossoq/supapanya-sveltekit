<script lang="ts">
  import { onMount } from 'svelte'
  import { convertVideo, getPoster, type HLSSrc, type VideoSrc } from '#lib/utils.js'
  import Player from '#lib/components/Player.svelte'
  import Playlist from '#lib/components/Playlist.svelte'

  export let restart = false
  export let autoPlay = false
  export let videoList: VideoData[] = []
  let isLoading = false
  let videoId: number
  let title: string
  let src: HLSSrc | VideoSrc[]
  let poster: string

  onMount(() => {
    if (videoList.length === 0) return
    changeSrc(new CustomEvent('onMount', { detail: { id: videoList[0].id } }))
  })

  // Player is recreated for each video, so it takes the callback rather than us holding a listener
  const playNext = () => {
    const vid = videoList.findIndex((video) => video.id === videoId)
    if (vid === -1 || vid === videoList.length - 1) return
    changeSrc(new CustomEvent('nextVid', { detail: { id: videoList[vid + 1].id } }))
  }

  const changeSrc = (e: CustomEvent<{ id: number }>) => {
    isLoading = true
    setTimeout(() => {
      e.preventDefault()
      const id = e.detail.id
      const videoData = videoList.find((video) => video.id === id) || videoList[0]
      videoId = videoData.id
      title = videoData.title
      src = convertVideo(videoData.url, videoData.fileType)
      poster = getPoster(videoData.url)
      isLoading = false
    }, 10)
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-2 align-middle">
  <div class="aspect-video flex justify-center col-span-2 max-h-[calc(60vh)]">
    {#if src && !isLoading}
      <Player {title} {src} {poster} {autoPlay} {restart} onEnded={playNext} />
    {:else if videoList.length === 0}
      <div class="flex justify-center items-center w-full h-full">
        <p class="text-2xl text-gray-800">ไม่มีวิดีโอในรายการ</p>
      </div>
    {:else}
      <div class="flex justify-center items-center w-full h-full">
        <!-- svelte-ignore element_invalid_self_closing_tag -->
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
      </div>
    {/if}
  </div>
  <div
    class="md:aspect-8/9 flex justify-center col-span-1 max-h-[calc(35vh)] md:max-h-[calc(60vh)]"
  >
    <Playlist bind:videoList bind:currentId={videoId} on:changeSrc={changeSrc} />
  </div>
</div>
