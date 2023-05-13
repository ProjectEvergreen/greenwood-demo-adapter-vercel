// TODO should use src or public?  depends on dev vs production mode?
import { handler as greeting } from '../public/api/greeting.js';

export default async function handler (request, response) {
  const { url, headers } = request;
  const req = new Request(new URL(url, `http://${headers.host}`), {
    headers: new Headers(headers)
  });
  const res = await greeting(req);

  // TODO need to handle all Response properties like headers
  // https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js#node.js-request-and-response-objects
  response.status(res.status);
  response.send(await res.text());
}