import { Env } from '@/env';
import { getIndex, initializeIndexValue } from '@/utils/kv';
import { search } from '@/utils/search';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Env }>();

app.use(
  '*',
  cors({
    origin: '*',
  }),
);

app.get('/audios/:name', async (c) => {
  const { name } = c.req.param();

  const file = await c.env.audiosBucket.get(name);
  if (!file) return c.text('File not found', 404);

  const headers = new Headers();
  file.writeHttpMetadata(headers);
  headers.set('content-type', 'audio/ogg');
  headers.set('etag', file.etag);

  const fielBuffer = await file.arrayBuffer();
  return c.body(fielBuffer, { headers });
});

app.get('/audios/search/:q/:limit?', async (c) => {
  const { q, limit } = c.req.param();

  const index = await getIndex(c.env.audiosKV);
  if (index.length === 0) return c.text('Files not found', 404);

  const searchLimit = limit ? Number(limit) : 10;
  const result = search(index, { q, limit: searchLimit });

  return c.json(result);
});

app.get('/kv/audios/reset', async (c) => {
  await initializeIndexValue(c.env.audiosBucket, c.env.audiosKV);
  return c.text('Audios KV index reseted');
});

export default app;
