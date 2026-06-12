<script lang="ts">
  import '../app.css'
  import { injectAnalytics } from '@vercel/analytics/sveltekit'
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'
  import Head from '$lib/components/Head.svelte'
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import ToastNotify from '$lib/components/ToastNotify.svelte'
  import { darkTheme, toastsList } from '$lib/store'
  import { dev } from '$app/environment'
  import { PUBLIC_GOOGLE_ANALYTICS } from '$env/static/public'
  import type { LayoutData } from './$types'

  const url = 'https://supapanya.com'
  const title = 'สถาบันศุภปัญญาไอ.เค.'
  const description =
    'สถาบันกวดวิชาชั้นนำในย่านหนองแขม รองรับรูปแบบการสอนสดทางไกล มั่นใจในคุณภาพ ด้วยประสบการณ์กว่า 30 ปี'

  const imageUrl = `${url}/screenshot.jpg`
  const gtagId = PUBLIC_GOOGLE_ANALYTICS
  // const cfToken = { token: PUBLIC_CF_TOKEN }
  const cfToken = null
  const themeIcons = ['🌞 ธีมสว่าง', '🌙 ธีมมืด']
  const themeEnabler = false

  export let data: LayoutData
  const userData = data.user
  injectAnalytics({ mode: dev ? 'development' : 'production' })
  injectSpeedInsights()
</script>

<Head {title} {description} {url} {imageUrl} {gtagId} {cfToken} />
<div class="{$darkTheme && themeEnabler ? 'dark' : ''} grayscale w-full h-screen flex flex-col">
  <Header {themeIcons} {themeEnabler} {userData} />
  <main id="main" class="overflow-y-scroll hide-scrollbar">
    <ToastNotify {toastsList} />
    <slot />
  </main>
  <Footer />
</div>
