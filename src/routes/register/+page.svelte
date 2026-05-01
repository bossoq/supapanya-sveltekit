<script lang="ts">
  import { page } from '$app/stores'
  import type { ActionData } from './$types'

  export let form: ActionData
</script>

<section class="bg-gray-50">
  <div
    class="flex flex-col items-center justify-center px-6 mx-auto h-[calc(100vh-9.6rem)] md:h-[calc(100vh-10.2rem)]"
  >
    <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl">
          สร้างบัญชีผู้ใช้
        </h1>

        {#if $page.url.searchParams.get('success')}
          <div class="text-green-600 text-sm font-medium bg-green-50 rounded-lg p-3">
            สร้างบัญชีสำเร็จแล้ว
          </div>
        {/if}

        <form class="space-y-4 md:space-y-6" method="post">
          <div>
            <label for="username" class="block mb-2 text-sm font-medium text-gray-800"
              >ชื่อผู้ใช้</label
            >
            <input
              type="text"
              name="username"
              id="username"
              class="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="e.g. myname"
              required
            />
          </div>
          <div>
            <label for="displayName" class="block mb-2 text-sm font-medium text-gray-800"
              >ชื่อที่แสดง</label
            >
            <input
              type="text"
              name="displayName"
              id="displayName"
              class="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="e.g. สมชาย ใจดี"
              required
            />
          </div>
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-800"
              >รหัสผ่าน</label
            >
            <input
              type="password"
              name="password"
              id="password"
              placeholder="อย่างน้อย 8 ตัวอักษร"
              class="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required
              minlength="8"
            />
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" name="isAdmin" id="isAdmin" class="w-4 h-4 rounded" />
            <label for="isAdmin" class="text-sm font-medium text-gray-800">ผู้ดูแลระบบ</label>
          </div>
          <button
            type="submit"
            class="w-full text-white bg-teal-500 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >สร้างบัญชี</button
          >
        </form>

        {#if form?.message}
          <div class="text-red-500 text-sm font-medium">
            {form.message}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>
