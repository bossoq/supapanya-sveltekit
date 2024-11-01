<script lang="ts">
  import { modalViewed } from '$lib/store'
  import VideoModal from '$lib/components/VideoModal.svelte'
  import type { PageServerData } from './$types'

  export let data: PageServerData

  const handleVideoModal = (e: Event) => {
    e.preventDefault()
    modalViewed.set(true)
  }
</script>

<div class="flex flex-col items-center bg-white gap-6 h-screen">
  {#if $modalViewed}
    <VideoModal />
  {/if}
  <div class="container flex">
    <div
      class="flex w-full justify-center items-center h-[430px] bg-[url('/images/home.jpg')] bg-[100%_12%] bg-cover"
    >
      <div class="flex flex-col justify-center items-center h-full w-full gap-2">
        <h1
          class="text-4xl md:text-6xl text-blue-light-key font-bold border-t-4 border-b-4 border-gray-400 p-4 w-11/12 text-center"
        >
          สถาบันศุภปัญญาไอ.เค.
        </h1>
        <p class="text-md md:text-2xl text-white italic font-light text-center">
          สถาบันกวดวิชาที่มีประสบการณ์การสอนกว่า 30 ปี ส่งต่อความสำเร็จให้นักเรียนจากรุ่นสู่รุ่น
        </p>
        <p class="text-md md:text-2xl text-white italic font-light text-center">
          มั่นใจได้ว่าสถาบันศุภปัญญาไอ.เค. คือสถาบันกวดวิชาที่ดีที่สุดในย่านหนองแขม
        </p>
        <p class="text-md md:text-2xl text-white italic font-light text-center">
          “วันนี้ระบบการสอนสดออนไลน์ของเราพร้อมแล้ว ด้วยความคมชัด Full HD พร้อมวิดีโอย้อนหลังกว่า <span
            class="underline">300</span
          > วิดีโอ”
        </p>
      </div>
    </div>
  </div>
  <div class="container flex flex-col justify-center text-gray-800">
    <h2 class="text-2xl md:text-4xl font-semibold">วิดีโอที่น่าสนใจ</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
      <button class="flex flex-col justify-center items-center" onclick={handleVideoModal}>
        <img
          src="https://vod.supapanya.com/NewNormal_Promote-FullHD/cover.jpg"
          alt="New Normal"
          class="aspect-video object-fill hover:scale-110 transition-all duration-300 ease-in-out"
        />
        <p>New Normal Supapanya</p>
      </button>
      <a class="flex flex-col justify-center items-center" href="/studytips">
        <img
          src="https://vod.supapanya.com/Factorial-ForHLS+Dash/cover.jpg"
          alt="New Normal"
          class="aspect-video object-fill hover:scale-110 transition-all duration-300 ease-in-out"
        />
        <p>เกร็ดความรู้</p>
      </a>
      <a class="flex flex-col justify-center items-center" href="/portfolio">
        <img
          src="https://vod.supapanya.com/M4-20-HLSNew/cover.jpg"
          alt="New Normal"
          class="aspect-video object-fill hover:scale-110 transition-all duration-300 ease-in-out"
        />
        <p>ความสำเร็จของเรา</p>
      </a>
    </div>
  </div>
  <div class="container flex flex-col justify-center pb-8">
    <h2 class="text-2xl md:text-4xl font-semibold">บทความล่าสุด</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
      {#each data.props.posts as { title, link, picture }}
        <a class="flex flex-col items-center" href="/blog/{link}">
          <img
            src={picture}
            alt={title}
            class="aspect-video object-fill hover:scale-110 transition-all duration-300 ease-in-out"
          />
          <p>{title}</p>
        </a>
      {/each}
    </div>
  </div>
</div>
