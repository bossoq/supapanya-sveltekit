<script lang="ts">
  import { darkTheme } from '$lib/store'
  import Fa from 'svelte-fa'
  import { faFacebook } from '@fortawesome/free-brands-svg-icons'
  import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons'
  export let themeIcons: string[]
  export let themeEnabler: boolean
</script>

<header class="flex flex-col gap-2 sm:gap-4 w-full sticky top-0 pb-2 justify-center items-center">
  <div class="flex w-full h-10 sm:h-12 bg-blue-light-key text-white justify-center items-center">
    <div class="flex flex-row gap-6 container w-full items-center">
      <div id="top-bar-left" class="flex flex-row gap-6 mr-auto items-center">
        <div class="flex flex-row gap-2">
          <Fa icon={faPhoneAlt} size="lg" rotate={90} />
          <a href="tel: +6662-225-6359" class="text-sm sm:text-xl">062 225 6359</a>
        </div>
        <div class="hidden sm:flex flex-row gap-2">
          <Fa icon={faEnvelope} size="lg" />
          <a href="mailto:kittipos@picturo.us" class="text-sm sm:text-xl">kittipos@picturo.us</a>
        </div>
      </div>
      <div id="top-bar-right" class="flex flex-row gap-6 ml-auto items-center">
        <div class="flex flex-row gap-2">
          <Fa icon={faFacebook} size="lg" />
          <a
            href="https://www.facebook.com/supapanyaik"
            target="_blank"
            rel="noreferrer"
            title="facebook"
            class="text-sm sm:text-xl">สถาบันศุภปัญญาไอ.เค.</a
          >
        </div>
        {#if themeEnabler}
          <div class="hidden sm:flex flex-row gap-2">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p
              on:click={() => ($darkTheme = !$darkTheme)}
              class="text-xs sm:text-base cursor-pointer select-none bg-sky-800 text-white rounded p-2"
            >
              {$darkTheme ? themeIcons[1] : themeIcons[0]}
            </p>
          </div>
          <div class="flex sm:hidden flex-row gap-2">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p
              on:click={() => ($darkTheme = !$darkTheme)}
              class="text-xs sm:text-base cursor-pointer select-none bg-sky-800 text-white rounded p-2"
            >
              {$darkTheme ? themeIcons[1].slice(0, 2) : themeIcons[0].slice(0, 2)}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
  <div class="flex flex-row container items-center justify-center">
    <img src="/images/logo.png" alt="Supapanya Logo" class="h-8 sm:h-12" />
  </div>
  <nav
    class="flex flex-row container h-12 text-sm md:text-lg border-t border-b border-slate-600 justify-center items-center"
  >
    <div class="text-slate-600">
      <button
        data-collapse-toggle="navbar-dropdown"
        type="button"
        class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-dropdown"
        aria-expanded="false"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          /></svg
        >
      </button>
      <div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
        <ul
          class="flex flex-col flex-wrap p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:gap-2 md:py-0 md:mt-0 md:border-none md:bg-transparent"
        >
          <li
            aria-current="page"
            class="p-1 rounded border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
          >
            <a href="/">หน้าหลัก</a>
          </li>
          <li
            class="p-1 rounded border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
          >
            <a href="/">คอร์สเรียน</a>
          </li>
          <li>
            <button
              id="dropdownNavbarReview"
              data-dropdown-toggle="dropdownNavbarReviewItem"
              class="flex items-center justify-between p-1 rounded border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
            >
              ประวัติของเรา
              <svg
                class="w-5 h-5 ml-1"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                /></svg
              >
              <div
                id="dropdownNavbarReviewItem"
                class="z-20 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
              >
                <ul class="py-2" aria-labelledby="dropdownReviewButton">
                  <li
                    class="border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                  >
                    <a href="/">รีวิว</a>
                  </li>
                  <li
                    class="border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                  >
                    <a href="/">ความสำเร็จของเรา</a>
                  </li>
                </ul>
              </div>
            </button>
          </li>
          <li
            class="p-1 rounded border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
          >
            <a href="/">บทความ</a>
          </li>
          <li
            class="p-1 rounded border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
          >
            <a href="/">ติดต่อเรา</a>
          </li>
          <li
            class="p-1 rounded border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
          >
            <a href="/">ห้องเรียนออนไลน์</a>
          </li>
          <li
            class="p-1 rounded border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
          >
            <a href="/">บันทึกการสอน</a>
          </li>
          <li
            class="p-1 rounded border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
          >
            <a href="/">ออกจากระบบ</a>
          </li>
          <button
            id="dropdownNavbarAdmin"
            data-dropdown-toggle="dropdownNavbarAdminItem"
            class="flex items-center justify-between p-1 rounded border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
          >
            สำหรับผู้ดูแลระบบ
            <svg
              class="w-5 h-5 ml-1"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              /></svg
            >
            <div
              id="dropdownNavbarAdminItem"
              class="z-20 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
            >
              <ul class="py-2" aria-labelledby="dropdownAdminButton">
                <li
                  class="border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                >
                  <a href="/">ลงทะเบียน</a>
                </li>
                <li
                  class="border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                >
                  <a href="/">รายชื่อวิดีโอ</a>
                </li>
                <li
                  class="border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                >
                  <a href="/">เพิ่มวิดีโอ</a>
                </li>
              </ul>
            </div>
          </button>
        </ul>
      </div>
    </div>
  </nav>
</header>
