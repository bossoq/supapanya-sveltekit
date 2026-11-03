<script lang="ts">
  import { onMount } from 'svelte'
  import { pickVideoSrc, type HLSSrc, type VideoSrc } from '#lib/utils.js'

  export let title: string
  export let poster: string
  export let src: HLSSrc | VideoSrc[]
  export let restart = false
  export let autoPlay = false
  export let onEnded: (() => void) | undefined = undefined

  let container: HTMLDivElement
  let ready = false
  let isHls = false
  let mediaSrc = ''

  // Video.js 10 doesn't save playback position yet (videojs/v10#944), so keep it per video here
  const SAVE_EVERY_SECONDS = 2
  const storageKey = () => `video-position:${Array.isArray(src) ? src[0].src : src.src}`
  const readPosition = () => {
    try {
      return Number(window.localStorage.getItem(storageKey())) || 0
    } catch {
      return 0
    }
  }
  const writePosition = (seconds: number | null) => {
    try {
      if (seconds === null) window.localStorage.removeItem(storageKey())
      else window.localStorage.setItem(storageKey(), String(Math.floor(seconds)))
    } catch {
      // storage unavailable (private mode, blocked): playback still works without resume
    }
  }

  onMount(async () => {
    if (restart) writePosition(null)
    isHls = !Array.isArray(src)
    mediaSrc = Array.isArray(src)
      ? pickVideoSrc(src, container.clientWidth, window.devicePixelRatio || 1).src
      : src.src

    await Promise.all([
      import('@videojs/html/video/player'),
      import('@videojs/html/video/skin'),
      isHls ? import('@videojs/html/media/hlsjs-video') : Promise.resolve()
    ])
    ready = true
  })

  // Runs when the <video> / <hlsjs-video> is mounted; both expose the standard media API
  const mediaEvents = (
    media: HTMLElement & Pick<HTMLMediaElement, 'currentTime' | 'duration' | 'play'>
  ) => {
    let lastSaved = 0
    media.addEventListener('loadedmetadata', () => {
      const saved = readPosition()
      if (saved > 0 && saved < media.duration - 5) media.currentTime = saved
      if (autoPlay) media.play().catch(() => {})
    })
    media.addEventListener('timeupdate', () => {
      if (Math.abs(media.currentTime - lastSaved) >= SAVE_EVERY_SECONDS) {
        lastSaved = media.currentTime
        writePosition(media.currentTime)
      }
    })
    media.addEventListener('ended', () => {
      writePosition(null)
      onEnded?.()
    })
  }
</script>

<div
  bind:this={container}
  class="w-full aspect-video bg-slate-900 text-white overflow-hidden rounded-md"
>
  {#if ready}
    <video-player content-title={title} {poster} class="block w-full h-full">
      <video-skin class="block w-full h-full">
        {#if isHls}
          <hlsjs-video use:mediaEvents src={mediaSrc} playsinline crossorigin="anonymous"
          ></hlsjs-video>
        {:else}
          <!-- the lessons have no caption tracks -->
          <!-- svelte-ignore a11y_media_has_caption -->
          <video use:mediaEvents src={mediaSrc} playsinline crossorigin="anonymous"></video>
        {/if}
      </video-skin>
    </video-player>
  {/if}
</div>
