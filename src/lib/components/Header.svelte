<script lang="ts">
  import { page } from '$app/stores'
  import { slide } from 'svelte/transition'
  import { onMount } from 'svelte'
  import { darkTheme } from '$lib/store'
  import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

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
  const menus = [
    {
      name: 'คอร์สเรียน',
      type: 'link',
      link: '/course',
      show: true
    },
    {
      name: 'ประวัติ',
      type: 'dropdown',
      id: 1,
      show: true,
      dropdown: [
        {
          name: 'รีวิว',
          type: 'link',
          link: '/review'
        },
        {
          name: 'ความสำเร็จของเรา',
          type: 'link',
          link: '/portfolio'
        }
      ]
    },
    {
      name: 'บทความ',
      type: 'dropdown',
      id: 2,
      show: true,
      dropdown: [
        {
          name: 'บทความที่น่าสนใจ',
          type: 'link',
          link: '/blog'
        },
        {
          name: 'เกร็ดความรู้',
          type: 'link',
          link: '/studytips'
        }
      ]
    },
    {
      name: 'ติดต่อเรา',
      type: 'link',
      link: '/contact',
      show: true
    },
    {
      name: 'ห้องเรียน',
      type: 'dropdown',
      id: 3,
      show: Boolean(userData),
      dropdown: [
        {
          name: 'ห้องเรียนออนไลน์',
          type: 'link',
          link: '/live'
        },
        {
          name: 'บันทึกการสอน',
          type: 'link',
          link: '/vod'
        }
      ]
    },
    {
      name: 'ออกจากระบบ',
      type: 'link',
      link: '/logout',
      show: Boolean(userData),
      click: (e: Event) => {
        e.preventDefault()
        userData = null
        window.location.href = '/'
      }
    },
    {
      name: 'เข้าสู่ระบบ',
      type: 'link',
      link: '/login',
      show: !Boolean(userData)
    },
    {
      name: 'Admin',
      type: 'dropdown',
      id: 4,
      show: Boolean(userData) && Boolean(userData?.meta.isAdmin),
      dropdown: [
        {
          name: 'Register',
          type: 'link',
          link: '/register'
        },
        {
          name: 'Video List',
          type: 'link',
          link: '/vodlist'
        },
        {
          name: 'Add Video',
          type: 'link',
          link: '/vodedit'
        }
      ]
    }
  ]
</script>

<header class="w-full sticky top-0">
  <div class="flex w-full h-8 sm:h-10 bg-blue-light-key text-white justify-center items-center">
    <div class="flex flex-row gap-6 container w-full items-center">
      <div id="top-bar-left" class="flex flex-row gap-6 mr-auto items-center">
        <div class="flex flex-row gap-2 items-center justify-center">
          <svg class="aspect-square w-6" fill="currentColor">
            <use xlink:href="{remixiconUrl}#ri-phone-fill" />
          </svg>
          <a href="tel: +6662-225-6359" class="text-sm sm:text-lg">062 225 6359</a>
        </div>
        <div class="hidden sm:flex flex-row gap-2 items-center justify-center">
          <svg class="aspect-square w-6" fill="currentColor">
            <use xlink:href="{remixiconUrl}#ri-mail-fill" />
          </svg>
          <a href="mailto:kittipos@picturo.us" class="text-sm sm:text-lg">kittipos@picturo.us</a>
        </div>
      </div>
      <div id="top-bar-right" class="flex flex-row gap-6 ml-auto items-center">
        <div class="flex flex-row gap-2 items-center justify-center">
          <svg class="aspect-square w-6" fill="currentColor">
            <use xlink:href="{remixiconUrl}#ri-facebook-circle-fill" />
          </svg>
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
          {#snippet menuLink(
            name: string,
            link: string | undefined,
            show: boolean,
            click: (e: Event) => void = () => {}
          )}
            {#if show}
              <a
                class="hover:transition-all ease-in-out duration-200 rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap {$page.url.pathname.includes(
                  link || ''
                )
                  ? 'text-green-light-key border-b-green-light-key'
                  : ''}"
                data-sveltekit-preload-data="tap"
                onclick={click}
                href={link}
              >
                {name}
              </a>
            {/if}
          {/snippet}
          {#snippet menuDropdown(
            name: string,
            id: number | undefined,
            show: boolean,
            dropdown: { name: string; link: string }[] | undefined
          )}
            {#if show}
              <button
                class="flex flex-col items-center justify-between"
                onmouseenter={(e) => id && toggleSubMenu(e, id, 'in')}
                onmouseleave={(e) => id && toggleSubMenu(e, id, 'out')}
                onfocusin={(e) => id && toggleSubMenu(e, id, 'in')}
                onfocusout={(e) => id && toggleSubMenu(e, id, 'out')}
                onclick={(e) => id && toggleSubMenu(e, id, 'click')}
              >
                <p
                  class="hover:transition-all ease-in-out duration-200 w-full flex justify-between items-center rounded hover:bg-gray-50 p-1 text-gray-800 border-4 border-transparent hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap {dropdown &&
                  dropdown.some(({ link }) => $page.url.pathname.includes(link))
                    ? 'text-green-light-key border-b-green-light-key'
                    : ''}"
                >
                  {name}
                  <svg
                    class="w-5 h-5 ml-1 {id && showNav[id - 1]
                      ? 'transition rotate-180'
                      : 'transition rotate-0'}"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </p>
                {#if id && showNav[id - 1] && dropdown}
                  <div
                    class="text-left md:text-center z-20 px-2 md:p-0 w-full md:absolute md:top-[calc(5rem+8px)] bg-white divide-y divide-gray-100 rounded-lg md:shadow md:w-44"
                    transition:slide
                  >
                    <ul class="pb-2">
                      {#each dropdown as { name, link }}
                        <a data-sveltekit-preload-data="tap" href={link}>
                          <li
                            class="hover:transition-all ease-in-out duration-200 border-4 border-transparent hover:bg-gray-50 hover:text-green-light-key hover:border-b-green-light-key focus:bg-gray-50 focus:text-green-light-key focus:border-b-green-light-key whitespace-nowrap {$page.url.pathname.includes(
                              link
                            )
                              ? 'text-green-light-key border-b-green-light-key'
                              : ''}"
                          >
                            {name}
                          </li>
                        </a>
                      {/each}
                    </ul>
                  </div>
                {/if}
              </button>
            {/if}
          {/snippet}
          {#each menus as { name, type, id, link, show, click, dropdown }}
            {#if type === 'link'}
              {@render menuLink(name, link, show, click)}
            {:else if type === 'dropdown'}
              {@render menuDropdown(name, id, show, dropdown)}
            {/if}
          {/each}
        </ul>
      {/if}
    </nav>
  </div>
</header>
