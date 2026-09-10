import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';

const MAX_CSV_BYTES = 1_000_000;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const constantTimeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

// POST /ingest
// Body: { csv: string, season: string, source: { subject, from?, messageId?, fileName? },
//         receivedAt?: number, dryRun?: boolean, force?: boolean }
// Auth: Authorization: Bearer <INGEST_SECRET>
const ingest = httpAction(async (ctx, request) => {
  const secret = process.env.INGEST_SECRET;
  if (!secret) return json(500, { error: 'INGEST_SECRET is not configured' });

  const auth = request.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!constantTimeEqual(token, secret)) return json(401, { error: 'unauthorized' });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { error: 'body must be JSON' });
  }
  if (!body || typeof body !== 'object') return json(400, { error: 'body must be a JSON object' });

  const { csv, season, source, receivedAt, dryRun, force } = body;
  if (typeof csv !== 'string' || !csv.trim()) return json(400, { error: '`csv` must be a non-empty string' });
  if (csv.length > MAX_CSV_BYTES) return json(400, { error: '`csv` is too large' });
  if (typeof season !== 'string' || !season.trim()) return json(400, { error: '`season` must be a non-empty string' });

  const src = (source ?? {}) as Record<string, unknown>;
  if (typeof src !== 'object' || (src.subject !== undefined && typeof src.subject !== 'string')) {
    return json(400, { error: '`source.subject` must be a string' });
  }
  const optionalString = (value: unknown) => (typeof value === 'string' ? value : undefined);

  if (receivedAt !== undefined && typeof receivedAt !== 'number') return json(400, { error: '`receivedAt` must be a number' });
  if (dryRun !== undefined && typeof dryRun !== 'boolean') return json(400, { error: '`dryRun` must be a boolean' });
  if (force !== undefined && typeof force !== 'boolean') return json(400, { error: '`force` must be a boolean' });

  const result = await ctx.runMutation(internal.ingest.apply, {
    csv,
    season: season.trim(),
    source: {
      subject: typeof src.subject === 'string' ? src.subject : 'manual',
      from: optionalString(src.from),
      messageId: optionalString(src.messageId),
      fileName: optionalString(src.fileName),
    },
    receivedAt: receivedAt as number | undefined,
    dryRun: dryRun as boolean | undefined,
    force: force as boolean | undefined,
  });

  return json(200, result);
});

const http = httpRouter();
http.route({ path: '/ingest', method: 'POST', handler: ingest });
export default http;
