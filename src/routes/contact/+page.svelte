<script lang="ts">
  import ModalComponent from '$lib/components/ModalComponent.svelte'
  import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

  let modalViewed = false
</script>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)]">
  {#if modalViewed}
    <ModalComponent bind:modalViewed>
      <img src="/images/map.jpg" alt="map" class="w-full" loading="eager" />
    </ModalComponent>
  {/if}
  <div class="container flex flex-col gap-4">
    <section class="flex flex-row items-center justify-center gap-2">
      <svg class="aspect-square w-32 text-green-light-key" fill="currentColor">
        <use xlink:href="{remixiconUrl}#ri-facebook-circle-fill" />
      </svg>
      <div class="max-w-xl">
        <iframe
          title="facebook"
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fsupapanyaik%2F&amp;tabs&amp;width=340&amp;height=70&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=false&amp;show_facepile=true&amp;appId=537431717232728"
          class="border-none overflow-hidden"
          width="340"
          height="70"
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        >
        </iframe>
      </div>
    </section>
    <section class="flex flex-row items-center justify-center gap-2">
      <svg class="aspect-square w-32 text-green-light-key" fill="currentColor">
        <use xlink:href="{remixiconUrl}#ri-phone-fill" />
      </svg>
      <div class="max-w-xl">
        <a href="tel: +6662-225-6359" class="text-2xl font-bold">062 225 6359 (ครูก้อย)</a>
      </div>
    </section>
    <section class="flex flex-row items-center justify-center gap-2">
      <svg class="aspect-square w-32 text-green-light-key" fill="currentColor">
        <use xlink:href="{remixiconUrl}#ri-road-map-fill" />
      </svg>
      <div class="max-w-xl">
        <button onclick={() => (modalViewed = true)}>
          <img src="/images/map.jpg" alt="map" class="h-[20vh]" loading="eager" />
        </button>
      </div>
    </section>
    <section class="flex flex-row items-center justify-center gap-2">
      <svg class="aspect-square w-32 text-green-light-key" fill="currentColor">
        <use xlink:href="{remixiconUrl}#ri-map-pin-2-fill" />
      </svg>
      <div class="max-w-xl">
        <a href="https://goo.gl/maps/gdjEErdsk46xZTpBA" target="_blank" rel="noreferrer">
          <img src="/images/googlemaps.jpg" alt="map" class="h-[20vh]" loading="eager" />
        </a>
      </div>
    </section>
  </div>
</div>
