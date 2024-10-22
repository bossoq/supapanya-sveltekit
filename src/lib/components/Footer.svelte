<script lang="ts">
  import Fa from 'svelte-fa'
  import { faFacebook } from '@fortawesome/free-brands-svg-icons'
</script>

<footer class="w-full sticky bottom-0 center flex gap-2 justify-center bg-gray-100 text-gray-800">
  <footer class="pt-5 pb-5 w-full container">
    <div class="flex flex-row justify-between items-center">
      <span>© 2024 สงวนลิขสิทธิ์ โดย สถาบันศุภปัญญา ไอ.เค.</span>
      <a
        target="_blank"
        href="https://www.facebook.com/supapanyaik"
        title="facebook"
        rel="noreferrer"
      >
        <div class="text-right flex flex-row gap-2 items-center justify-center">
          <Fa icon={faFacebook} size="lg" />
          <span>สถาบันศุภปัญญาไอ.เค.</span>
        </div>
      </a>
    </div>
  </footer>
</footer>
