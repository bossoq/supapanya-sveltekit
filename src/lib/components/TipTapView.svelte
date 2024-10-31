<script lang="ts">
  import type { JSONContent } from '@tiptap/core'
  import TipTap from '$lib/components/TipTap.svelte'
  import TipTapRender from '$lib/components/TipTapRender.svelte'

  export let content: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: {
          textAlign: 'left'
        },
        content: [
          {
            type: 'text',
            text: 'Hello World! 🌍️'
          }
        ]
      }
    ]
  }
  export let editMode = false
  export let editable = false
  export let handleSave: (payload: JSONContent) => void
</script>

{#if editable}
  <button
    class="p-2 my-2 text-md md:text-lg text-white bg-teal-500 hover:bg-teal-700 rounded-lg transition-all ease-in-out duration-200"
    onclick={() => (editMode = !editMode)}>{editMode ? 'Normal Mode' : 'Edit Mode'}</button
  >
{/if}
{#if editMode}
  <TipTap bind:content {handleSave} />
{:else}
  <TipTapRender bind:content />
{/if}
