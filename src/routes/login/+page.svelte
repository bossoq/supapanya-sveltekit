<script lang="ts">
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
          เข้าสู่ระบบ
        </h1>
        <form class="space-y-4 md:space-y-6" action="/login" method="post">
          <div>
            <label for="username" class="block mb-2 text-sm font-medium text-gray-800"
              >ชื่อผู้ใช้</label
            >
            <input
              type="username"
              name="username"
              id="username"
              class="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="e.g. myname"
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
              placeholder="••••••••"
              class="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full text-white bg-teal-500 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >เข้าสู่ระบบ</button
          >
        </form>
        {#if form && form.message}
          <div class="text-red-500 text-sm font-medium">
            {form.message}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>
