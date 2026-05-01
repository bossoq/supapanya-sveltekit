<script lang="ts">
  import { page } from '$app/stores'
</script>

<section class="bg-gray-50">
  <div
    class="flex flex-col items-center justify-center px-6 mx-auto h-[calc(100vh-9.6rem)] md:h-[calc(100vh-10.2rem)]"
  >
    <div class="text-center">
      <p class="text-6xl font-bold text-teal-500 mb-4">{$page.status}</p>
      <h1 class="text-2xl font-semibold text-gray-800 mb-2">
        {#if $page.status === 404}
          ไม่พบหน้าที่ต้องการ
        {:else if $page.status === 403}
          ไม่มีสิทธิ์เข้าถึง
        {:else if $page.status === 401}
          กรุณาเข้าสู่ระบบ
        {:else}
          เกิดข้อผิดพลาด
        {/if}
      </h1>
      <p class="text-gray-500 mb-6">{$page.error?.message ?? ''}</p>
      <a
        href="/"
        class="text-white bg-teal-500 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5"
      >
        กลับหน้าหลัก
      </a>
    </div>
  </div>
</section>
