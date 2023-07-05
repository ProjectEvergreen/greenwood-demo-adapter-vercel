import fs from 'fs/promises';
import { checkResourceExists } from '@greenwood/cli/src/lib/resource-utils.js';

function generateOutputFormat(id, type) {
  const path = type === 'page'
    ? `__${id}`
    : `api/${id}`;

  // TODO do all these things
  // https://github.com/vercel/examples/tree/main/build-output-api/serverless-functions
  return `
    import { handler as ${id} } from '../../../../public/${path}.js';

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
  const adapterOutputUrl = new URL('./.vercel/output/functions/', compilation.context.projectDirectory);
  const ssrPages = compilation.graph.filter(page => page.isSSR);
  const apiRoutes = compilation.manifest.apis;

  if (!await checkResourceExists(adapterOutputUrl)) {
    await fs.mkdir(adapterOutputUrl, { recursive: true });
  }

  console.log({ ssrPages, apiRoutes, adapterOutputUrl });
  console.log('compilation.context.outputDir ????', compilation.context.outputDir);
  console.log('CWD (import.neta.url)????', import.meta.url);

  for (const page of ssrPages) {
    const { id } = page;
    const outputFormat = generateOutputFormat(id, 'page');

    await fs.mkdir(new URL(`./${id}.func/`, adapterOutputUrl), { recursive: true });
    await fs.writeFile(new URL(`./${id}.func/index.js`, adapterOutputUrl), outputFormat);
    await fs.writeFile(new URL(`./${id}.func/.vc-config.json`, adapterOutputUrl), JSON.stringify({
      runtime: 'nodejs18.x',
      handler: 'index.js',
    }));
  }

  // public/api/
  for (const [key] of apiRoutes) {
    const id = key.replace('/api/', '');
    const outputFormat = generateOutputFormat(id, 'api');

    await fs.mkdir(new URL(`./api/${id}.func/`, adapterOutputUrl), { recursive: true });
    await fs.writeFile(new URL(`./api/${id}.func/index.js`, adapterOutputUrl), outputFormat);
    await fs.writeFile(new URL(`./api/${id}.func/.vc-config.json`, adapterOutputUrl), JSON.stringify({
      runtime: 'nodejs18.x',
      handler: 'index.js',
    }));
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