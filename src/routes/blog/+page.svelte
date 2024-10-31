<script lang="ts">
  import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  const { user, props } = data
</script>

<svelte:head>
  <title>บทความที่น่าสนใจ - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)] pt-4">
  <div class="container flex flex-col">
    <section class="absolute bottom-20 right-24">
      <button
        class="bg-teal-400 text-white p-2 rounded-full hover:bg-teal-700 transition-all ease-in-out duration-300 hover:rotate-180"
        aria-label="เขียนบทความใหม่"
        on:click={() => (window.location.href = '/blog/new')}
      >
        <svg class="aspect-square w-6" fill="currentColor">
          <use xlink:href="{remixiconUrl}#ri-add-line" />
        </svg>
      </button>
    </section>
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each props.blogs as blog}
        <a
          class="text-gray-800 hover:text-blue-800 transition-all ease-in-out duration-300"
          href="/blog/{blog.postLink}"
        >
          <section class="flex flex-col items-center gap-2">
            <figure class="relative">
              <img
                src={blog.postPicture}
                class="object-cover aspect-[3/2] hover:scale-105 transition-all ease-in-out duration-300"
                alt={blog.postTitle}
                loading="lazy"
              />
              <div class="absolute top-0 right-0">
                <button
                  class="bg-gray-400 text-white p-2 hover:bg-gray-700 transition-all ease-in-out duration-300 opacity-50 hover:opacity-100"
                  aria-label="แก้ไขบทความ"
                  on:click={() => (window.location.href = `/blog/${blog.postLink}/edit`)}
                >
                  <svg class="aspect-square w-6" fill="currentColor">
                    <use xlink:href="{remixiconUrl}#ri-pencil-line" />
                  </svg>
                </button>
                <button
                  class="bg-gray-400 text-white p-2 hover:bg-gray-700 transition-all ease-in-out duration-300 opacity-50 hover:opacity-100"
                  aria-label="แก้ไขบทความ"
                  on:click={() => (window.location.href = `/blog/${blog.postLink}/delete`)}
                >
                  <svg class="aspect-square w-6" fill="currentColor">
                    <use xlink:href="{remixiconUrl}#ri-delete-bin-line" />
                  </svg>
                </button>
              </div>
            </figure>
            <section class="flex flex-row items-center gap-1 text-gray-500 text-sm">
              <span>
                <svg class="aspect-square w-5" fill="currentColor">
                  <use xlink:href="{remixiconUrl}#ri-user-3-fill" />
                </svg>
              </span>
              <span>{blog.user.displayName.split(' ')[0] || 'Anonymous'}</span>
              <span class="mx-1">on</span>
              <span>
                <svg class="aspect-square w-5" fill="currentColor">
                  <use xlink:href="{remixiconUrl}#ri-time-fill" />
                </svg>
              </span>
              <span
                >{new Date(blog.postDate).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span
              >
            </section>
            <section class="w-full">
              <h1 class="text-lg md:text-2xl font-bold">{blog.postTitle}</h1>
            </section>
            <section class="w-full">
              <p class="text-base md:text-lg">{blog.postExcerpt}...(อ่านต่อ)</p>
            </section>
          </section>
        </a>
      {/each}
    </section>
  </div>
</div>
