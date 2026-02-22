export const config = {
  runtime: 'nodejs',
};

export default function handler() {
  return new Response('pong', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
