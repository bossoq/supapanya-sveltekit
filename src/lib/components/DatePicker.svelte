<script lang="ts">
  import { onMount } from 'svelte'
  import flatpickr from 'flatpickr'
  import type { Instance } from 'flatpickr/dist/types/instance'
  import type { Options } from 'flatpickr/dist/types/options'

  export let value: Date | undefined = undefined
  export let options: Options = {}

  let input: HTMLInputElement
  let fp: Instance | undefined

  onMount(() => {
    fp = flatpickr(input, {
      ...options,
      defaultDate: value ?? options.defaultDate,
      onChange: (selectedDates) => {
        value = selectedDates[0]
      }
    })
    return () => fp?.destroy()
  })

  $: if (fp && value?.getTime() !== fp.selectedDates[0]?.getTime()) {
    fp.setDate(value ?? [], false)
  }
</script>

<input bind:this={input} {...$$restProps} />
