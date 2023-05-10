import { afterAll, assert, beforeAll, describe, expect, it } from 'vitest';
import type { UnstableDevWorker } from 'wrangler';
import { unstable_dev } from 'wrangler';

describe('Worker', () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true },
      local: false,
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it('should return an audio file', async () => {
    const res = await worker.fetch('audios/300 whatsapp.ogg');
    const type = res.headers.get('content-type');
    const isAudio = type === 'audio/ogg';
    assert(isAudio, 'Response is not an audio file');
  });

  it('should return 404 when no file', async () => {
    const res = await worker.fetch('audios/no-file.ogg');
    const text = await res.text();
    expect(res.status).toBe(404);
    expect(text).toMatch('File not found');
  });
});
