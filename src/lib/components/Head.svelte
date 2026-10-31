<script lang="ts">
  import { afterNavigate } from '$app/navigation'

  export let title: string
  export let description: string
  export let url: string
  export let imageUrl: string
  export let gtagId: string | null
  export let cfToken: object | null

  afterNavigate(({ to }) => {
    // @ts-expect-error gtag is defined in the script below
    if (typeof gtag !== 'undefined' && gtagId && to) {
      // @ts-expect-error gtag is defined in the script below
      gtag('config', gtagId, {
        page_title: document.title,
        page_path: to.url.pathname
      })
    }
  })
</script>

<svelte:head>
  <title>{title}</title>

  <meta name="title" content={title} />
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta property="og:url" content={url} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:card" content="summary_large_image" />

  {#if imageUrl}
    <meta property="og:image" content={imageUrl} />
    <meta name="twitter:image" content={imageUrl} />
  {/if}

  {#if gtagId}
    <script async src="https://www.googletagmanager.com/gtag/js?id={gtagId}"></script>
    <script>
      window.dataLayer = window.dataLayer || []
      function gtag() {
        dataLayer.push(arguments)
      }
      gtag('js', new Date())
      gtag('config', { gtagId })
    </script>
  {/if}
  {#if cfToken}
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify(cfToken)}
    ></script>
  {/if}
</svelte:head>
