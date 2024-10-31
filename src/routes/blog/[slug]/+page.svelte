<script lang="ts">
  import TipTapRender from '$lib/components/TipTapRender.svelte'
  import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
  import type { JSONContent } from '@tiptap/core'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  const { user, props } = data
  const blog = props.blog
</script>

<svelte:head>
  <title>{blog.postTitle} - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)] pt-4">
  <div class="container flex flex-col">
    <section class="flex flex-row gap-1 justify-end items-center text-gray-500 pb-4">
      <span>Published by</span>
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
    <h1 class="text-center text-2xl md:text-4xl font-bold text-gray-800 py-4">{blog.postTitle}</h1>
    <TipTapRender content={blog.postContent as JSONContent} />
  </div>
</div>
