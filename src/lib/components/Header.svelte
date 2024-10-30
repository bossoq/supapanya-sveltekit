<script lang="ts">
  import { slide } from 'svelte/transition'
  import { onMount } from 'svelte'
  import { darkTheme } from '$lib/store'
  import Fa from 'svelte-fa'
  import { faFacebook } from '@fortawesome/free-brands-svg-icons'
  import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons'

  export let themeIcons: string[]
  export let themeEnabler: boolean
  export let userData: UserInfo | null
  let mobileMenu = false

  onMount(() => {
    const mql = window.matchMedia('(min-width: 768px)')
    mql.matches ? (mobileMenu = false) : (mobileMenu = true)
    mql.addEventListener('change', (e) => {
      if (e.matches) {
        mobileMenu = false
      } else {
        mobileMenu = true
        showMenu = false
      }
    })
  })

  let showMenu = false
  let showNav = [false, false, false, false]

  const toggleNavbar = (e: Event) => {
    e.preventDefault()
    showMenu = !showMenu
  }
  const toggleSubMenu = (e: Event, num: number, event: string) => {
    if (event === 'in' && !mobileMenu) {
      showNav = showNav.map((_, i) => {
        return i === num - 1 ? true : false
      })
    } else if (event === 'out' && !mobileMenu) {
      showNav = [false, false, false, false]
    } else if (event === 'click' && mobileMenu) {
      showNav = showNav.map((value, i) => {
        return i === num - 1 ? !value : false
      })
    }
  }
</script>

