import { sveltekit } from '@sveltejs/kit/vite'
import { vite as vidstack } from 'vidstack/plugins'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [vidstack(), sveltekit()]
}

export default config
