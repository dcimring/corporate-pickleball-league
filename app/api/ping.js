export const config = {
  runtime: 'nodejs',
};

export default function handler(_req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.statusCode = 200;
  res.end('pong');
}
