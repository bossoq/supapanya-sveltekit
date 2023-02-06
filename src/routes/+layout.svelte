<script lang="ts">
  import '../app.css'
  import Head from '$lib/components/Head.svelte'
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import Modal from '$lib/components/Modal.svelte'
  import { darkTheme, modalViewed } from '$lib/store'
  import { PUBLIC_GOOGLE_ANALYTICS, PUBLIC_CF_TOKEN } from '$env/static/public'

  const url = 'https://supapanya.com'
  const title = 'สถาบันศุภปัญญาไอ.เค.'
  const description =
    'สถาบันกวดวิชาชั้นนำในย่านหนองแขม รองรับรูปแบบการสอนสดทางไกล มั่นใจในคุณภาพ ด้วยประสบการณ์กว่า 30 ปี'

  const imageUrl = `${url}/screenshot.jpg`
  const gtagId = PUBLIC_GOOGLE_ANALYTICS
  const cfToken = { token: PUBLIC_CF_TOKEN }
  const themeIcons = ['🌞 ธีมสว่าง', '🌙 ธีมมืด']
  const themeEnabler = false
</script>

<Head {title} {description} {url} {imageUrl} {gtagId} {cfToken} />
<div class="{$darkTheme && themeEnabler ? 'dark' : ''} w-full h-screen flex flex-col">
  <Header {themeIcons} {themeEnabler} />
  {#if $modalViewed}
    <Modal />
  {/if}
  <main class="overflow-y-scroll">
    <slot />
  </main>
  <Footer {url} {title} />
</div>
