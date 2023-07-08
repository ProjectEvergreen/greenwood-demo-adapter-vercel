export async function handler() {
  const body = { message: 'it works!' };
  const headers = new Headers();

  headers.append('Content-Type', 'application/json');

  return new Response(JSON.stringify(body), {
    headers
  });
}