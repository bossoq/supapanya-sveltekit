<script lang="ts">
  import '../app.css'
  import { inject, pageview } from '@vercel/analytics'
  import { injectSpeedInsights } from '@vercel/speed-insights'
  import { afterNavigate } from '$app/navigation'
  import { page } from '$app/state'
  import Head from '#lib/components/Head.svelte'
  import Header from '#lib/components/Header.svelte'
  import Footer from '#lib/components/Footer.svelte'
  import ToastNotify from '#lib/components/ToastNotify.svelte'
  import { darkTheme, toastsList } from '#lib/store.js'
  import { browser, dev } from '$app/env'
  import { PUBLIC_GOOGLE_ANALYTICS } from '$app/env/public'
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
  // The packages' /sveltekit entry points import $app/stores, which SvelteKit 3 removed, so this
  // does the same thing with the framework-agnostic entry points
  let speedInsights: ReturnType<typeof injectSpeedInsights> = null
  if (browser) {
    inject({
      mode: dev ? 'development' : 'production',
      disableAutoTrack: true,
      framework: 'sveltekit'
    })
    speedInsights = injectSpeedInsights({ route: page.route.id, framework: 'sveltekit' })
  }
  afterNavigate(({ to }) => {
    if (to?.route.id) {
      pageview({ route: to.route.id, path: to.url.pathname })
      speedInsights?.setRoute(to.route.id)
    }
  })
</script>

<Head {title} {description} {url} {imageUrl} {gtagId} {cfToken} />
<div class="{$darkTheme && themeEnabler ? 'dark' : ''} w-full h-screen flex flex-col">
  <div class="fixed inset-0 backdrop-grayscale pointer-events-none z-9998"></div>
  <Header {themeIcons} {themeEnabler} {userData} />
  <main id="main" class="overflow-y-scroll hide-scrollbar">
    <ToastNotify {toastsList} />
    <slot />
  </main>
  <Footer />
</div>
