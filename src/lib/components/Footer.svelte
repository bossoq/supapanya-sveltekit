<script lang="ts">
  import { Facebook, Twitter, Line } from 'svelte-share-buttons-component'

  export let url: string
  export let title: string
</script>

{#if url}
  <footer class="w-full sticky bottom-4 center flex gap-2 pr-4 sm:pr-0 justify-center">
    <Facebook class="h-10 w-10 rounded-full" {url} quote={title} />
    <Twitter class="h-10 w-10 rounded-full" {url} text={title} />
    <Line class="h-10 w-10 rounded-full" {url} />
  </footer>
{/if}
