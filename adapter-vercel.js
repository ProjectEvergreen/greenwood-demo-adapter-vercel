import fs from 'fs/promises';
import { checkResourceExists } from '@greenwood/cli/src/lib/resource-utils.js';

function generateOutputFormat(id, type) {
  const path = type === 'page'
    ? `__${id}`
    : `api/${id}`;

  // TODO do all these things
  // https://github.com/vercel/examples/tree/main/build-output-api/serverless-functions
  return `
    // import { handler as ${id} } from './${id}.js';

    console.log('top of api handler file for ${id}!');

    export default function handler (request, response) {
      console.log('enter api handler for ${id}!');
      console.log({ request, response });
      // const { url, headers } = request;
      // const req = new Request(new URL(url, \`http://\${headers.host}\`), {
      //   headers: new Headers(headers)
      // });
      // const res = await ${id}(req);

      // // TODO need to handle all Response properties like headers
      // // https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js#node.js-request-and-response-objects
      // response.status(res.status);
      // response.send(await res.text());
      // response.status(200);
      response.send('it works!');
      // response.status(200).json({
      //   body: request.body,
      //   query: request.query,
      //   cookies: request.cookies,
      // });
    }
  `;
}

async function vercelAdapter(compilation) {
  console.log('ENTER vercelAdapter');
  const { outputDir, projectDirectory } = compilation.context;
  const adapterOutputUrl = new URL('./.vercel/output/functions/', projectDirectory);
  const ssrPages = compilation.graph.filter(page => page.isSSR);
  const apiRoutes = compilation.manifest.apis;

  if (!await checkResourceExists(adapterOutputUrl)) {
    await fs.mkdir(adapterOutputUrl, { recursive: true });
    // await fs.mkdir(new URL('./static/', adapterOutputUrl), { recursive: true });
  }

  await fs.writeFile(new URL('./.vercel/output/config.json', projectDirectory), JSON.stringify({
    'version': 3
  }));

  console.log({ ssrPages, apiRoutes, adapterOutputUrl });
  console.log('compilation.context.outputDir ????', outputDir);
  console.log('CWD (import.meta.url)????', import.meta.url);

  // "runtime": "nodejs16.x",
  // "handler": "serve.js",
  // "maxDuration": 3,
  // "launcherType": "Nodejs",
  // "shouldAddHelpers": true,
  // "shouldAddSourcemapSupport": true
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
    const outputRoot = new URL(`./api/${id}.func/`, adapterOutputUrl);

    await fs.mkdir(outputRoot, { recursive: true });
    await fs.writeFile(new URL(`./index.js`, outputRoot), outputFormat);
    await fs.writeFile(new URL(`./package.json`, outputRoot), JSON.stringify({
      type: 'module'
    }));
    await fs.writeFile(new URL(`./.vc-config.json`, outputRoot), JSON.stringify({
      runtime: 'nodejs18.x',
      handler: 'index.js',
      launcherType: 'Nodejs'
    }));

    // TODO ideally all functions would be self contained
    // https://github.com/ProjectEvergreen/greenwood/issues/1118
    await fs.cp(
      new URL(`./api/${id}.js`, outputDir),
      new URL(`${id}.js`, outputRoot),
      { recursive: true }
    );
    await fs.cp(
      new URL(`./api/assets/`, outputDir),
      new URL('./assets/', outputRoot),
      { recursive: true }
    );
  }

  await fs.cp(
    outputDir,
    new URL('./.vercel/output/static/', projectDirectory),
    {
      recursive: true
    }
  )
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