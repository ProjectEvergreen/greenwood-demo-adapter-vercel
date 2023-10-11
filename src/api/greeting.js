import { render } from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';
import { html } from 'lit';
import { Readable } from 'stream';
import { Buffer } from 'buffer';
import '../components/greeting.js';

async function streamToString (stream) {
  const chunks = [];

  for await (let chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf-8');
}

export async function handler(request) {
  const params = new URLSearchParams(request.url.slice(request.url.indexOf('?')));
  const name = params.has('name') ? params.get('name') : 'Greenwood';
  const result = render(html`
    <app-greeting name=${name}></app-greeting>
  `);
  const body = await streamToString(Readable.from(result));

  console.log({ body, result });

  return new Response(body, {
    headers: new Headers({
      'Content-Type': 'text/html'
    })
  });
}