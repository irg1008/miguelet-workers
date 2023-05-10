import { Env } from '@/env';
import { Hono } from 'hono';

const app = new Hono<{ Bindings: Env }>();

app.get('/audios/:name?', async (c) => {
  const { name } = c.req.param();
  if (!name) return c.text('Name not valid', 404);

  const file = await c.env.BUCKET.get(name);
  if (!file) return c.text('File not found', 404);

  const headers = new Headers();
  file.writeHttpMetadata(headers);
  headers.set('content-type', 'audio/ogg');
  headers.set('etag', file.etag);

  return c.body(file.body, { headers });
});

export default app;