<header class="w-full sticky top-0">
  <div class="flex w-full h-8 sm:h-10 bg-blue-light-key text-white justify-center items-center">
    <div class="flex flex-row gap-6 container w-full items-center">
      <div id="top-bar-left" class="flex flex-row gap-6 mr-auto items-center">
        <div class="flex flex-row gap-2">
          <Fa icon={faPhoneAlt} size="lg" rotate={90} />
          <a href="tel: +6662-225-6359" class="text-sm sm:text-lg">062 225 6359</a>
        </div>
        <div class="hidden sm:flex flex-row gap-2">
          <Fa icon={faEnvelope} size="lg" />
          <a href="mailto:kittipos@picturo.us" class="text-sm sm:text-lg">kittipos@picturo.us</a>
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
            class="text-sm sm:text-lg">สถาบันศุภปัญญาไอ.เค.</a
          >
        </div>
        {#if themeEnabler}
          <div class="hidden sm:flex flex-row gap-2">
            <button
              onclick={() => ($darkTheme = !$darkTheme)}
              class="text-xs sm:text-base cursor-pointer select-none bg-sky-800 text-white rounded p-2"
            >
              {$darkTheme ? themeIcons[1] : themeIcons[0]}
            </button>
          </div>
          <div class="flex sm:hidden flex-row gap-2">
            <button
              onclick={() => ($darkTheme = !$darkTheme)}
              class="text-xs sm:text-base cursor-pointer select-none bg-sky-800 text-white rounded p-2"
            >
              {$darkTheme ? themeIcons[1].slice(0, 2) : themeIcons[0].slice(0, 2)}
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
  <div class="border-t border-b border-gray-300">
    <nav class="container px-2 py-2 mx-auto md:flex md:justify-between md:items-center">
      <div class="flex items-center justify-between">
        <a data-sveltekit-preload-data="tap" href="/">
          <div class="flex flex-row container items-center justify-center">
            <img src="/images/logo.png" alt="Supapanya Logo" class="h-8 object-cover" />
          </div>
        </a>
        <div class="flex md:hidden">
          <button
            type="button"
            class="text-gray-800 hover:text-gray-400 focus:outline-none focus:text-gray-400"
            aria-labelledby="Show Navigation"
            onclick={toggleNavbar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
      {#if !mobileMenu || (showMenu && mobileMenu)}
        <ul
          class="flex flex-col mt-8 md:flex-row md:items-center md:space-x-2 md:mt-0"
          transition:slide
        >
          <a
            class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
            data-sveltekit-preload-data="tap"
            href="/course">คอร์สเรียน</a
          >
          <button
            class="flex flex-col items-center justify-between"
            onmouseenter={(e) => toggleSubMenu(e, 1, 'in')}
            onmouseleave={(e) => toggleSubMenu(e, 1, 'out')}
            onfocusin={(e) => toggleSubMenu(e, 1, 'in')}
            onfocusout={(e) => toggleSubMenu(e, 1, 'out')}
            onclick={(e) => toggleSubMenu(e, 1, 'click')}
          >
            <p
              class="hover:transition-all ease-in-out duration-200 w-full flex justify-between items-center rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
            >
              ประวัติ
              <svg
                class="w-5 h-5 ml-1 {showNav[0] ? 'transition rotate-180' : 'transition rotate-0'}"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                /></svg
              >
            </p>
            {#if showNav[0]}
              <div
                id="dropdownNavbarReviewItem"
                class="text-left md:text-center z-20 px-2 md:p-0 w-full md:absolute md:top-[calc(5rem+8px)] bg-white divide-y divide-gray-100 rounded-lg md:shadow md:w-44"
                transition:slide
              >
                <ul class="pb-2">
                  <a data-sveltekit-preload-data="tap" href="/review">
                    <li
                      class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
                    >
                      รีวิว
                    </li>
                  </a>
                  <a data-sveltekit-preload-data="tap" href="/portfolio">
                    <li
                      class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
                    >
                      ความสำเร็จของเรา
                    </li>
                  </a>
                </ul>
              </div>
            {/if}
          </button>
          <button
            class="flex flex-col items-center justify-between"
            onmouseenter={(e) => toggleSubMenu(e, 2, 'in')}
            onmouseleave={(e) => toggleSubMenu(e, 2, 'out')}
            onfocusin={(e) => toggleSubMenu(e, 2, 'in')}
            onfocusout={(e) => toggleSubMenu(e, 2, 'out')}
            onclick={(e) => toggleSubMenu(e, 2, 'click')}
          >
            <p
              class="hover:transition-all ease-in-out duration-200 w-full flex justify-between items-center rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
            >
              บทความ
              <svg
                class="w-5 h-5 ml-1 {showNav[1] ? 'transition rotate-180' : 'transition rotate-0'}"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                /></svg
              >
            </p>
            {#if showNav[1]}
              <div
                id="dropdownNavbarBlogItem"
                class="text-left md:text-center z-20 px-2 md:p-0 w-full md:absolute md:top-[calc(5rem+8px)] bg-white divide-y divide-gray-100 rounded-lg md:shadow md:w-44"
                transition:slide
              >
                <ul class="pb-2">
                  <a data-sveltekit-preload-data="tap" href="/blog">
                    <li
                      class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
                    >
                      บทความที่น่าสนใจ
                    </li>
                  </a>
                  <a data-sveltekit-preload-data="tap" href="/studytips">
                    <li
                      class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
                    >
                      เกร็ดความรู้
                    </li>
                  </a>
                </ul>
              </div>
            {/if}
          </button>
          <a
            class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
            data-sveltekit-preload-data="tap"
            href="/contact">ติดต่อเรา</a
          >
          {#if userData}
            <button
              class="flex flex-col items-center justify-between"
              onmouseenter={(e) => toggleSubMenu(e, 3, 'in')}
              onmouseleave={(e) => toggleSubMenu(e, 3, 'out')}
              onfocusin={(e) => toggleSubMenu(e, 3, 'in')}
              onfocusout={(e) => toggleSubMenu(e, 3, 'out')}
              onclick={(e) => toggleSubMenu(e, 3, 'click')}
            >
              <p
                class="hover:transition-all ease-in-out duration-200 w-full flex justify-between items-center rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
              >
                ห้องเรียน
                <svg
                  class="w-5 h-5 ml-1 {showNav[2]
                    ? 'transition rotate-180'
                    : 'transition rotate-0'}"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  /></svg
                >
              </p>
              {#if showNav[2]}
                <div
                  id="dropdownNavbarLiveItem"
                  class="text-left md:text-center z-20 px-2 md:p-0 w-full md:absolute md:top-[calc(5rem+8px)] bg-white divide-y divide-gray-100 rounded-lg md:shadow md:w-44"
                  transition:slide
                >
                  <ul class="pb-2">
                    <a data-sveltekit-preload-data="tap" href="/live">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
                      >
                        ห้องเรียนออนไลน์
                      </li>
                    </a>
                    <a data-sveltekit-preload-data="tap" href="/vod">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
                      >
                        บันทึกการสอน
                      </li>
                    </a>
                  </ul>
                </div>
              {/if}
            </button>
            <a
              class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
              onclick={() => (userData = null)}
              data-sveltekit-preload-data="tap"
              href="/logout">ออกจากระบบ</a
            >
          {:else}
            <a
              class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
              data-sveltekit-preload-data="tap"
              href="/login">เข้าสู่ระบบ</a
            >
          {/if}
          {#if userData && userData.meta.isAdmin}
            <button
              class="flex flex-col items-center justify-between"
              onmouseenter={(e) => toggleSubMenu(e, 4, 'in')}
              onmouseleave={(e) => toggleSubMenu(e, 4, 'out')}
              onfocusin={(e) => toggleSubMenu(e, 4, 'in')}
              onfocusout={(e) => toggleSubMenu(e, 4, 'out')}
              onclick={(e) => toggleSubMenu(e, 4, 'click')}
            >
              <p
                class="hover:transition-all ease-in-out duration-200 w-full flex justify-between items-center rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
              >
                Admin
                <svg
                  class="w-5 h-5 ml-1 {showNav[3]
                    ? 'transition rotate-180'
                    : 'transition rotate-0'}"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  /></svg
                >
              </p>
              {#if showNav[3]}
                <div
                  id="dropdownNavbarAdminItem"
                  class="text-left md:text-center z-20 px-2 md:p-0 w-full md:absolute md:top-[calc(5rem+8px)] bg-white divide-y divide-gray-100 rounded-lg md:shadow md:w-44"
                  transition:slide
                >
                  <ul class="pb-2">
                    <a data-sveltekit-preload-data="tap" href="/register">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
                      >
                        Register
                      </li>
                    </a>
                    <a data-sveltekit-preload-data="tap" href="/vodlist">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
                      >
                        Video List
                      </li>
                    </a>
                    <a data-sveltekit-preload-data="tap" href="/vodedit">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap"
                      >
                        Add Video
                      </li>
                    </a>
                  </ul>
                </div>
              {/if}
            </button>
          {/if}
        </ul>
      {/if}
    </nav>
  </div>
</header>
