import { greenwoodPluginAdapterVercel } from '@greenwood/plugin-adapter-vercel';

export default {
  plugins: [
    greenwoodPluginAdapterVercel({
      runtime: 'nodejs22.x'
    })
  ]
};