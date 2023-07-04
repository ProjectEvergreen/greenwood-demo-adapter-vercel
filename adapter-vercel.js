import fs from 'fs/promises';
import { checkResourceExists } from '@greenwood/cli/src/lib/resource-utils.js';

function generateOutputFormat(id, type) {
  const path = type === 'page'
    ? `__${id}`
    : `api/${id}`;

  return `
    import { handler as ${id} } from '../public/${path}.js';

    export default async function handler (request, response) {
      const { url, headers } = request;
      const req = new Request(new URL(url, \`http://\${headers.host}\`), {
        headers: new Headers(headers)
      });
      const res = await ${id}(req);

      // TODO need to handle all Response properties like headers
      // https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js#node.js-request-and-response-objects
      response.status(res.status);
      response.send(await res.text());
    }
  `;
}

async function vercelAdapter(compilation) {
  console.log('ENTER vercelAdapter');
  const adapterOutputUrl = new URL('./api/', compilation.context.projectDirectory);
  const ssrPages = compilation.graph.filter(page => page.isSSR);
  const apiRoutes = compilation.manifest.apis;

  if (!await checkResourceExists(adapterOutputUrl)) {
    await fs.mkdir(adapterOutputUrl);
  }

  console.log({ ssrPages, apiRoutes });

  for (const page of ssrPages) {
    const { id } = page;
    const outputFormat = generateOutputFormat(id, 'page');

    await fs.writeFile(new URL(`./${id}.js`, adapterOutputUrl), outputFormat);
  }

  // public/api/
  for (const [key] of apiRoutes) {
    const id = key.replace('/api/', '');
    const outputFormat = generateOutputFormat(id, 'api');

    await fs.writeFile(new URL(`./${id}.js`, adapterOutputUrl), outputFormat);
  }
}

const greenwoodPluginAdapterVercel = (options = {}) => [{
  type: 'adapter',
  name: 'plugin-adapter-vercel',
  provider: (compilation) => {
    return async () => {
      await vercelAdapter(compilation, options);
    };
  }
}];

export { greenwoodPluginAdapterVercel };