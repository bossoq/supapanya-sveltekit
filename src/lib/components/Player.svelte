<script lang="ts">
  import 'vidstack/bundle'

  import { onMount } from 'svelte'
  import { type HLSSrc, type VideoSrc } from 'vidstack'
  import type { MediaPlayerElement } from 'vidstack/elements'

  export let title: string
  export let poster: string
  export let src: HLSSrc | VideoSrc[]
  export let restart = false
  export let autoPlay = false
  export let player: MediaPlayerElement | null = null

  onMount(() => {
    if (player) {
      if (restart) {
        if (src.constructor === Array) {
          ;(src as VideoSrc[]).forEach((source) => {
            window.localStorage.removeItem(`${source.src}:0:0`)
          })
        } else {
          window.localStorage.removeItem(`${(src as HLSSrc).src}:0:0`)
        }
      }
      player.title = title
      player.viewType = 'video'
      player.streamType = 'on-demand'
      player.crossOrigin = true
      player.load = 'visible'
      player.posterLoad = 'eager'
      player.storage = 'vidstack'
      player.src = src
      player.poster = poster
      player.autoPlay = autoPlay
    }
  })
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<media-player
  class="w-full aspect-video bg-slate-900 text-white overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
  bind:this={player}
>
  <media-provider>
    <media-poster
      class="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
      alt="Video Poster"
      crossOrigin
    />
  </media-provider>
  <media-video-layout />
</media-player>
