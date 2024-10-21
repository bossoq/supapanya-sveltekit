<script lang="ts">
  import { slide } from 'svelte/transition'
  import { onMount } from 'svelte'
  import { darkTheme } from '$lib/store'
  import Fa from 'svelte-fa'
  import { faFacebook } from '@fortawesome/free-brands-svg-icons'
  import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons'

  export let themeIcons: string[]
  export let themeEnabler: boolean
  export let userData: UserInfo
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
  let showNav1 = false
  let showNav2 = false
  let showNav3 = false

  const toggleNavbar = () => {
    showMenu = !showMenu
  }
  const toggleSubMenu = (num: number, event: string) => {
    if (num === 1) {
      if (event === 'in' && !mobileMenu) {
        showNav1 = true
        showNav2 = false
        showNav3 = false
      } else if (event === 'out' && !mobileMenu) {
        showNav1 = false
        showNav2 = false
        showNav3 = false
      } else if (event === 'click' && mobileMenu) {
        showNav1 = !showNav1
        showNav2 = false
        showNav3 = false
      }
    } else if (num === 2) {
      if (event === 'in' && !mobileMenu) {
        showNav1 = false
        showNav2 = true
        showNav3 = false
      } else if (event === 'out' && !mobileMenu) {
        showNav1 = false
        showNav2 = false
        showNav3 = false
      } else if (event === 'click' && mobileMenu) {
        showNav1 = false
        showNav2 = !showNav2
        showNav3 = false
      }
    } else {
      if (event === 'in' && !mobileMenu) {
        showNav1 = false
        showNav2 = false
        showNav3 = true
      } else if (event === 'out' && !mobileMenu) {
        showNav1 = false
        showNav2 = false
        showNav3 = false
      } else if (event === 'click' && mobileMenu) {
        showNav1 = false
        showNav2 = false
        showNav3 = !showNav3
      }
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
              on:click={() => ($darkTheme = !$darkTheme)}
              class="text-xs sm:text-base cursor-pointer select-none bg-sky-800 text-white rounded p-2"
            >
              {$darkTheme ? themeIcons[1] : themeIcons[0]}
            </button>
          </div>
          <div class="flex sm:hidden flex-row gap-2">
            <button
              on:click={() => ($darkTheme = !$darkTheme)}
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
        <a href="/">
          <div class="flex flex-row container items-center justify-center">
            <img src="/images/logo.png" alt="Supapanya Logo" class="h-8" />
          </div>
        </a>
        <div class="flex md:hidden">
          <button
            type="button"
            class="text-gray-800 hover:text-gray-400 focus:outline-none focus:text-gray-400"
            on:click|preventDefault={toggleNavbar}
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
            class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
            href="/blog">คอร์สเรียน</a
          >
          <button
            class="flex flex-col items-center justify-between"
            on:mouseenter|preventDefault={() => toggleSubMenu(1, 'in')}
            on:mouseleave|preventDefault={() => toggleSubMenu(1, 'out')}
            on:focusin|preventDefault={() => toggleSubMenu(1, 'in')}
            on:focusout|preventDefault={() => toggleSubMenu(1, 'out')}
            on:click|preventDefault={() => toggleSubMenu(1, 'click')}
          >
            <button
              class="hover:transition-all ease-in-out duration-200 w-full flex justify-between items-center rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
            >
              ประวัติ
              <svg
                class="w-5 h-5 ml-1 {showNav1 ? 'transition rotate-180' : 'transition rotate-0'}"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                /></svg
              >
            </button>
            {#if showNav1}
              <div
                id="dropdownNavbarReviewItem"
                class="text-left md:text-center z-20 px-2 md:p-0 w-full md:absolute md:top-[calc(5rem+8px)] bg-white divide-y divide-gray-100 rounded-lg md:shadow md:w-44"
                transition:slide
              >
                <ul class="pb-2">
                  <a href="/">
                    <li
                      class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                    >
                      รีวิว
                    </li>
                  </a>
                  <a href="/">
                    <li
                      class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                    >
                      ความสำเร็จของเรา
                    </li>
                  </a>
                </ul>
              </div>
            {/if}
          </button>
          <a
            class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
            href="/about">บทความ</a
          >
          <a
            class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
            href="/about">ติดต่อเรา</a
          >
          {#if userData}
            <button
              class="flex flex-col items-center justify-between"
              on:mouseenter|preventDefault={() => toggleSubMenu(2, 'in')}
              on:mouseleave|preventDefault={() => toggleSubMenu(2, 'out')}
              on:focusin|preventDefault={() => toggleSubMenu(2, 'in')}
              on:focusout|preventDefault={() => toggleSubMenu(2, 'out')}
              on:click|preventDefault={() => toggleSubMenu(2, 'click')}
            >
              <button
                class="hover:transition-all ease-in-out duration-200 w-full flex justify-between items-center rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
              >
                ห้องเรียน
                <svg
                  class="w-5 h-5 ml-1 {showNav2 ? 'transition rotate-180' : 'transition rotate-0'}"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  /></svg
                >
              </button>
              {#if showNav2}
                <div
                  id="dropdownNavbarReviewItem"
                  class="text-left md:text-center z-20 px-2 md:p-0 w-full md:absolute md:top-[calc(5rem+8px)] bg-white divide-y divide-gray-100 rounded-lg md:shadow md:w-44"
                  transition:slide
                >
                  <ul class="pb-2">
                    <a href="/">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                      >
                        ห้องเรียนออนไลน์
                      </li>
                    </a>
                    <a href="/">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                      >
                        บันทึกการสอน
                      </li>
                    </a>
                  </ul>
                </div>
              {/if}
            </button>
            <a
              class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
              href="/about">ออกจากระบบ</a
            >
          {:else}
            <a
              class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
              href="/about">เข้าสู่ระบบ</a
            >
          {/if}
          {#if userData && userData.role === 'admin'}
            <button
              class="flex flex-col items-center justify-between"
              on:mouseenter|preventDefault={() => toggleSubMenu(3, 'in')}
              on:mouseleave|preventDefault={() => toggleSubMenu(3, 'out')}
              on:focusin|preventDefault={() => toggleSubMenu(3, 'in')}
              on:focusout|preventDefault={() => toggleSubMenu(3, 'out')}
              on:click|preventDefault={() => toggleSubMenu(3, 'click')}
            >
              <button
                class="hover:transition-all ease-in-out duration-200 w-full flex justify-between items-center rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
              >
                Admin
                <svg
                  class="w-5 h-5 ml-1 {showNav3 ? 'transition rotate-180' : 'transition rotate-0'}"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  /></svg
                >
              </button>
              {#if showNav3}
                <div
                  id="dropdownNavbarReviewItem"
                  class="text-left md:text-center z-20 px-2 md:p-0 w-full md:absolute md:top-[calc(5rem+8px)] bg-white divide-y divide-gray-100 rounded-lg md:shadow md:w-44"
                  transition:slide
                >
                  <ul class="pb-2">
                    <a href="/">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                      >
                        Register
                      </li>
                    </a>
                    <a href="/">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
                      >
                        Video List
                      </li>
                    </a>
                    <a href="/">
                      <li
                        class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key"
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
