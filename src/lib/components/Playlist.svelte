<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
  import { getPoster } from '$lib/utils'

  export let videoList: VideoData[] = []
  export let currentId: number = 0

  $: localVideoList = videoList
  let search: string = ''
  let sortAsc: boolean = true
  const dispatch = createEventDispatcher()

  const handleSort = (e: Event) => {
    e.preventDefault()
    videoList = videoList.reverse()
    sortAsc = !sortAsc
  }
  const handleSearch = (e: Event) => {
    e.preventDefault()
    localVideoList = videoList.filter((video) =>
      video.title.toLowerCase().includes(search.toLowerCase())
    )
  }
  const handleChangeSrc = (e: Event, id: number) => {
    e.preventDefault()
    currentId = id
    dispatch('changeSrc', { id })
  }
  const videoUrlToDateTime = (url: string): string => {
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
</script>

<section class="flex flex-col border-2 border-gray-100 p-2 shadow rounded w-full h-full">
  <div class="flex flex-row items-center gap-2 pb-2">
    <input
      type="search"
      placeholder="ค้นหาวิดีโอ"
      class="border-2 border-gray-100 p-2 rounded w-full text-sm md:text-base"
      bind:value={search}
      oninput={handleSearch}
    />
    <button class="p-2 bg-teal-500 text-white rounded" onclick={handleSort} aria-label="sort">
      <svg class="aspect-square w-5" fill="currentColor">
        <use xlink:href="{remixiconUrl}#ri-{sortAsc ? 'sort-desc' : 'sort-asc'}" />
      </svg>
    </button>
  </div>
  <div class="flex flex-row md:flex-col md:w-full overflow-y-auto hide-scrollbar">
    {#each search.length > 0 ? localVideoList : videoList as video}
      <button
        class="w-full transition-all duration-200 ease-in-out p-2 {currentId === video.id
          ? 'bg-teal-100 font-semibold underline'
          : 'hover:bg-gray-100 hover:font-semibold hover:underline'}"
        onclick={(e) => handleChangeSrc(e, video.id)}
      >
        <div class="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 w-36 md:w-full">
          <img
            src={getPoster(video.url)}
            alt={video.title}
            class="object-cover aspect-video w-36 md:w-24 lg:w-32 xl:w-36"
            loading="lazy"
          />
          <section class="flex flex-col p-0 md:py-2">
            <h2 class="text-sm md:text-sm lg:text-md xl:text-lg text-gray-800 font-medium">
              {video.title}
            </h2>
            <p class="text-sm md:text-sm lg:text-md xl:text-lg text-gray-700 font-thin">
              {videoUrlToDateTime(video.url)}
            </p>
          </section>
        </div>
      </button>
    {/each}
  </div>
</section>
