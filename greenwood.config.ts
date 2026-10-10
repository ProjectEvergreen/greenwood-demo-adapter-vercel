import { greenwoodPluginAdapterVercel } from '@greenwood/plugin-adapter-vercel';
import type { Config } from '@greenwood/cli';

export default {
  plugins: [
    greenwoodPluginAdapterVercel()
  ]
} satisfies Config;